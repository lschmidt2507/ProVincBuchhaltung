import axios from "axios";
import { func } from "prop-types";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Card, CardBody, CardHeader, Row, Table } from "reactstrap";

export default function NewSup(){

    const jwt = localStorage.getItem("jwt")

    const[products, setProducts] = useState([])

    const getAllProducts = async () =>{
        const response = await axios.post("http://178.254.2.54:5000/api/weekstats/products", {jwt})
        const js = await response.data;
        const js_parsed = JSON.parse(js)         
        return js_parsed
    }

    useEffect(() =>{
        async function initData(){
            const product_data = await getAllProducts()
            setProducts(product_data)
        }
        initData()
    }, [])

    function returnNewSupTable(){

    }


    return(
        <div className="content">
            <Card>
                <CardHeader tag="h1">Neuer Wareneingang</CardHeader>
                <CardBody>
                <Row>Eingangsdatum:</Row>
                <Row><ReactDatePicker></ReactDatePicker></Row>
                <Table>
                    <thead>
                        <th>Produkt</th>
                        <th>Menge</th>
                        <th>MHD</th>
                    </thead>
                </Table>
                </CardBody>
            </Card>
        </div>
    );
}