import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Row, Table } from "reactstrap";
import axios from "axios";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";

export default function Deliveries() {

const [deliveries, setDeliveries] = useState([]);
var [currentFilter, setCurrentFilter] = useState();
const [currentPage, setCurrentPage] = useState([]);
const [products, setProducts] = useState([]);
const jwt = localStorage.getItem("jwt")
const history = useHistory()

const getDeliveryData = async () => {
    const response = await axios.post("https://b.vlg-std.de:5000/api/supply/all", {jwt})
    const js = await response.data;
    const js_parsed = js["supplies"].reverse()
    /*for(var i = 0; i < js_parsed.length; i+= 25){
        return js_parsed.slice(i, i + 25)
    }*/

    //console.log(JSON.stringify(js_chunked))

    return js_parsed
}

const getProductData = async () => {
    const response = await axios.post("https://b.vlg-std.de:5000/api/weekstats/products", {jwt})
    const js = await response.data;

    return js
}

useEffect(()=> {
    async function initData(){
        const products =  await getProductData();
        setProducts(products)
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
        const response = await axios.post("https://b.vlg-std.de:5000/api/supply/delete", {jwt, id})
        history.push("/admin/deliveries")
        window.location.reload();
    }
    pushToServer()
}

const formateData = (supplyArray) => {
    var dates = []
    supplyArray.map( supply => {
        if (dates.indexOf(supply.supplyDate) < 0){
            dates.push(supply.supplyDate)
        }
    })
    console.log("DATES: " + dates)
    return dates;
}

function options(){
    const prods = products || []
    var options = []
    options.push(<option value={0}>kein Filter</option>)
    options.push(prods.map(p =>{
        return(
            <option value={p.id}>{p.name}</option>
        )
    }))
    return options
}

function returnSupplyTable(){
    const sup = deliveries || []
    const filterID = currentFilter || 0
    const page = currentPage || 1

    var relevantSup = []

    if(filterID != 0){
        console.log("Filter ID: " + filterID)
        sup.map(s => {
            if((s.product_id) == filterID){
                relevantSup.push(s)
            }
        })
    }else {
        relevantSup = sup
    }


    var dates = []

    relevantSup.map(s => {
        if(dates.indexOf(s.supplyDate) < 0){
            dates.push(s.supplyDate);
        }
    })
    

     /*for(var i = 0; i < js_parsed.length; i+= 25){
        return js_parsed.slice(i, i + 25)
    }*/
    
    return dates.map(d => {
        const tableContent = relevantSup.map(s => {
            if(s.supplyDate === d){
                return(
                    <tr key={s.id}>
                        <th>{s.product_name}</th>
                        <th>{s.amount}</th>
                        <th><Moment format="dd DD.MM.YYYY">{s.mhd}</Moment></th>
                        <th>{s.author}</th>
                        <th>{s.id}</th>
                        <th><Button onClick={() => deleteSupply(s.id)} style={{color:"red"}}><i className="tim-icons icon-simple-delete" /></Button></th>
                    </tr>
        )}
        })
        return(
            <div>
            <h2><Moment format="dd DD.MM.YYYY">{d}</Moment></h2>
            <Table className="weeksTable">
                    <thead>
                        <tr>
                            <th>Artikel</th>
                            <th>Anzahl</th>
                            <th>MHD</th>
                            <th>Geprüft durch</th>
                            <th>ID</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                    </Table></div>)
        
    })


    /*
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
    })*/
}

function returnPagnationControl(){

    return(
        <Row>
            <Col><Button>Zurück</Button></Col>
            <Col><Button>Vor</Button></Col>
        </Row>
    )
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
                    <Col md="3">
                    <Button onClick={() => pushToNewSup()}>Neuer Wareneingang</Button>
                    </Col>
                    <Col md="2">
                    <FormGroup >
                    <label tag="h4">Produktfilter:</label>
                    <select className="form-control" onChange={e =>  setCurrentFilter(e.target.value)}>
                        {options()}
                    </select>
                    </FormGroup>
                    </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    {returnSupplyTable()}
                    {returnPagnationControl()}
                </CardBody>
            </Card>
        </div>
)

}