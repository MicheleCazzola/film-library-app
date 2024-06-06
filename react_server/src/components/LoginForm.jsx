import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import Title from "./Title";
import { useState } from "react";
import API from "../API.mjs";
import { useNavigate } from "react-router-dom";

function LoginForm(props) {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);

    const handleLogin = () => {
        event.preventDefault();

        API.logIn({username, password})
            .then(() => {
                props.setIsLoggedIn(true);
                setLoginFailed(false);
                navigate("/");
            })
            .catch(() => setLoginFailed(true));
    }

    const reset = () => {
        setUsername("");
        setPassword("");
        setLoginFailed(false);
    }

    return (
        <Container fluid className="w-50 min-vh-100 d-flex justify-content-center align-items-center">
            <Row>
                <Col lg={12}>
                    <Row as={"h3"} className="mx-0">Log in to your account</Row>
                    <Form onSubmit={() => handleLogin()} className="mx-0 my-2">
                        <Form.Group className='mb-3'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                value={username}
                                onChange={(event) => { setUsername(event.target.value);}}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                value={password}
                                onChange={(event) => { setPassword(event.target.value);}}>
                            </Form.Control>
                        </Form.Group>
                        <Button variant='success' type='Submit'>Login</Button>
                        <Button variant='danger' className="mx-1" onClick={() => reset()}>Reset</Button>
                        {loginFailed && <Alert variant="danger" className="my-1">Incorrect username and/or password</Alert>}
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginForm;