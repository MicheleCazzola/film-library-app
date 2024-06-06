import { Row } from "react-bootstrap";

function Title(props) {
    return (
        <Row as="h2">
            <span>{props.title}</span>
        </Row>
    );
}

export default Title;