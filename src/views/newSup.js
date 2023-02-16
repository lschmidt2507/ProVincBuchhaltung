import axios from "axios";
import { func } from "prop-types";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import Moment from "react-moment";
import { Card, CardBody, CardHeader, Row, Table, Col, Dropdown, Button } from "reactstrap";
import { useHistory } from "react-router-dom";

export default function NewSup(){

    const jwt = localStorage.getItem("jwt")
    const user = localStorage.getItem("username")
    const history = useHistory();

    const[products, setProducts] = useState([]);
    var[supply, setSupply] = useState([]);
    var[supplyDate, setSupplyDate] = useState();
    const today = new Date

    const getAllProducts = async () =>{
        const response = await axios.post("https://b.vlg-std.de:5000/api/weekstats/products", {jwt})
        const js = await response.data;
        const js_parsed = js         
        return js_parsed
    }

    useEffect(() =>{
        setSupplyDate(today)
        const data = [{
            "product_id":5,
            "name":"Space Keks",
            "amount":0,
            "mhd":today,
            "supply_date":today,
            "creation_date":today,
            "author":user
        }]
        setSupplyDate = today
        setSupply(data)
        async function initData(){
            const product_data = await getAllProducts()
            setProducts(product_data)
        }
        initData()
    }, [])


    function goBack(){
        history.push("/admin/deliveries");
    }

    function updateValue(index, key, value){
        let newJS = JSON.parse(JSON.stringify(supply))
        console.log("INDEX-OBJ:" + JSON.stringify(newJS[index]))
        newJS[index][key] = value
        console.log("TRY:" + newJS[index][key])
        console.log(newJS)
        setSupply(newJS)
    }

    function addSupply(){
        var newJS = JSON.parse(JSON.stringify(supply))
        newJS.push({
            "product_id":5,
            "name":"Space Keks",
            "amount":0,
            "mhd":today,
            "supply_date":today,
            "creation_date":today,
            "author":user
        })
        setSupply(newJS);
        console.log(supply)

    }

    function removeSupply(index){
        let newJS = Object.create(supply)
        newJS.splice(index, 1)
        setSupply(newJS)
    }

    function updateProduct(index, id){
        let newJS = JSON.parse(JSON.stringify(supply))
        var name = ""
        products.map(p => {
            if (p.id === id){
                name = p.name
            }
        }) 
        newJS[index]["product_id"] = id
        newJS[index]["name"] = name
        setSupply(newJS)
    }

    function saveSupply(){
        supply.map(s => {
            s["supply_date"] = supplyDate
        })
        console.log("Products: " + JSON.stringify(supply))
        var saveJSON = {
            "jwt":jwt,
            "file":{},
            "products":supply
        }
        async function pushDataToServer(JS_Object){
            const response = await axios.post("https://b.vlg-std.de:5000/api/supply/new", JS_Object)
            const msg = await response.data
            console.log(JSON.stringify(msg))
            console.log(msg.error)
            if(msg["error"] === false){
                goBack();
            }
        }
        console.log("DATA: " + JSON.stringify(saveJSON))
        pushDataToServer(saveJSON)

    }

    function options(){
        const prods = products || []
        return prods.map(p =>{
            return(
                <option value={p.id}>{p.name}</option>
            )
        })
    }

    function returnNewSupTable(){
        return supply.map(s =>{
            return(
                <tr>
                    <th>
                    <select onChange={e =>  updateProduct(supply.indexOf(s), e.target.value)}>
                        {options()}
                    </select>
                    </th>
                    <th><input defaultValue={0} type="number" onChange={e => updateValue(supply.indexOf(s), "amount", e.target.value)}/></th>
                    <th><ReactDatePicker selected={Date.parse(s.mhd)} dateFormat="dd.MM.yyyy" onChange={e => updateValue(supply.indexOf(s), "mhd", e)}></ReactDatePicker></th>
                    <th><Button onClick={() => removeSupply(supply.indexOf(s))}>-</Button></th>
                </tr>
            )
        })
    }


    return(
        <div className="content">
             <Button color="link" onClick={goBack}>                
                <i className="tim-icons icon-double-left" />
                Zurück
            </Button>
            <Card>
                <CardHeader tag="h1">Neuer Wareneingang
                <Row tag="h4">
                    <Col>
                    Eingangsdatum:
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row tag="h4">
                    <Col>
                        <ReactDatePicker selected={supplyDate} dateFormat="dd.MM.yyyy" onChange={e => setSupplyDate(e)}></ReactDatePicker>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                </CardHeader>
                <CardBody>
                <Table className="newSupTable">
                    <thead>
                        <tr>
                        <th>Produkt</th>
                        <th>Menge</th>
                        <th>MHD</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnNewSupTable()}
                    </tbody>
                </Table>
                <Row>
                    <Col>
                        <Button onClick={() => addSupply()}>+</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => saveSupply()}>Wareneingang speichern</Button>
                    </Col>
                </Row>
                </CardBody>
            </Card>
        </div>
    );
}