import React from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap"
import newWeek from "./newWeek.js"
import { useHistory } from "react-router-dom"
import { Redirect } from "react-router-dom"

import weekStatsTest from "../testData/weekStatsTestData.json"



export default function Weeks(){

    const history = useHistory();

    function pushToNewWeek(){
        console.log("Try to push");
        history.push("/admin/newWeek")
    }

    function rejetcCheckboxChange(e){
        e.preventDefault();
        return false;
    }

    return (
        <div className="content">
            <Card className="headerCart">
                <CardHeader>
                    <Row>
                        <Col>
                            <CardTitle tag="h1">Wochenstatistiken</CardTitle>
                        </Col>
                        <Col>letzte vor X Tagen</Col>
                    </Row>
                </CardHeader>
            </Card>
            <Card className="weeksTableCard">
                <CardHeader>
                    <Row>
                    <Col md="auto">
                    <CardTitle tag="h3">Historie</CardTitle>
                    </Col>
                    <Col md="auto">
                    <Button onClick={pushToNewWeek}>Neue Wochenstatistik</Button>
                    </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Table className="weeksTable">
                        <thead>
                            <tr>
                                <th>Beginn</th>
                                <th>Ende</th>
                                <th>Umsatz</th>
                                <th>Verlust</th>
                                <th>Gewinn soll</th>
                                <th>Differenz zu Kasse</th>
                                <th>Gewinn ist</th>
                                <th>Normal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weekStatsTest.map((week, index) =>{
                                return <tr key={index}>
                                    <td>{(week["datestart"])}</td>
                                    <td>{(week["dateend"])}</td>
                                    <td>{parseFloat(week["sales"]).toFixed(2)}</td>
                                    <td>{parseFloat(week["losses"]).toFixed(2)}</td>
                                    <td>{parseFloat(week["profit_hyp"]).toFixed(2)}</td>
                                    <td>{parseFloat(week["difference"]).toFixed(2)}</td>
                                    <td>{parseFloat(week["profit_act"]).toFixed(2)}</td>
                                    <td><input type="checkbox" defaultChecked={week["was_regular"]} onClick={rejetcCheckboxChange}/></td>
                                    <td><Button>
                                    <i className="tim-icons icon-pencil" />
                                        </Button></td>
                                </tr>
                            })}
                        </tbody>
                    </Table>    
                </CardBody>
            </Card>
        </div>
    )
}