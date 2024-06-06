import dayjs from "dayjs";
import { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import Title from "./Title"
import "./FilmForm.css"
import validator from "validator";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../API.mjs";


function FilmForm(props) {

    const navigate = useNavigate();
    const location = useLocation();

    const film = (location.state && location.state.film) ? JSON.parse(location.state.film) : null;
    
    const [title, setTitle] = useState(film ? film.title : "");
    const [favorite, setFavorite] = useState(film ? film.favorite : false);
    const [date, setDate] = useState(film ? film.date : "");
    const [rating, setRating] = useState(film ? (film.rating || 0) : 0);
    const [valid, setValid] = useState({"title": true});

    const handleSubmit = (event) => {
        event.preventDefault();

        const validTitle = !validator.isEmpty(validator.trim(title));
        const nextPage = location.state? location.state.nextPage : "/";

        setValid({title: validTitle});

        if (validTitle){
            const newFilm = {title, favorite, date, rating};
            if (!film) {
                const filmToInsert = {...newFilm, userId: 1};
                console.log(filmToInsert);
                API.addFilm(filmToInsert)
                    .then(() => navigate(nextPage))
                    .catch(err => console.log(err));
            }
            else {
                const filmToInsert = {...newFilm, userId: 1};
                API.updateFilm(filmToInsert, film.id)
                    .then(() => navigate(nextPage))
                    .catch(err => console.log(err));
            }
        }
    }

    const cancel = () => {
        
        const nextPage = location.state? location.state.nextPage : "/";
        navigate(nextPage);
    }

    return (
        <Col lg={9} id="films-form" className="align-items-center">
        {   
            <>
                <Title title={props.buttonName === "Add" ? "Add a new film" : `Update film "${film.title}"`}/>
                <Form onSubmit={handleSubmit} className="my-2">
                    <Form.Group className='mb-3'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={title}
                            className={!valid.title && "invalid-input"}
                            onChange={(event) => { valid.title = true; setTitle(event.target.value);}}>
                        </Form.Control>
                        {!valid.title && <Form.Text muted>
                        The title must have at least one non-space character
                        </Form.Text>}
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Check type="checkbox" label={"Favorite"} checked={favorite}
                        onChange={(event) => setFavorite(event.target.checked)}></Form.Check>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            max={dayjs().format("YYYY-MM-DD")}
                            onChange={(event) => setDate(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                            type="number"
                            value={rating} 
                            min={0}
                            max={5}
                            onChange={(event) => setRating(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Button variant='success' type='Submit'>{props.buttonName}</Button>
                    <Button variant='danger' className="mx-1" onClick={() => cancel()}>Cancel</Button>
                </Form>
            </>
        }
        </Col>
    )
}

export default FilmForm;