import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap"
import { useHistory } from "react-router-dom"
import { Redirect } from "react-router-dom"
import axios from "axios"
import Moment from "react-moment"
import "moment/locale/de"



export default function Stock(){
    Moment.Local = "de"
    const history = useHistory();
    const jwt = localStorage.getItem("jwt")
    const [allProducts, setAllProducts] = useState([])

    async function getScale(productId){
        const response = await axios.post("https://b.vlg-std.de:5000/api/scale/single", {"id":productId, jwt})
        const js = await response.data
        return js["amount"]
    }

    async function sendStockData(products){
        const response = await axios.post("https://b.vlg-std.de:5000/api/scale/setstock", {products, jwt})
        const js = await response.data
        return js
    }

    const getProductsData = async() =>{
        const response = await axios.post("https://b.vlg-std.de:5000/api/weekstats/products", {jwt})
        const js = await response.data;
        js.map(product => {
            product["amount"]=0
            product["scaleAmount"]=0
            product["singleAmount"]=0
            product["packageCount"]=0
        })
        return js
    }

    useEffect(() => {
        console.log("IN USE EFFECT")
        async function initData(){
            const prod = await getProductsData()
            setAllProducts(prod)
        }
        initData();
    }, [])

    async function addScaleResult(productId){ 
        const prod = Object.create(allProducts)
        const amount = await getScale(productId)
        prod.map(product =>{
            if(parseInt(product["id"]) === parseInt(productId)){
                product["scaleAmount"] += amount
                product["amount"]=parseInt(product["singleAmount"]) + parseInt(product["packageCount"])*parseInt(product["package_size"]) + parseInt(product["scaleAmount"])
            }
        })
        setAllProducts(prod)
    }

    async function resetScaleResult(productId){ 
        const prod = Object.create(allProducts)
        prod.map(product =>{
            if(parseInt(product["id"]) === parseInt(productId)){
                product["scaleAmount"] = 0
                product["amount"]=parseInt(product["singleAmount"]) + parseInt(product["packageCount"])*parseInt(product["package_size"]) + parseInt(product["scaleAmount"])
            }
        })
        setAllProducts(prod)
    }

    function updateAmount(productId, isSingle, amount){
        const prod = Object.create(allProducts)
        
        if (isSingle){
            prod.map(product =>{
                if(parseInt(product["id"]) === parseInt(productId)){
                    product["singleAmount"]=parseInt(amount)
                    product["amount"]=parseInt(product["singleAmount"]) + parseInt(product["packageCount"])*parseInt(product["package_size"]) + parseInt(product["scaleAmount"])
                }
            })
        }else{
            prod.map(product =>{
                if(parseInt(product["id"]) === parseInt(productId)){
                    product["packageCount"]=amount
                    product["amount"]=parseInt(product["singleAmount"]) + parseInt(product["packageCount"])*parseInt(product["package_size"]) + parseInt(product["scaleAmount"])
                }
            })
        }
        setAllProducts(prod)
    }

    function productTable(){
        return allProducts.map(product => {

            return(
                <tr key={product["id"]}>
                    <td>{product["name"]}</td>
                    <td><input class="form-control" type="number" defaultValue="0" style={{width: "60px"}} onChange={e => updateAmount(product["id"], true, e.target.value)}/></td>
                    <td><input class="form-control" type="number" defaultValue="0" style={{width: "60px"}} onChange={e => updateAmount(product["id"], false, e.target.value)}/></td>
                    <td>
                        <Button onClick={() => addScaleResult(product["id"])}>
                            <i className="tim-icons icon-wifi" />
                        </Button>
                    </td>
                    <td>
                        <Button onClick={() => resetScaleResult(product["id"])}>
                            <i className="tim-icons icon-simple-remove" />
                        </Button>
                    </td> 
                    <td>{product["amount"]}</td>
                </tr>
        );
    })
    }

    async function save(){
        var sendData = []
        allProducts.map(product => {
            sendData.push({"id":product["id"],"amount":product["amount"]})
        })
        console.log(sendData)
        await sendStockData(sendData)
    }

    return (
        <div className="content">
            <Card className="headerCart">
                <CardHeader>
                    <Row>
                        <Col>
                            <CardTitle tag="h1">Inventur</CardTitle>
                        </Col>
                    </Row>
                </CardHeader>
            </Card>
            <Card className="supplyTableCard">
                <CardHeader>
                    <Row>
                    <Col md="auto">
                    <CardTitle tag="h3">Bitte Bestände eingeben</CardTitle>
                    </Col>
                    <Col md="auto">
                    <Button onClick={save}>Speichern</Button>
                    </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Table className="weeksTable">
                        <thead>
                            <tr>
                                <th>Produkt</th>
                                <th>Einzeln</th>
                                <th>Packungen</th>
                                <th>Waagenergebnis addieren</th>
                                <th>Waagenergebnis entfernen</th>
                                <th>Anzahl</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productTable()}
                        </tbody>
                    </Table>    
                </CardBody>
            </Card>
        </div>
    )
}