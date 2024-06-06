import { Col, Nav } from "react-bootstrap";
import "./SideFilters.css"
import { NavLink } from "react-router-dom";

function SideFilters(props) {
    return (
        <Col lg={3} id={"film-filters"} className="d-md-block bg-light">
            <div id="sidebar-content" className="fixed-top col-lg-3 px-2">
                <h3>
                    Filters
                </h3>
                <Nav className="sidebar flex-column" variant="pills">
                    {props.filters.map(f => <Item key={f} name={f} url={props.URLs[f]}/>)}
                </Nav>
            </div>
            
        </Col>
    );
}

function Item(props) {
    return(
        <Nav.Item className="mx-0">
            <NavLink to={"/" + props.url}>
                {props.name}
            </NavLink>
        </Nav.Item>
    );
}

export default SideFilters;