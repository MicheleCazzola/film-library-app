import { Col, Row } from "react-bootstrap";

function Title(props) {
    return (
        <Row as="h2">
            <Col lg={12}>{props.title}</Col>
        </Row>
    );
}

export default Title;