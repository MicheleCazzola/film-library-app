import {Button, Col, Form, InputGroup, Navbar, Row} from "react-bootstrap";

function NavHeader() {
    return(
        <Navbar className="bg-primary navbar-dark" fixed="top">
            <Row className="w-100 px-2 py-1">
                <Col className="col-6 col-md-4">
                    <i className="bi bi-collection-play" style={{color: "white"}}></i>
                    <Navbar.Brand className="mx-1">Film Library</Navbar.Brand>
                </Col>
                <Col className="col-3 col-md-8 d-flex justify-content-end">
                    <Form inline="true">
                        <InputGroup>
                            <Form.Control placeholder="Search" aria-placeholder="Search"></Form.Control>
                        </InputGroup>
                    </Form>
                    <Button>
                        <i className="bi bi-person-circle"></i>
                    </Button>
                </Col>
            </Row>
        </Navbar>
    );
}

export default NavHeader;