import "./NewFilm.css"
import { Link, useLocation } from "react-router-dom";

function NewFilm() {
    const location = useLocation();
    return (
        <>
            <Link className=" btn btn-primary footer-dx" to={"/add"} state={{nextPage: location.pathname}}>
                <i className="bi bi-plus"></i>
            </Link>
        </> 
    );
}

export default NewFilm;