import React from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap"
import newWeek from "./newWeek.js"

export default function weeks(){
    return (
        <div className="content">
            <Card className="headerCart">
                <CardHeader>
                        <CardTitle tag="h1">Wochenstatistiken</CardTitle>
                </CardHeader>
            </Card>
            <Card className="weeksTableCard">
                <CardHeader>
                    <Row>
                    <Col>
                    <CardTitle tag="h3">Historie</CardTitle>
                    </Col>
                    <Col>
                    <Button color="#6dcc4e">+</Button>
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
                                <th>Ausgaben</th>
                                <th>Verlust</th>
                                <th>Gewinn</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>DD.MM.YYYY</th>
                                <th>DD.MM.YYYY (x Tage)</th>
                                <th>500</th>
                                <th>400</th>
                                <th>20</th>
                                <th>80</th>
                            </tr>
                        </tbody>
                    </Table>    
                </CardBody>
            </Card>
        </div>
    )
}