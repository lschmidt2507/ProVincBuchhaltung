/*!

=========================================================
* Black Dashboard React v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";

function UserProfile() {

  const username = localStorage.getItem("username")


  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Eigenes Profil</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Name</label>
                        <Input
                          defaultValue={username}
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>
                          Klasse
                        </label>
                        <Input defaultValue="13. Jahrgang"/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Abteilung</label>
                        <select className="form-control">
                          <option value={0}>Einkauf</option>
                          <option value={1}>Buchhaltung</option>
                          <option value={2}>Personal</option>
                          <option value={3}>Marketing</option>
                        </select>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Position</label>
                        <select className="form-control">
                          <option value={0}>Mitglied</option>
                          <option value={1}>Aufsichtsrat</option>
                          <option value={2}>Abteilungsleitung</option>
                          <option value={3}>Geschäftsführung</option>
                        </select>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Sonstige Anmerkungen:</label>
                        <Input
                          rows="10"
                          defaultValue="Keine"
                          type="textarea"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="primary" type="submit">
                  Save
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <h4 className="title">{username}</h4>
                  <p className="description">Einkauf</p>
                  <p>13. Jahrgang</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
