import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap"
import newWeek from "./newWeek.js"
import { useHistory } from "react-router-dom"
import { Redirect } from "react-router-dom"
import axios from "axios"
import weekStatsTest from "../testData/weekStatsTestData.json"
import Moment from "react-moment"
import "moment/locale/de"



export default function Weeks(){
    Moment.Local = "de"
    const history = useHistory();
    const [weekStats, setWeekStats] = useState([]);
    const jwt = localStorage.getItem("jwt")

    const pushToDetail = async (id) => {
        console.log("ID: " + id)
        localStorage.setItem("week_id", id)
        history.push('/admin/week');
    }

    const getLastWeeks = async () => {
        const response = await axios.post("https://b.vlg-std.de:5000/api/weekstats/all", {jwt})
        const js = await response.data;
        const js_parsed = js["week_stats"].reverse()          
        return js_parsed
    }

    useEffect(() => {
        async function setWeeks(){
            const res = await getLastWeeks()
            setWeekStats(res)
        }
        setWeeks();
    }, [])

    function pushToNewWeek(){
        console.log("Try to push");
        history.push("/admin/newWeek")
    }



    function rejetcCheckboxChange(e){
        e.preventDefault();
        return false;
    }
    function returnLastDate(){
        var diffDays = 999
        if(typeof weekStats[0] !== "undefined"){
            const end_date = weekStats[0].date_end
            const lastDate = new Date(end_date)
            const diffTime = Math.abs(lastDate - Date.now())
            const diffDays= Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return( 
                <Col>letzte vor {diffDays} Tagen</Col>
            )
        }
    }

    function returnColor(value){
        if (value < 0) {
            return "red"
        }else {
            return "green"
        }
    }

    function returnWeeksTable(){
        const weeks = weekStats || [];
        return weeks.map(week =>{
            return(
                <tr key={week["id"]}>
                    <td><Moment format="dd DD.MM.YYYY">{week["date_start"]}</Moment></td>
                    <td><Moment format="dd DD.MM.YYYY">{week["date_end"]}</Moment></td>
                    <td>{parseFloat(week["sales_act"]).toFixed(2)} €</td>
                    <td>{parseFloat(week["losses"]).toFixed(2)} €</td>
                    <td>{parseFloat(week["profit_hyp"]).toFixed(2)} €</td>
                    <td><div style={{color: returnColor(parseFloat(week["difference"]))}}>
                        {parseFloat(week["difference"]).toFixed(2)} €
                        </div>
                        </td>
                    <td><div style={{color: returnColor(parseFloat(week["profit_act"]))}}>
                        {parseFloat(week["profit_act"]).toFixed(2)} €
                        </div>
                        </td>
                    <td><input type="checkbox" defaultChecked={week["was_regular"]} onClick={rejetcCheckboxChange}/></td>
                    <td>
                        <Button onClick={() => pushToDetail(week["id"])}>
                            <i className="tim-icons icon-notes" />
                        </Button>
                    </td>
                </tr>
            );
        });
    }

    return (
        <div className="content">
            <Card className="headerCart">
                <CardHeader>
                    <Row>
                        <Col>
                            <CardTitle tag="h1">Wochenstatistiken</CardTitle>
                        </Col>
                        {returnLastDate()}
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
                            {returnWeeksTable()}
                        </tbody>
                    </Table>    
                </CardBody>
            </Card>
        </div>
    )
}