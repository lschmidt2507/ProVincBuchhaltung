import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap";
import axios from "axios";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";

export default function Deliveries() {

const [deliveries, setDeliveries] = useState([]);
const jwt = localStorage.getItem("jwt")
const history = useHistory()

const getDeliveryData = async () => {
    const response = await axios.post("http://178.254.2.54:5000/api/supply/all", {jwt})
    const js = await response.data;
    const js_parsed = js["supplies"].reverse()          
    return js_parsed
}

useEffect(()=> {
    async function initData(){
        const data = await getDeliveryData();
        setDeliveries(data)
    }
    initData();

}, [])

function pushToNewSup(){
    history.push("/admin/newSupply")
}

function deleteSupply(id){
    async function pushToServer(){
        const response = await axios.post("http://178.254.2.54:5000/api/supply/delete", {jwt, id})
        history.push("/admin/deliveries")
    }
    pushToServer()
}

function returnSupplyTable(){
    const sup = deliveries || []
    return sup.map( supply => {
        return(
            <tr key={supply.id}>
                <th><Moment format="dd DD.MM.YYYY">{supply.supplyDate}</Moment></th>
                <th>{supply.product_name}</th>
                <th>{supply.amount}</th>
                <th><Moment format="dd DD.MM.YYYY">{supply.mhd}</Moment></th>
                <th>{supply.author}</th>
                <th><Button onClick={() => deleteSupply(supply.id)} style={{color:"red"}}><i className="tim-icons icon-simple-delete" /></Button></th>
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
                    <Col>
                    <Button onClick={() => pushToNewSup()}>Neuer Wareneingang</Button>
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
                                <th></th>
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