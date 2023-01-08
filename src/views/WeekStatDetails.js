import axios from "axios";
import { func } from "prop-types";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table } from "reactstrap";

export default function(props) {
    const location = useLocation();
    const history = useHistory();
    const id = localStorage.getItem("week_id")
    const jwt = localStorage.getItem("jwt")
    const user = localStorage.getItem("username")

    const[weekData, setWeekData] = useState([]);
    const[supplyData, setSupplyData] = useState([]);
    const[lastWeek, setLastWeek] = useState([]);

    //localStorage.setItem("week_id", null)
    

    const getWeekData = async () => {
        const response = await axios.post("http://178.254.2.54:5000/api/weekstats/single", {jwt, id})
        const js = await response.data;
        return js   
    }

    const getSupplyData = async () => {
        const response = await axios.post("http://178.254.2.54:5000/api/supply/ws_id", {jwt, "ws_id":id})
        const js = await response.data;
        return js   
    }

    const getLastWeekData = async () => {
        const response = await axios.post("http://178.254.2.54:5000/api/weekstats/single", {jwt, "id":id -1})
        const js = await response.data;
        return js   
    }

    useEffect(() => {
        async function initData(){
            const week = await getWeekData()
            setWeekData(week)
            const supplies = await getSupplyData()
            setSupplyData(supplies)
            const lastWeek = await getLastWeekData()
            setLastWeek(lastWeek)

        }
        initData();
    }, [])

    function goBack(){
        history.push("/admin/weeks");
    }

    function updateWeekStat(value, key){
        var newJSON = JSON.parse(JSON.stringify(weekData))
        newJSON.week_stat[key] = value
        setWeekData(newJSON)
    }

    function updateProduct(id, key, value){
        var newJSON = JSON.parse(JSON.stringify(weekData))
        newJSON.products.map(p => {
            if(parseInt(p.product_id) === parseInt(id)){
                p[key] = value
            }
        })
        setWeekData(newJSON)
    }

    function saveWeek(){
        var saveJSON = weekData
        saveJSON.week_stat.author = user
        saveJSON["jwt"] = jwt

        async function pushWeekToServer(JS_Object){
            const response = await axios.post("http://178.254.2.54:5000/api/weekstats/update", JS_Object)
            const msg = await response.data
            console.log(JSON.stringify(msg))
            console.log(msg.error)
            if(msg["error"] === false){
                goBack();
            }
        }
        pushWeekToServer(saveJSON)
    }

    function returnColor(value){
        if (value < 0) {
            return "red"
        }else {
            return "green"
        }
    }


    function returnDateHeader(){
        try{
        const week = weekData.week_stat
        return(
            <Row>
                <Col>
                    <Moment format="dd DD.MM.YYYY">{week["date_start"]}</Moment>
                </Col>
                <Col>
                    <Moment format="dd DD.MM.YYYY">{week["date_end"]}</Moment>
                </Col>
                <Col>
                    <Input type="checkbox"  defaultChecked={week.was_regular} onChange={e => updateWeekStat(e.target.checked, "was_regular")}/>
                </Col>
            </Row>
        );}catch{

        }
    }

    function returnSupplyTable(){
        const sup = supplyData.supplies || []
        return sup.map(s => {
            return(
                <tr key={s.product_id}>
                    <th>{s.product_name}</th>
                    <th>{s.amount}</th>
                    <th><Moment format="dd DD.MM.YYYY">{s.supplyDate}</Moment></th>
                    <th>{s.author}</th>
                </tr>
            )
        })
    }

    function returnProductTable(){
        const products = weekData.products || []
        const sup = supplyData.supplies || []
        console.log("Sup: " + JSON.stringify(sup))
        return products.map(p => {
            var supply_count = 0
            sup.map(s => {
                if(s.product_id === p.product_id){
                    supply_count += s.amount
                    console.log("SUPPLY")
                }
            })

            var pcs_sold = p.stock_before + supply_count - p.stock_after - p.loss
            var sales = pcs_sold * p.sp
            var profit = sales - ((pcs_sold + p.loss) * p.pp) 
            return(
                <tr key={p.id}>
                    <th>{p.name}</th>
                    <th>{p.stock_before}</th>
                    <th>{supply_count}</th>
                    <th><input defaultValue={p.stock_after} class="form-control" type="number" onChange={e => updateProduct(p.product_id, "stock_after", parseInt(e.target.value))}/></th>
                    <th><input defaultValue={p.loss} class="form-control" type="number" onChange={e => updateProduct(p.product_id, "loss", parseInt(e.target.value))}/></th>
                    <th>{pcs_sold}</th>
                    <th><input defaultValue={p.pp} class="form-control" type="number" onChange={e => updateProduct(p.product_id, "pp", parseFloat(e.target.value))}/></th>
                    <th><input defaultValue={p.sp} class="form-control" type="number" onChange={e => updateProduct(p.product_id, "sp", parseFloat(e.target.value))}/></th>
                    <th>{parseFloat(sales).toFixed(2)}</th>
                    <th>{parseFloat(profit).toFixed(2)}</th>
                </tr>
            )
        })
    }

    function returnSalesProfit(){
        const week = weekData.products || []
        const sup = supplyData.supplies || []

        var sales_ges = 0
        var prof_ges = 0

        week.map(p =>{
            var supply_count = 0
            sup.map(s => {
                if(s.product_id === p.product_id){
                    supply_count += s.amount
                }
            })

            var pcs_sold = p.stock_before + supply_count - p.stock_after - p.loss
            var sales = pcs_sold * p.sp
            sales_ges += sales
            var profit = sales - (pcs_sold * p.pp)
            prof_ges += profit

        })

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

    function returnMoneyTable(){

        try{
        const week = weekData.products || []
        const sup = supplyData.supplies || []

        var sales_ges = 0
        var prof_ges = 0

        week.map(p =>{
            var supply_count = 0
            sup.map(s => {
                if(s.product_id === p.product_id){
                    supply_count += s.amount
                }
            })

            var pcs_sold = p.stock_before + supply_count - p.stock_after - p.loss
            var sales = pcs_sold * p.sp
            sales_ges += sales
            var profit = sales - (pcs_sold * p.pp)
            prof_ges += profit

        })


            const coins_before =  parseFloat(lastWeek.week_stat.coins_register - lastWeek.week_stat.coins_transfer).toFixed(2)
            const bills_before = parseFloat(lastWeek.week_stat.bills_register - lastWeek.week_stat.bills_transfer).toFixed(2)


            var register_count = parseFloat(weekData.week_stat.bills_register)
            register_count += parseFloat(weekData.week_stat.coins_register)
            const reg_coins = weekData.week_stat.coins_register
            const reg_bills = weekData.week_stat.bills_register


            const reg_est = parseFloat(parseFloat(sales_ges) + parseFloat(coins_before) + parseFloat(bills_before)).toFixed(2)
            const reg_missing = parseFloat(reg_est - register_count).toFixed(2)

            const prof_act = parseFloat(prof_ges - reg_missing).toFixed(2)

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
                    <Col><input class="form-control" type="number" defaultValue={parseFloat(reg_coins).toFixed(2)} onChange={e => updateWeekStat(e.target.value, "coins_register")}/></Col>
                    <Col><input  class="form-control" type="number" defaultValue={parseFloat(weekData.week_stat.coins_transfer).toFixed(2)} onChange={e => updateWeekStat(e.target.value, "coins_transfer")}/></Col>
                </Row>
                <Row>
                    <Col>Scheine</Col>
                    <Col>{parseFloat(bills_before).toFixed(2) || 0}€</Col>
                    <Col><input  class="form-control" type="number" defaultValue={parseFloat(reg_bills).toFixed(2)} onChange={e => updateWeekStat(e.target.value, "bills_register")}/></Col>
                    <Col><input  class="form-control"type="number" defaultValue={parseFloat(weekData.week_stat.bills_transfer).toFixed(2)} onChange={e => updateWeekStat(e.target.value, "bills_transfer")}/></Col>
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
                    <Col style={{color: returnColor(prof_act), textAlign:"right"}}>{prof_act}</Col>
                </Row>
            </div>
        )}catch{

        }
        
    }

    return (
        <div className="content">
             <Button color="link" onClick={goBack}>                
                <i className="tim-icons icon-double-left" />
                Zurück
            </Button>
            <Card className="headerCart">
                <CardHeader>
                            <CardTitle tag="h1">Wochenstatistik #{id}</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col>Beginn</Col>
                        <Col>Ende</Col>
                        <Col>War normal</Col>                    
                    </Row>
                    {returnDateHeader()}
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
                            {returnProductTable()}
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
    )


}