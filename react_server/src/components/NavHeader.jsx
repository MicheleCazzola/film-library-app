import {Alert, Button, Col, Form, InputGroup, Navbar, Row} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import API from "../API.mjs";

function NavHeader(props) {

    const navigate = useNavigate();

    const handleLogout = () => {
        API.logOut()
            .then(() => {
                props.setIsLoggedIn(false);
                navigate("/login");
            })
            .catch(err => console.log(err));
    }

    return(
        <Navbar className="bg-primary navbar-dark" fixed="top">
            <Row className="w-100 px-2 py-1">
                <Col className="col-6 col-md-4 d-flex">
                <Link to="/">
                    <Navbar.Brand className="mx-1">
                        <i className="bi bi-collection-play" style={{color: "white"}}></i> Film Library
                    </Navbar.Brand>
                </Link>
                </Col>
                <Col className="col-3 col-md-8 d-flex justify-content-end">
                    <Navbar.Brand>{props.name}'s film library</Navbar.Brand>
                    <Form inline="true">
                        <InputGroup>
                            <Form.Control placeholder="Search" aria-placeholder="Search"></Form.Control>
                        </InputGroup>
                    </Form>
                    <Button>
                        <i className="bi bi-person-circle"></i>
                    </Button>
                    <Button onClick={() => handleLogout()}>
                        Logout
                    </Button>
                </Col>
            </Row>
        </Navbar>
    );
}

export default NavHeader;