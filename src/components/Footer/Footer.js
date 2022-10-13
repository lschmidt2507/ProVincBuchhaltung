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
/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container, Nav, NavItem, NavLink } from "reactstrap";

function Footer() {
  return (
    <footer className="footer">
      <Container fluid>
        <div className="copyright">
          © {new Date().getFullYear()} erstellt von{" "}
          <a
            href="https://twitter.com/leinoes"
            target="_blank"
          >
            Linus Schmidt
          </a>{" "}
          und{" "}
          <a
            href="https://twitter.com/LutzJuli"
            target="_blank"
          >
            Lutz Oeser
          </a>{" "}
          für die Schülerfirma {" "}
          <i className="tim-icons icon-check-2" />{" "}
          ProVinc
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
