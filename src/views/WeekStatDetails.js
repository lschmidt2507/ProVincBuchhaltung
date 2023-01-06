import axios from "axios";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table } from "reactstrap";

export default function(props) {
    const location = useLocation();
    const id = localStorage.getItem("week_id")
    const jwt = localStorage.getItem("jwt")

    const[weekData, setWeekData] = useState([]);
    const[supplyData, setSupplyData] = useState([]);

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

    useEffect(() => {
        async function initData(){
            const week = await getWeekData()
            setWeekData(week)
            const supplies = await getSupplyData()
            setSupplyData(supplies)

        }
        initData();
    }, [])

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
                    <Input type="checkbox"  defaultChecked={week.was_regular}/>
                </Col>
            </Row>
        );}catch{

        }
    }

    function returnSupplyTable(){
        const sup = supplyData.supplies || []
        return sup.map(s => {
            return(
                <tr key={s.id}>
                    <th>{s.product_id}</th>
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
            var profit = sales - (pcs_sold * p.pp)
            return(
                <tr key={p.id}>
                    <th>{p.name}</th>
                    <th>{p.stock_before}</th>
                    <th>{supply_count}</th>
                    <th><input defaultValue={p.stock_after} class="form-control" type="number"/></th>
                    <th><input defaultValue={p.loss} class="form-control" type="number"/></th>
                    <th>{pcs_sold}</th>
                    <th><input defaultValue={p.pp} class="form-control" type="number"/></th>
                    <th><input defaultValue={p.sp} class="form-control" type="number"/></th>
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
                <Row>
                    <Col>Gesamter erwarteter Umsatz</Col>
                    <Col>{parseFloat(sales_ges).toFixed(2)}</Col>
                </Row>
                <Row>
                    <Col>Gesamter erwarteter Profit</Col>
                    <Col>{parseFloat(prof_ges).toFixed(2)}</Col>
                </Row>
            </div>
        )

    }

    function returnMoneyTable(){

        
    }

    return (
        <div className="content">
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
        </div>
    )


}