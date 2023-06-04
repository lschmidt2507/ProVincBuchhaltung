import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";

export default function ChangePassword() {

return(
    <div className="content">
    <Card>
        <CardHeader>
            <CardTitle tag="h3">Passwort ändern</CardTitle>
        </CardHeader>
        <CardBody>
            <Row>
                <Col>Altes Passwort: </Col>
                <Col><input type="password"/></Col>
            </Row>
            <Row>
                <Col>Neues Passwort: </Col>
                <Col><input type="password"/></Col>
            </Row>
            <Row>
                <Col>Neues Passwort wiederholen: </Col>
                <Col><input type="password"/></Col>
            </Row>
            <Row>
                <Button>Passwort ändern</Button>
            </Row>
        </CardBody>
    </Card>
    </div>
)

}