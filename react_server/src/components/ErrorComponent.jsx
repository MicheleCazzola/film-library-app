import { Button, Col } from "react-bootstrap";
import "./ErrorComponent.css"
import { useNavigate } from "react-router-dom";

function ErrorComponent () {
    const navigate = useNavigate();
    console.log("ERROR");
    return (
        <>
            <Col lg={9}>
                <h1 id="error-message">Something went wrong</h1> 
                <footer id="back-to-previous">    
                    <Button onClick={() => navigate("/")} >Go back to previous page</Button>
                </footer>
            </Col>
        </>
    );
}

export default ErrorComponent;