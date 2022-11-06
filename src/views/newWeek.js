import React, { useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table } from "reactstrap";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";

export default function NewWeek(){

    const history = useHistory();
    const [startDate, setStartDate] = useState(new Date());
    
    function goBack(){
        history.push("/admin/weeks");
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
                <Row>
                        <Col>
                            <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
                        </Col>
                        <Col>
                            <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
                        </Col>
                    </Row>
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
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Spacekekse</th>
                                    <th>
                                        <Input type="number"/>
                                    </th>
                                    <th>
                                        <Input type="number"/>
                                    </th>
                                </tr>
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