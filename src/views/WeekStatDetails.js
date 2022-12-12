import axios from "axios";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";

export default function(props) {
    const location = useLocation();
    const id = localStorage.getItem("week_id")
    const jwt = localStorage.getItem("jwt")

    const[weekData, setWeekData] = useState([]);

    console.log("iD: " +  id)
    localStorage.setItem("week_id", null)
    

    const getWeekData = async () => {
        const response = await axios.post("http://178.254.2.54:5000/api/weekstats/single", {jwt, id})
        const js = await response.data;
        const js_parsed = js["week_stat"]       
        return js_parsed
    }

    useEffect(() => {
        async function initData(){
            const res = await getWeekData()
            setWeekData(res)
        }
        initData();
    }, [])

    function returnDateHeader(){
        const week = weekData
        return(
            <Row>
                <Col>
                    <Moment format="dd DD.MM.YYYY">{week["date_start"]}</Moment>
                </Col>
                <Col>
                    <Moment format="dd DD.MM.YYYY">{week["date_end"]}</Moment>
                </Col>
            </Row>
        );
    }

    return (
        <div className="content">
            <Card className="headerCart">
                <CardHeader>
                            <CardTitle tag="h1">Wochenstatistik</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col>Beginn</Col>
                        <Col>Ende</Col>                    
                    </Row>
                    {returnDateHeader()}
                </CardBody>
            </Card>
        </div>
    )


}