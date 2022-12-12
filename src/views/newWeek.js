import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table } from "reactstrap";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import {addDays, parseISO} from "date-fns";
import axios from "axios";
import Moment from "react-moment";
//import differenceInCalendarISOYears from 'date-fns/differenceInCalendarISOYears'

export default function NewWeek(){

    const history = useHistory();
    const [lastWeek, setLastWeek] = useState([])
    const [weekJSON, setWeekJSON] = useState([])
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

    useEffect(() => {
        console.log("IN USE EFFECT")
        async function initData(){
            const res = await getLastWeekStatData()
            setLastWeek(res)

            const js_clone = JSON.parse(JSON.stringify(res))

            const today = new Date
            const date_old = js_clone.week_stat.date_end
            const nextDate = addDays(parseISO(date_old), 1)
            js_clone.week_stat.date_start = nextDate
            js_clone.week_stat.date_end = today

            js_clone.products.map(product =>{
                product.stock_before = product.stock_after
                product.stock_after = 0
                product.loss = 0
            })

            setWeekJSON(js_clone)

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
                        <Moment format="dd DD.MM.YYYY">{start_date}</Moment>
                    </Col>
                    <Col>
                        <DatePicker selected={end_date} dateFormat="dd.MM.yyyy"></DatePicker>
                    </Col>
                </Row>
            )

        } catch (error){

        }
   
    }

    function updateValue(id, name, value){
        console.log(id, name, value)
        weekJSON.products.map(product =>{
            console.log(parseInt(product.product_id), parseInt(id))
            if(parseInt(product.product_id) === parseInt(id)){
                console.log("FOUND")
                product[name] = value
                

                console.log("new JS: " + JSON.stringify(weekJSON))

            }
        })
        setWeekJSON(weekJSON)
    }


    function productTable(){
        const products = weekJSON["products"]|| []
        return products.map(product => {

            const pcs_sold = product["stock_before"] - product["stock_after"] - product["loss"]
            const sales = pcs_sold * product["sp"]
            const profit = sales - (pcs_sold * product["pp"])

            return(
                <tr key={product["id"]}>
                    <td>{product["name"]}</td>
                    <td>{product["stock_before"] || 0}</td>
                    <td><input type="number" defaultValue={0} style={{width: "60px"}} onChange={e => updateValue(product.product_id, "stock_after", e.target.value)}/></td>
                    <td><input type="number" defaultValue={0} style={{width: "60px"}} onChange={e => updateValue(product.product_id, "loss", e.target.value)}/></td>
                    <td>{pcs_sold}</td>
                    <td><input type="number" defaultValue={parseFloat(product["pp"].toFixed(3))} style={{width: "60px"}} onChange={e => updateValue(product.product_id, "pp", e.target.value)}/></td>
                    <td><input type="number" defaultValue={parseFloat(product["sp"].toFixed(3))} style={{width: "60px"}} onChange={e => updateValue(product.product_id, "sp", e.target.value)}/></td>
                    <td>{parseFloat(sales).toFixed(2)}</td>
                    <td>{parseFloat(profit).toFixed(2)}</td>
                </tr>
        );
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
                    <CardHeader>
                        <CardTitle tag="h2">Warenbestand</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Table className="inputTable">
                            <thead>
                                <tr>
                                    <th>Artikel</th>
                                    <th>Bestand vorher</th>
                                    <th>Bestand nachher</th>
                                    <th>Verlust</th>
                                    <th>Verkauft</th>
                                    <th>EKP</th>
                                    <th>VKP</th>
                                    <th>Umsatz</th>
                                    <th>Gewinn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productTable()}
                            </tbody>
                        </Table>
                    </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle tag="h2">Kassenzählung</CardTitle>
                </CardHeader>
                <CardBody>

                </CardBody>
            </Card>
            
        </div>
    );
}