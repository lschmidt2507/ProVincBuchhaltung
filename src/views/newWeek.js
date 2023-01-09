import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table } from "reactstrap";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import {addDays, parseISO} from "date-fns";
import axios from "axios";
import Moment from "react-moment";
import { exact } from "prop-types";
import { da } from "date-fns/locale";
//import differenceInCalendarISOYears from 'date-fns/differenceInCalendarISOYears'

export default function NewWeek(){

    const history = useHistory();
    const [lastWeek, setLastWeek] = useState([])
    var [weekJSON, setWeekJSON] = useState([])
    const [unassignedSupply, setUnassignedSupply] = useState([])
    const [supplyToAdd, setSupplyToAdd] = useState([])
    var [supplyIDs, setSupplyIDs] = useState([])
    const [allProducts, setAllProducts] = useState([])
    var [profHyp, setProfHyp] = useState()
    var [sales_act, setSalesAct] = useState()
    const[stock, setStock] = useState()
    const jwt = localStorage.getItem("jwt")




    function goBack(){
        history.push("/admin/weeks");
    }

    async function pushNewWeekToServer(JS_Object){
        const response = await axios.post("http://178.254.2.54:5000/api/weekstats/new", JS_Object)
        const msg = await response.data
        console.log(JSON.stringify(msg))
    }

    const getLastWeekStatData = async() => {
        const response = await axios.post("http://178.254.2.54:5000/api/weekstats/last", {jwt})
        const js = await response.data;
        const lastWeekRaw = js["week_stats"]
        const id = lastWeekRaw[0]["id"]
        console.log("js:" + js.stringify)
        console.log("ID: " + id)
        const responseLastWeekDetail = await axios.post("http://178.254.2.54:5000/api/weekstats/single", {jwt, id})
        const js2 = await responseLastWeekDetail.data;
        const js_parsed = js2
        console.log("Return: " + js_parsed)
        return js_parsed
    }

    const getSupplyData = async() =>{
        const response = await axios.post("http://178.254.2.54:5000/api/supply/unassigned", {jwt})
        const js = await response.data;
        return js
    }

    const getStockData = async() =>{
        const response = await axios.post("http://178.254.2.54:5000/api/scale/getstock", {jwt})
        const js = await response.data;
        return js
    }

    const getProductsData = async() =>{
        const response = await axios.post("http://178.254.2.54:5000/api/weekstats/products", {jwt})
        const js = await response.data;
        return js
    }

    function getProdJson(JS_before){
        const newProdJSON = allProducts.map(product => {
            const sto = stock.products || []
            var s_before = 0
            var s_after = 0
            JS_before.map(p => {
                console.log(p.product_id + product.id)
                if(p.product_id === product.id){
                    s_before = p.stock_before
                    console.log("JS in Map: " + JSON.stringify(p))
                    console.log("s_before: " + s_before)
                }
            })
            sto.map(sto =>{
                if(sto.product_id === product.id){
                    s_after = sto.amount
                }
            })
            console.log("Name: " + product.name)
            return {
                "product_id":product.id,
                "name":product.name,
                "stock_before": s_before,
                "stock_after":s_after,
                "loss":0,
                "pp":product.pp,
                "sp":product.sp
            }
        })

        return newProdJSON
    }

    useEffect(() => {
        console.log("IN USE EFFECT")
        async function initData(){
            const prod = await getProductsData()
            await setAllProducts(prod)
            const res = await getLastWeekStatData()
            await setLastWeek(res)
            const s = await getStockData()
            await setStock(s)

            var js_clone = JSON.parse(JSON.stringify(res))

            const today = new Date
            const date_old = js_clone.week_stat.date_end
            const nextDate = addDays(parseISO(date_old), 1)
            js_clone.week_stat.date_start = nextDate
            js_clone.week_stat.date_end = today

            js_clone.products.map(product =>{
                product.stock_before = product.stock_after
                product.loss = 0
            })

            js_clone.week_stat.coins_register = 0
            js_clone.week_stat.bills_register = 0

            js_clone.week_stat.coins_transfer = 0
            js_clone.week_stat.bills_transfer = 0


            js_clone.products = getProdJson(js_clone.products)
            await setWeekJSON(js_clone)
            const supRes = await getSupplyData()
            await setUnassignedSupply(supRes)



            console.log("week after set:" + JSON.stringify(weekJSON))

        }
        initData();
        updateValue(0,0,0);
    }, [])

    function updateCheckbox(value){
        let newJS = Object.create(weekJSON)
        newJS.week_stat.was_regular = value
        setWeekJSON(newJS)
    }

    function returnDateRow(){
        try{
            console.log("js in Date:" + JSON.stringify(weekJSON))
            console.log("date-start?:" + JSON.stringify(weekJSON.week_stat.date_start))
            var start_date = weekJSON.week_stat.date_start
            //console.log("date_start: " + start_date)
            var end_date =  weekJSON.week_stat.date_end
        
            return(
                <Row key="dateRow">
                    <Col>
                        <DatePicker selected={start_date} dateFormat="dd.MM.yyyy" onChange={date => updateDate("date_start", date)}></DatePicker>
                    </Col>
                    <Col>
                        <DatePicker selected={end_date} dateFormat="dd.MM.yyyy" onChange={date => updateDate("date_end", date)}></DatePicker>
                    </Col>
                    <Col>
                        <Input type="checkbox" onChange={e => updateCheckbox(e.target.checked)}/>
                    </Col>
                </Row>
            )

        } catch (error){

        }
   
    }

 

    function updateDate(type, date){
        let newJS = Object.create(weekJSON)
        var updatedSupplyToAdd = new Object();
        var IDs = [];
        updatedSupplyToAdd = []
        try{
            newJS.week_stat[type] = date

            
            const supplies = unassignedSupply
            supplies.map(supply => {
                const date = Date.parse(supply.supplyDate)
                if(weekJSON.week_stat.date_start < date && weekJSON.week_stat.date_end >= date){
                    var toAddBefore = supplyToAdd[supply.product_id] || 0
                    updatedSupplyToAdd[supply.product_id] = toAddBefore + supply.amount
                    console.log("Sup ID: " + supply.id)
                    IDs.push(supply.id)
                }
            });

        }catch{

        }
        updatedSupplyToAdd.map(s => {
            console.log("in array before: " + s)
        })
        setSupplyToAdd(updatedSupplyToAdd)
        console.log("Supply to add updatet: " + JSON.stringify(supplyToAdd) + " " + updatedSupplyToAdd)
        const test = supplyToAdd
        test.map(supply => {
            console.log("In supply: " + supply)
        })
        setWeekJSON(newJS)
        console.log("IDs in Update: " + IDs)
        setSupplyIDs(IDs)
        updateValue(0,0,0);
    }


    function updateValue(id, name, value){
        console.log(id, name, value)
        var supplies = unassignedSupply.supplies
        let newJS = Object.create(weekJSON) 
        var profges = 0
        var salesges = 0
        var supIDs = []
        try{
        newJS.products.map(product =>{

            if(parseInt(product.product_id) === parseInt(id)){
                console.log("FOUND")
                product[name] = value

            }
            var supplyCount = 0
            supplies.map(s => {
                if (s.product_id === product.product_id){
                    const date = Date.parse(s.supplyDate)
                    if(weekJSON.week_stat.date_start < date && weekJSON.week_stat.date_end >= date){
                        supplyCount += s.amount
                        console.log("ID: " + s.id)
                        supIDs.push(s.id)
                    }
                }
            })

            const pcs_sold = product["stock_before"] + supplyCount - product["stock_after"] - product["loss"]
            const sales = pcs_sold * product["sp"]
            salesges += sales
            const profit = sales - (pcs_sold * product["pp"]) - (product["loss"] * product["pp"])
            profges+= profit
            

        })}catch{

        }
        console.log("SupIDs in updateValue: " + supIDs)
        setWeekJSON(newJS)
        setProfHyp(profges)
        setSalesAct(salesges)
        setSupplyIDs(supIDs)
        //setWeekJSON(weekJSON)
        //productTable()
    }

    function updateMoney(value, key){
        var newJS = Object.create(weekJSON)
        newJS.week_stat[key] = value
        setWeekJSON(newJS)
    }

    function saveWeek(){
        let saveJS = weekJSON
        saveJS.week_stat.id = 0
        saveJS.week_stat.author = localStorage.getItem("username")
        console.log("WeekJSON: " + JSON.stringify(saveJS.week_stat))
        console.log("Products: " + JSON.stringify(weekJSON.products))
        console.log("Wareneingänge: " + JSON.stringify(supplyIDs))
        const dataJSON = {
            "jwt":jwt,
            "week_stat":weekJSON.week_stat,
            "products":weekJSON.products,
            "supply":supplyIDs
        }
        pushNewWeekToServer(dataJSON)
    }

    function returnColor(value){
        if (value < 0) {
            return "red"
        }else {
            return "green"
        }
    }

    function returnSalesProfit(){
        var sales_ges = 0
        var prof_ges = 0
        try{
        weekJSON.products.map(product =>{
            var supplyCount = 0
            unassignedSupply.supplies.map(s => {
                if (s.product_id === product.product_id){
                    const date = Date.parse(s.supplyDate)
                    if(weekJSON.week_stat.date_start < date && weekJSON.week_stat.date_end >= date){
                        supplyCount += s.amount
                    }
                }
            })

            const pcs_sold = product["stock_before"] + supplyCount - product["stock_after"] - product["loss"]
            const sales = pcs_sold * product["sp"]
            sales_ges += sales
            const profit = sales - (pcs_sold * product["pp"]) - (product["loss"] * product["pp"])
            prof_ges+= profit
        })}catch{
            
        }

        return(
            <div>
                <Row tag="h3">
                    <Col>Gesamter erwarteter Umsatz:</Col>
                    <Col style={{textAlign:"right"}}>{parseFloat(sales_ges || 0).toFixed(2)}€</Col>
                </Row>
                <Row tag="h4">
                    <Col>Gesamter erwarteter Profit:</Col>
                    <Col style={{textAlign:"right"}}>{parseFloat(prof_ges|| 0).toFixed(2)}€</Col>
                </Row>
            </div>
        )


    }


    function productTable(){
        console.log("Supply to add: " + JSON.stringify(supplyToAdd))
        const products = allProducts || []
        const weekProds = weekJSON["products"]|| []
        const supplies = unassignedSupply.supplies || []
        const st = stock || []
        return products.map(product => {

            var supplyCount = 0
            supplies.map(s => {
                if (s.product_id === product.id){
                    const date = Date.parse(s.supplyDate)
                    if(weekJSON.week_stat.date_start < date && weekJSON.week_stat.date_end >= date){
                        supplyCount += s.amount
                    }
                }
            })
            var s_before = 0
            var s_after = 0
            var loss = 0
            weekProds.map(weekProd => {
                if(weekProd.product_id === product.id){
                    s_before = weekProd["stock_before"]
                    s_after = weekProd["stock_after"]
                    loss = weekProd["loss"]
                }
            })

            const pcs_sold = s_before + supplyCount - s_after - loss
            const sales = pcs_sold * product["sp"]
            const profit = sales - (pcs_sold * product["pp"]) - (loss * product["pp"])


            return(
                <tr key={product["id"]}>
                    <td>{product["name"]}</td>
                    <td>{s_before || 0}</td>
                    <td>{supplyCount}</td>
                    <td>{s_after}</td>
                    <td><input  class="form-control" type="number" defaultValue={0} style={{width: "80px"}} onChange={e => updateValue(product.id, "loss", e.target.value)}/></td>
                    <td>{pcs_sold}</td>
                    <td><input  class="form-control" type="number" defaultValue={parseFloat(product["pp"]).toFixed(3)} style={{width: "80px"}} onChange={e => updateValue(product.id, "pp", e.target.value)}/></td>
                    <td><input  class="form-control" type="number" defaultValue={parseFloat(product["sp"]).toFixed(3)} style={{width: "80px"}} onChange={e => updateValue(product.id, "sp", e.target.value)}/></td>
                    <td>{parseFloat(sales).toFixed(2)}€</td>
                    <td><div style={{color: returnColor(profit)}}>{parseFloat(profit).toFixed(2)}€</div></td>
                </tr>
        );
    })
    }

    function returnMoneyTable(){

        
        try{
            const coins_before =  parseFloat(lastWeek.week_stat.coins_register - lastWeek.week_stat.coins_transfer).toFixed(2)
            const bills_before = parseFloat(lastWeek.week_stat.bills_register - lastWeek.week_stat.bills_transfer).toFixed(2)


            var register_count = parseFloat(weekJSON.week_stat.bills_register)
            register_count += parseFloat(weekJSON.week_stat.coins_register)
            const reg_coins = weekJSON.week_stat.coins_register
            const reg_bills = weekJSON.week_stat.bills_register


            const reg_est = parseFloat(parseFloat(sales_act) + parseFloat(coins_before) + parseFloat(bills_before)).toFixed(2)
            const reg_missing = parseFloat(reg_est - register_count).toFixed(2)
            const prof_act = parseFloat(profHyp - reg_missing).toFixed(2)

        return(
            <div>
                <Row>
                    <Col></Col>
                    <Col>Vorher in €</Col>
                    <Col>Nachher in €</Col>
                    <Col>Transfer in €</Col>
                </Row>
                <Row>
                    <Col>Münzen</Col>
                    <Col>{parseFloat(coins_before).toFixed(2) || 0}€</Col>
                    <Col><input class="form-control" type="number" defaultValue={parseFloat(reg_coins).toFixed(2)} onChange={e => updateMoney(e.target.value, "coins_register")}/></Col>
                    <Col><input  class="form-control" type="number" defaultValue={0} onChange={e => updateMoney(e.target.value, "coins_transfer")}/></Col>
                </Row>
                <Row>
                    <Col>Scheine</Col>
                    <Col>{parseFloat(bills_before).toFixed(2) || 0}€</Col>
                    <Col><input  class="form-control" type="number" defaultValue={parseFloat(reg_bills).toFixed(2)} onChange={e => updateMoney(e.target.value, "bills_register")}/></Col>
                    <Col><input  class="form-control"type="number" defaultValue={0} onChange={e => updateMoney(e.target.value, "bills_transfer")}/></Col>
                </Row>
                <Row></Row>
                <Row tag="h4">
                    <Col>Kassenstand real:</Col>
                    <Col style={{textAlign:"right"}}>{parseFloat(register_count).toFixed(2)}€</Col>
                </Row>
                <Row tag="h4">
                    <Col>Kassenstand soll:</Col>
                    <Col style={{textAlign:"right"}}>{reg_est}€</Col>
                    
                </Row>
                <Row tag="h4">
                    <Col>Kassenfehlbetrag:</Col>
                    <Col style={{color: returnColor(reg_missing * -1), textAlign:"right"}}>{reg_missing}€</Col>
                </Row>
                <Row tag="h4">
                    <Col>Realer Profit:</Col>
                    <Col style={{color: returnColor(reg_missing * -1), textAlign:"right"}}>{prof_act}</Col>
                </Row>
            </div>
        );}catch{
            return(
                <div></div>
            )
        }
    }

   function returnSupplyTable(){
    const supplies = unassignedSupply.supplies || []
    
    return supplies.map(supply => {
        const date = Date.parse(supply.supplyDate)
        if(weekJSON.week_stat.date_start < date && weekJSON.week_stat.date_end >= date){
        
        return(
            <tr>
                <th>{supply.product_name}</th>
                <th>{supply.amount}</th>
                <th><Moment format="dd DD.MM.YYYY">{supply.supplyDate}</Moment></th>
                <th>{supply.author}</th>
            </tr>
        )
    }
    })
   }



    return(
        <div className="content">
            <Button color="link" onClick={goBack}>                
                <i className="tim-icons icon-double-left" />
                Zurück
            </Button>
            <Card className="newWeekCard">
                <CardHeader tag="h1">Neue Wochenstatistik</CardHeader>
                <CardBody>
                <Row>
                        <Col>Beginn</Col>
                        <Col>Ende</Col>
                        <Col>Normale Woche</Col>
                    </Row>
                {returnDateRow()}
                </CardBody>
                </Card>
                <Card>
                    <CardHeader tag="h1">Wareneingänge</CardHeader>
                    <CardBody>
                        <Table>
                            <thead>
                                <tr>
                                <th>Artikel</th>
                                <th>Anzahl</th>
                                <th>Eingangsdatum</th>
                                <th>geprüft durch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returnSupplyTable()}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle tag="h2">Warenbestand</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Table className="inputTable">
                            <thead>
                                <tr>
                                    <th>Artikel</th>
                                    <th>Bestand vorher</th>
                                    <th>Wareneingang</th>
                                    <th>Bestand nachher</th>
                                    <th>Verlust</th>
                                    <th>Verkauft</th>
                                    <th>EKP in €</th>
                                    <th>VKP in €</th>
                                    <th>Umsatz</th>
                                    <th>Gewinn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productTable()}
                            </tbody>
                        </Table>
                        {returnSalesProfit()}
                    </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle tag="h2">Bar-Kassenzählung</CardTitle>
                </CardHeader>
                <CardBody>
                    {returnMoneyTable()}
                </CardBody>
            </Card>
            <Button onClick={() => saveWeek()}>Wochenstatistik speichern</Button>
            
        </div>
    );
}