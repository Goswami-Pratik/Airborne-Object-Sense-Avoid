import React, {Component} from "react";
import NavLogo from "../../images/logo.svg";
import {Container, Navbar, Nav, Button} from "react-bootstrap";
import {NavSpace} from "./NavBarStyle";

export default class NavBar extends Component {
    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="/">
                            <img alt="" src={NavLogo} width="60" height="60" className="d-inline-block align-top"/>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="m-auto h4 text-center">
                                <Nav.Link href="/project" >Project</Nav.Link>
                                <NavSpace/>
                                <Nav.Link href="/demo">Demo</Nav.Link>
                            </Nav>
                            <Nav className="right">
                                <Button href="/contact">Contact Us</Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
};
