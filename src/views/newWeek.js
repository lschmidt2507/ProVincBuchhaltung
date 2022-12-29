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
    const [weekJSON, setWeekJSON] = useState([])
    const [unassignedSupply, setUnassignedSupply] = useState([])
    const [supplyToAdd, setSupplyToAdd] = useState([])
    var [profHyp, setProfHyp] = useState()
    var [sales_act, setSalesAct] = useState()
    const jwt = localStorage.getItem("jwt")




    function goBack(){
        history.push("/admin/weeks");
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

    useEffect(() => {
        console.log("IN USE EFFECT")
        async function initData(){
            const res = await getLastWeekStatData()
            setLastWeek(res)

            const js_clone = Object.create(res)

            const today = new Date
            const date_old = js_clone.week_stat.date_end
            const nextDate = addDays(parseISO(date_old), 1)
            js_clone.week_stat.date_start = nextDate
            js_clone.week_stat.date_end = today

            js_clone.products.map(product =>{
                product.stock_before = product.stock_after
                //product.stock_after = 0
                product.loss = 0
            })

            setWeekJSON(js_clone)

            const supRes = await getSupplyData()
            setUnassignedSupply(supRes)
            updateValue(0,0,0,)

            console.log("week after set:" + JSON.stringify(weekJSON))

        }
        initData();
    }, [])


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
                </Row>
            )

        } catch (error){

        }
   
    }

    function updateRegister(type, value){
        let newJS = Object.create(weekJSON)
        try{
            newJS.week_stat[type] = value
        }catch{

        }

        setWeekJSON(newJS)
        
    }

    function updateDate(type, date){
        let newJS = Object.create(weekJSON)
        var updatedSupplyToAdd = new Object();
        updatedSupplyToAdd = []
        try{
            newJS.week_stat[type] = date

            
            const supplies = unassignedSupply
            supplies.map(supply => {
                const date = Date.parse(supply.supplyDate)
                if(weekJSON.week_stat.date_start < date && weekJSON.week_stat.date_end >= date){
                    var toAddBefore = supplyToAdd[supply.product_id] || 0
                    updatedSupplyToAdd[supply.product_id] = toAddBefore + supply.amount
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
    }


    function updateValue(id, name, value){
        console.log(id, name, value)
        var supplies = unassignedSupply.supplies
        let newJS = Object.create(weekJSON)
        var profges = 0
        var salesges = 0
        newJS.products.map(product =>{
            console.log(parseInt(product.product_id), parseInt(id))

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
                    }
                }
            })

            const pcs_sold = product["stock_before"] + supplyCount - product["stock_after"] - product["loss"]
            const sales = pcs_sold * product["sp"]
            salesges += sales
            const profit = sales - (pcs_sold * product["pp"]) - (product["loss"] * product["pp"])
            profges+= profit
            

        })
        setWeekJSON(newJS)
        setProfHyp(profges)
        setSalesAct(salesges)
        console.log("new JS: " + JSON.stringify(weekJSON))
        //setWeekJSON(weekJSON)
        //productTable()
    }

    function returnColor(value){
        if (value < 0) {
            return "red"
        }else {
            return "green"
        }
    }


    function productTable(){
        console.log("Supply to add: " + JSON.stringify(supplyToAdd))
        const products = weekJSON["products"]|| []
        const supplies = unassignedSupply.supplies || []
        return products.map(product => {

            var supplyCount = 0
            supplies.map(s => {
                if (s.product_id === product.product_id){
                    const date = Date.parse(s.supplyDate)
                    if(weekJSON.week_stat.date_start < date && weekJSON.week_stat.date_end >= date){
                        supplyCount += s.amount
                    }
                }
            })
            const pcs_sold = product["stock_before"] + supplyCount - product["stock_after"] - product["loss"]
            const sales = pcs_sold * product["sp"]
            const profit = sales - (pcs_sold * product["pp"]) - (product["loss"] * product["pp"])
            console.log("Profit: " + profit + product.name)   

            return(
                <tr key={product["id"]}>
                    <td>{product["name"]}</td>
                    <td>{product["stock_before"] || 0}</td>
                    <td>{supplyCount}</td>
                    <td><input type="number" defaultValue={product["stock_before"]} style={{width: "60px"}} onChange={e => updateValue(product.product_id, "stock_after", e.target.value)}/></td>
                    <td><input type="number" defaultValue={0} style={{width: "60px"}} onChange={e => updateValue(product.product_id, "loss", e.target.value)}/></td>
                    <td>{pcs_sold}</td>
                    <td><input type="number" defaultValue={parseFloat(product["pp"].toFixed(3))} style={{width: "60px"}} onChange={e => updateValue(product.product_id, "pp", e.target.value)}/></td>
                    <td><input type="number" defaultValue={parseFloat(product["sp"].toFixed(3))} style={{width: "60px"}} onChange={e => updateValue(product.product_id, "sp", e.target.value)}/></td>
                    <td>{parseFloat(sales).toFixed(2)}€</td>
                    <td><div style={{color: returnColor(profit)}}>{parseFloat(profit).toFixed(2)}€</div></td>
                </tr>
        );
    })
    }

    function returnMoneyTable(){

        
        try{
            const register_count = weekJSON.week_stat.bills_register + weekJSON.week_stat.coins_register
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
                    <Col>{(parseFloat(parseFloat(lastWeek.week_stat.coins_register) - parseFloat(lastWeek.week_stat.coins_transfer)).toFixed(2)) || 0}€</Col>
                    <Col><input type="number" defaultValue={0}/></Col>
                    <Col><input type="number" defaultValue={0}/></Col>
                </Row>
                <Row>
                    <Col>Scheine</Col>
                    <Col>{(parseFloat(parseFloat(lastWeek.week_stat.bills_register) - parseFloat(lastWeek.week_stat.bills_transfer)).toFixed(2)) || 0}€</Col>
                    <Col><input type="number" defaultValue={0}/></Col>
                    <Col><input type="number" defaultValue={0}/></Col>
                </Row>
                <Row></Row>
                <Row tag="h4">
                    <Col>Kassenstand real:</Col>
                    <Col style={{textAlign:"right"}}>{register_count}</Col>
                </Row>
                <Row tag="h4">
                    <Col>Kassenstand soll:</Col>
                    <Col style={{textAlign:"right"}}>{sales_act || 0}</Col>
                    
                </Row>
                <Row tag="h4">
                    <Col>Kassenfehlbetrag:</Col>
                    <Col style={{color: returnColor(register_count - sales_act), textAlign:"right"}}>{sales_act - register_count}</Col>
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
                <th>{supply.product_id}</th>
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
                        <Row tag="h3">
                            <Col>Gesamter erwarteter Kassenstand:</Col>
                            <Col style={{textAlign:"right"}}>{parseFloat(sales_act || 0).toFixed(2)}</Col>
                        </Row>
                        <Row tag="h4">
                            <Col>Gesamter erwarteter Profit:</Col>
                            <Col style={{textAlign:"right"}}>{parseFloat(profHyp || 0).toFixed(2)}</Col>
                        </Row>
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
            
        </div>
    );
}