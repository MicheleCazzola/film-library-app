import express, {json} from "express";
import { check, validationResult } from "express-validator";
import morgan, { format } from "morgan";
import cors from "cors"
import { listFilms, listFilteredFilms, getFilm, addFilm, getMaxId, updateFilm, updateRating, updateFavorite, deleteFilm, getUser} from "./dao.mjs";
import passport from "passport";
import LocalStrategy from 'passport-local';
import session from 'express-session';

// Init
const port = 3001;
const app = express();

// Middleware
app.use(json());
app.use(morgan("dev"));
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
  };
app.use(cors(corsOptions));

// Passport: set up local strategy -- NEW
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUser(username, password);
    if(!user)
      return cb(null, false, 'Incorrect username or password.');
      
    return cb(null, user);
}));
  
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function (user, cb) { // this user is id + email + name
    return cb(null, user);
    // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});
  
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}
  
app.use(session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

const filmValidation = [
    check("title").notEmpty(),
    check("isFavorite").isBoolean(),
    check("rating").isInt({min: 1, max: 5}).optional({nullable: true}),
    check("watchDate").isDate("YYYY-MM-DD").optional({nullable: true}),
    check("userId").isInt().optional({nullable: true})
]

// Route
app.get("/api/films",
    isLoggedIn,
    (req, res) => {
    if(req.query.filter){
        listFilteredFilms(req.query.filter, req.user.id)
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
    }
    else {
        listFilms(req.user.id)
        .then(result => {
            if(result.error){
                res.status(404).json(result.error);
            }
            res.json(result);
        })
        .catch(err => res.status(500).json(err));
    } 
});

app.get("/api/films/:id",
    isLoggedIn,
    (req, res) => {
    getFilm(req.params.id, req.user.id)
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
    isLoggedIn,
    filmValidation,    
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(422).json({errors: errors.array()});
        }
        else{
            addFilm(req.body, req.user.id)
            .then(() => res.status(201).end())
            .catch(err => res.status(500).json(err));
        }
    }
)

app.put("/api/films/:id", 
    filmValidation,
    isLoggedIn,
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(422).json({errors: errors.array()});
        }
        else{
            updateFilm(req.body, req.body.id, req.user.id)
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
    ],
    isLoggedIn,
    (req, res) => {
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
    ],
    isLoggedIn, 
    (req, res) => {
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

app.delete("/api/films/:id",
    isLoggedIn,
    (req, res) => {
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

app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).send(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
            return next(err);
            
            // req.user contains the authenticated user, we send all the user info back
            return res.status(201).json(req.user);
        });
    })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
});
  
  // DELETE /api/session/current -- NEW
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});


// Start server
app.listen(port, () => console.log(`API server started at http://localhost:${port}`));