import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap";
import axios from "axios";
import Moment from "react-moment";

export default function () {

const [deliveries, setDeliveries] = useState([]);
const jwt = localStorage.getItem("jwt")

const getDeliveryData = async () => {
    const response = await axios.post("http://178.254.2.54:5000/api/supply/all", {jwt})
    const js = await response.data;
    const js_parsed = js["supplies"].reverse()          
    return js_parsed
}

useEffect( ()=> {
    async function initData(){
        const data = await getDeliveryData();
        setDeliveries(data)
    }
    initData();

})

function returnSupplyTable(){
    return deliveries.map( supply => {
        return(
            <tr>
                <th><Moment format="dd DD.MM.YYYY">{supply.supplyDate}</Moment></th>
                <th>{supply.product_id}</th>
                <th>{supply.amount}</th>
                <th>{supply.mhd}</th>
                <th>{supply.author}</th>
            </tr>
        )
    })
}


return(
    <div className="content">
            <Card className="headerCart">
                <CardHeader>
                    <Row>
                        <Col>
                            <CardTitle tag="h1">Wareneingänge</CardTitle>
                        </Col>
                    </Row>
                </CardHeader>
            </Card>
            <Card className="weeksTableCard">
                <CardHeader>
                    <Row>
                    <Col md="auto">
                    <CardTitle tag="h3">Historie</CardTitle>
                    </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Table className="weeksTable">
                        <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Artikel</th>
                                <th>Anzahl</th>
                                <th>MHD</th>
                                <th>Geprüft durch</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnSupplyTable()}
                        </tbody>
                    </Table>    
                </CardBody>
            </Card>
        </div>
)

}