import react, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import axios from "axios"

axios.defaults.withCredentials = true



export default function (props) {
    const history = useHistory();
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [jsonRes, setJsonRes] = useState([]);

    async function getPost(route, body){
        try{
            const response = await axios.post("https://b.vlg-std.de:5000/api/" + route, body, {withCredentials: true})
            const js = await response.data
            const jwt = js["accessToken"]
            const headers = response.config
            localStorage.setItem("jwt", jwt);
            return js
        }catch(error){
            console.log("Error:" + error)
            return error
        }
    }

    async function tryLogin(){
        var body = {
            username: username,
            password: password
        }
        var loginRes = await getPost("auth/login", body)
        console.log(loginRes)
        if(loginRes["error"] === false){
            var token = localStorage.getItem('token')
            localStorage.setItem("username", username)
            console.log("jwt: " + token)
            history.push("/admin")
        }else{
            console.log("Fehler beim Anmelden: " + loginRes["message"])
        }
    }

    return (
        <Card>
            <CardHeader tag="h1">Login</CardHeader>
            <CardBody>
                <Row>
                    <Col>Benutzername:</Col>
                    <Col>
                    <input className="usernameInput form-control" onChange={e => setUsername(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col>Passwort:</Col>
                    <Col><input type="password" className="passwordInput form-control" onChange={e => setPassword(e.target.value)}/></Col>
                </Row>
                <Row>
                    <Col/>
                    <Col>
                        <Button onClick={tryLogin}>Anmelden</Button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
  }