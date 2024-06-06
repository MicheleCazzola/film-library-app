"use strict";

import dayjs from "dayjs"
import sqlite from "sqlite3"

const db = new sqlite.Database("films.db", (err) => {
    if (err){
        throw err;
    }
});


// Come gestire la presenza di diversi parametri opzionali?
// Cosa significa a livello pratico che un parametro è obbligatorio ma ha un default?
function Film(filmId, title, isFavorite=false, userId=1, watchingDate=null, rating=0){
    this.id = filmId;
    this.title = title;
    this.isFavorite = isFavorite;
    this.watchingDate = watchingDate && dayjs(watchingDate);
    this.rating = rating;
    this.userId = userId;

    this.toString = () => {
        return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.isFavorite}, ` +
        `Watch date: ${this.watchingDate ? this.watchingDate.format("YYYY-MM-DD") : null}, Score: ${this.rating}, User: ${this.userId}`;
    }
}

function FilmLibrary(){

    this.sortByDate = () => this.films.toSorted((a, b) =>{
        if(!(a.watchingDate)) return 1;
        if(!(b.watchingDate)) return -1;
        return a.watchingDate.diff(b.watchingDate, "day");
    });

    this.getRated = () => this.films.filter(film => film.rating > 0).toSorted((a, b) => b.score - a.score);

    this.retrieveFilms = () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM films";
            db.all(query, (err, rows) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(rows.map(row => new Film(row.id, row.title, row.isFavorite, row.userId, row.watchDate, row.rating)));
                }
            })
        });
    }

    this.retrieveFavoriteFilms = () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM films WHERE isFavorite = 1";
            db.all(query, (err, rows) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(rows.map(row => new Film(row.id, row.title, row.isFavorite, row.userId, row.watchDate, row.rating)));
                }
            })
        });
    }

    this.retrieveTodayFilms = () => {
        return new Promise((resolve, reject) => {
            const today = dayjs().format("YYYY-MM-DD");
            const query = "SELECT * FROM films WHERE watchDate = ?";
            db.all(query, [today], (err, rows) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(rows.map(row => new Film(row.id, row.title, row.isFavorite, row.userId, row.watchDate, row.rating)));
                }
            })
        });
    }

    this.earlierThan = (date) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM films WHERE watchDate < ?";
            db.all(query, [date], (err, rows) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(rows.map(row => new Film(row.id, row.title, row.isFavorite, row.userId, row.watchDate, row.rating)));
                }
            })
        });
    }

    this.ratingAbove = (threshold) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM films WHERE rating >= ?";
            db.all(query, [threshold], (err, rows) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(rows.map(row => new Film(row.id, row.title, row.isFavorite, row.userId, row.watchDate, row.rating)));
                }
            })
        });
    }

    this.titleContains = (substr) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM films WHERE title LIKE '%' || ? || '%' COLLATE NOCASE";
            db.all(query, [substr], (err, rows) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(rows.map(row => new Film(row.id, row.title, row.isFavorite, row.userId, row.watchDate, row.rating)));
                }
            })
        });
    }

    this.addNewFilm = (film) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO films(id, title, isFavorite, rating, watchDate, userId) VALUES(?,?,?,?,?,?);`
            db.run(query, [film.id, film.title, film.isFavorite, film.rating, film.watchingDate.format("YYYY-MM-DD"), film.userId], function (err) {
                if(err){
                    reject(err);
                }
                else{
                    resolve(this.lastID);
                }
            });
        })
    } 

    this.deleteFilm = (id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM films WHERE id = ?`
            db.run(query, [id], function (err) {
                if(err){
                    reject(err);
                }
                else{
                    resolve(this.changes);
                }
            });
        })
    }

    this.resetWatchedFilms = () => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE films SET watchDate = NULL`
            db.run(query, function (err) {
                if(err){
                    reject(err);
                }
                else{
                    resolve(this.changes);
                }
            });
        })
    }
}

async function main(){
    const printArray = (films) => films.forEach(film => console.log(film.toString()));

    // ES 1
    let lib = new FilmLibrary();

    // 1a
    const films = await lib.retrieveFilms();
    console.log("***Film list***")
    printArray(films);
    console.log();

    // 1b
    const favorites = await lib.retrieveFavoriteFilms();
    console.log("***Favorite films***")
    printArray(favorites);
    console.log("\n");

    // 1c
    const todayFilms = await lib.retrieveTodayFilms();
    console.log("***Today films***")
    printArray(todayFilms);
    console.log("\n");

    // 1d
    const date = "2024-03-20";
    const earlierFilms = await lib.earlierThan(date);
    console.log(`***Films watched earlier than ${date}***`);
    printArray(earlierFilms);
    console.log("\n");

    // 1e
    const ratingThreshold = 4;
    const highRatedFilms = await lib.ratingAbove(ratingThreshold);
    console.log(`***Films with rating >= ${ratingThreshold}***`);
    printArray(highRatedFilms);
    console.log("\n");

    // 1f
    const stringParam = "mat";
    const titleContains = await lib.titleContains(stringParam);
    console.log(`***Films whose title contains ${stringParam}***`);
    printArray(titleContains);
    console.log();

    // ES 2

    // 2a
    const f = new Film(6, "Una notte da leoni", true, 3, "2024-02-21", 5);
    lib.addNewFilm(f).then(id => console.log(`Film ${id} inserito`)).catch(e => console.log(`Film non inserito, causa:\n${e}`));
    console.log();

    // 2b
    const filmId = 6;
    lib.deleteFilm(filmId).then(num => console.log(`Cancellate ${num} righe`)).catch(e => console.log(`Film non cancellato, causa:\n${e}`));

    // 2c
    lib.resetWatchedFilms().then(num => console.log(`Campo "watchDate" cancellato in ${num} righe`)).catch(e => console.log(`Operazione fallita, causa:\n${e}`))

    db.close();
}

main();

