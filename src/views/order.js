import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap"
import { useHistory } from "react-router-dom"
import { Redirect } from "react-router-dom"
import axios from "axios"
import Moment from "react-moment"
import "moment/locale/de"



export default function Order(){
    Moment.Local = "de"
    const history = useHistory();
    const jwt = localStorage.getItem("jwt")
    const [orderRecommendations, setOrderRecommendations] = useState([])

    const getOrderData = async() =>{
        const response = await axios.post("https://b.vlg-std.de:5000/api/scale/orders", {jwt})
        const js = await response.data;
        return js
    }

    useEffect(() => {
        console.log("IN USE EFFECT")
        async function initData(){
            const orders = await getOrderData()
            setOrderRecommendations(orders)
            console.log(orders)
        }
        initData();
    }, [])

    function productTable(){
        return orderRecommendations.map(recommendation => {
            return(
                <tr>
                    <td><b>{recommendation["name"]}</b></td>
                    <td><b>{recommendation["order"]}</b></td>
                    <td>{recommendation["avg"]}</td>
                    <td>{recommendation["order_cycle"]}</td>
                </tr>
            );
        })
    }


    return (
        <div className="content">
            <Card className="headerCart">
                <CardHeader>
                    <Row>
                        <Col>
                            <CardTitle tag="h1">Bestellemgenempfehlungen</CardTitle>
                        </Col>
                    </Row>
                </CardHeader>
            </Card>
            <Card className="supplyTableCard">
                <CardHeader>
                    <Row>
                    <Col md="auto">
                    <CardTitle tag="h3">Folgende Bestellmengen werden empfohlen</CardTitle>
                    </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Table className="weeksTable">
                        <thead>
                            <tr>
                                <th>Produkt</th>
                                <th>Empfohlene Bestellmenge</th>
                                <th>Geschätzte Nachfrage</th>
                                <th>Lieferhäufigkeit(Tage)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productTable()}
                        </tbody>
                    </Table>    
                </CardBody>
            </Card>
        </div>
    )
}