import { Col } from "react-bootstrap";
import "./ErrorComponent.css"
import { Link, useLocation } from "react-router-dom";

function ErrorComponent () {
    const location = useLocation();
    console.log("ERROR");
    return (
        <>
            <Col lg={9}>
                <h1 id="error-message">Something went wrong</h1> 
                <footer id="back-to-previous">    
                    <Link to={location.state ? location.state.nextPage : "/"}>Go back to previous page</Link>
                </footer>
                
            </Col>
        </>
    );
}

export default ErrorComponent;