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

    function pushToNewWeek(){
        console.log("Try to push");
        history.push("/admin/newWeek")
    }

    const getProductsData = async() =>{
        const response = await axios.post("http://178.254.2.54:5000/api/weekstats/products", {jwt})
        const js = await response.data;
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

    function addScaleResult(productId){
        
    }

    function updateAmount(productId, isSingle, amount){
        
    }

    function productTable(){
        const products = allProducts
        return products.map(product => {


            var amount = 0

            return(
                <tr key={product["id"]}>
                    <td>{product["name"]}</td>
                    <td><input class="form-control" type="number" defaultValue="0" style={{width: "60px"}} onChange={e => updateAmount(product.product_id, true, e.target.value)}/></td>
                    <td><input class="form-control" type="number" defaultValue="0" style={{width: "60px"}} onChange={e => updateAmount(product.product_id, false, e.target.value)}/></td>
                    <td>
                        <Button onClick={() => addScaleResult(product["id"])}>
                            <i className="tim-icons icon-wifi" />
                        </Button>
                    </td>
                    <td>{amount}</td>
                </tr>
        );
    })
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
                    <Button onClick={pushToNewWeek}>Speichern</Button>
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