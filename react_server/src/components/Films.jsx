import { Button, Col, Container, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Films.css"
import { useEffect, useState } from "react";
import Title from "./Title";
import { Link, useLocation } from "react-router-dom";
import API from "../API.mjs";
import { Film } from "../FilmModel.mjs";

function Films(props) {

    const [films, setFilms] = useState([]);

    const getFilms = async () => {
        //console.log(props.filter);
        const films = await API.getFilms(props.filter);
        setFilms(films);
    };

    useEffect(() => {
		getFilms();
	}, [props.filter]);

    const handleCheck = async (filmId, favorite) => {

        setFilms((oldFilms) => oldFilms.map(oldFilm => {
            if (oldFilm.id === filmId) {
                return new Film(filmId, oldFilm.title, favorite, oldFilm.userId, oldFilm.date, oldFilm.rating) 
            }
            return oldFilm;
        }));

        // Favorite after current film, otherwise it takes all the "old" properties
        //props.updateFilm({...props.film, favorite: event.target.checked});
        API.toggleFavorite(filmId, favorite)
            .then(() => getFilms())
            .catch((err) => console.log(err));
    }

    const handleRating = async (filmId, rating) => {

        if (films.filter(film => film.id === filmId)[0].rating == rating) {
            return;
        }

        setFilms((oldFilms) => oldFilms.map(oldFilm => {
            if (oldFilm.id === filmId) {
                return new Film(filmId, oldFilm.title, oldFilm.favorite, oldFilm.userId, oldFilm.date, rating);
            }
            return oldFilm;
        }));
        
        
        API.updateRating(filmId, rating)
            .then(() => {
                getFilms();
            })
            .catch((err) => console.log(err));
    }

    const handleDelete = async (filmId) => {

        setFilms(oldFilms => {
			return oldFilms.filter(oldFilm => oldFilm.id !== filmId);
		});

        API.deleteFilm(filmId)
            .then(() => getFilms())
            .catch((err) => console.log(err));
    }

    return(
        <>  {films ? 
            <Col lg={9} id="films-content" className="align-items-center">
                <Title title={props.filter} />
                <FilmList films={films} handleCheck={handleCheck} handleRating={handleRating} handleDelete={handleDelete} />
            </Col> : <></>}
        </>
    );
}

function FilmList(props) {

    return (
        <ListGroup className="container-fluid list-group-flush px-3" id="films-list">
            {props.films && props.films.map(film => <FilmItem key={film.id} film={film} 
                handleCheck={props.handleCheck} handleRating={props.handleRating} handleDelete={props.handleDelete} />)}
        </ListGroup>
    );
}

function FilmItem(props) {

    return(
        <ListGroupItem className="row">
            <div className="w-100 justify-content-between d-inline-flex">
                <FilmData film={props.film} handleCheck={props.handleCheck} />
                <FilmActions film={props.film} handleRating={props.handleRating} handleDelete={props.handleDelete} />
            </div>
        </ListGroupItem>
    );
}

function FilmData(props) {

    return (
        <>
            <Col className="col-6 col-xl-3">
                {props.film.title}
                </Col>
            <Col className="col-6 col-xl-3 text-end text-xl-center">
                <Form.Group>
                    <Form.Check label="Favorite" inline checked={props.film.favorite}
                        onChange={(event) => props.handleCheck(props.film.id, event.target.checked)} />
                </Form.Group>
            </Col>
            <Col className="col-6 col-xl-3 text-xl-center">
                {props.film.getDate("YYYY, MMMM DD")}
            </Col>
        </>
    );
}

function FilmActions(props) {
    const location = useLocation();

    return (
        <Container className="d-flex justify-content-end col-8 col-xl-3 text-end">  
            <Col className="col-6">
                {[...Array(5).keys()].map(id => {
                    if(id < props.film.rating) {
                        return <i key={id} className="bi bi-star-fill" onClick={() => props.handleRating(props.film.id, id+1)}></i>
                    }
                    else {
                        return <i key={id} className="bi bi-star" onClick={() => props.handleRating(props.film.id, id+1)}></i>
                    }
                })}
            </Col>
            <Col className="col-6">
                <Link variant="px-0" to={"/edit/" + props.film.id} state={{nextPage: location.pathname, film: props.film.serialize()}}>
                    <i className="bi bi-pencil"></i>
                </Link>
                <Button variant="link" id="delete">
                    <i className="bi bi-trash3" onClick={() => props.handleDelete(props.film.id)}></i>
                </Button>
            </Col>
        </Container>
    );
}

export default Films;