import React, { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap";
import axios from "axios";

export default function () {

const [deliveries, setDeliveries] = useState([]);
const jwt = localStorage.getItem("jwt")

const getDeliveryData = async () => {
    const response = await axios.post("http://178.254.2.54:5000/api/weekstats/all", {jwt})
    const js = await response.data;
    const js_parsed = js["week_stats"].reverse()          
    return js_parsed
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
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>    
                </CardBody>
            </Card>
        </div>
)

}