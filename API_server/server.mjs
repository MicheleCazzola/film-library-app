import express, {json} from "express";
import { check, validationResult } from "express-validator";
import morgan, { format } from "morgan";
import cors from "cors"
import { listFilms, listFilteredFilms, getFilm, addFilm, getMaxId, updateFilm, updateRating, updateFavorite, deleteFilm} from "./dao.mjs";

// Init
const port = 3001;
const app = express();

// Middleware
app.use(json());
app.use(morgan("dev"));
app.use(cors());

const filmValidation = [
    check("title").notEmpty(),
    check("isFavorite").isBoolean(),
    check("rating").isInt({min: 1, max: 5}).optional({nullable: true}),
    check("watchDate").isDate("YYYY-MM-DD").optional({nullable: true}),
    check("userId").isInt()
]

// Route
app.get("/api/films", (req, res) => {
    if(req.query.filter){
        listFilteredFilms(req.query.filter)
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
    }
    else {
        listFilms()
        .then(result => {
            if(result.error){
                res.status(404).json(result.error);
            }
            res.json(result);
        })
        .catch(err => res.status(500).json(err));
    } 
});

app.get("/api/films/:id", (req, res) => {
    getFilm(req.params.id)
    .then(result => {
        if(result.error){
            res.status(404).json(result.error);
        }
        else {
            res.json(result);
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    } );
});

app.post("/api/films", 
    filmValidation,    
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(422).json({errors: errors.array()});
        }
        else{
            getMaxId()
            .then(maxId => addFilm(req.body, maxId+1))
            .then(() => res.status(201).end())
            .catch(err => res.status(500).json(err));
        }
    }
)

app.put("/api/films/:id", 
    filmValidation,
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(422).json({errors: errors.array()});
        }
        else{
            updateFilm(req.body, req.params.id)
            .then(result => {
                if(result.error) {
                    res.status(404).json(result.error);
                }
                else{
                    res.status(200).end();
                }
            } )
            .catch(err => res.status(500).json(err));
        }
    }
);

app.post("/api/films/:id/rating", [
    check("rating").optional({nullable: true}).isInt({min: 1, max: 5})
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({errors: errors.array()});
    }
    else{
        updateRating(req.body.rating, req.params.id)
        .then(result => {
            if(result.error) {
                res.status(404).json(result.error);
            }
            else{
                res.status(204).end();
            }
        } )
        .catch(err => res.status(500).json(err));
    }
});

app.post("/api/films/:id/isFavorite", [
    check("isFavorite").isBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({errors: errors.array()});
    }
    else{
        updateFavorite(req.body.isFavorite, req.params.id)
        .then(result => {
            if(result.error) {
                res.status(404).json(result.error);
            }
            else{
                res.status(204).end();
            }
        })
        .catch(err => res.status(500).json(err));
    }
});

app.delete("/api/films/:id", (req, res) => {
    deleteFilm(req.params.id)
    .then(result => {
        if(result.error) {
            res.status(404).json(result.error);
        }
        else{
            res.status(204).end();
        }
    })
    .catch(err => res.status(500).json(err));
});


// Start server
app.listen(port, () => console.log(`API server started at http://localhost:${port}`));