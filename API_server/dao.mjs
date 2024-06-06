/* Data Access Object (DAO) module for accessing films */
/* Initial version taken from exercise 4 (week 03) */

import sqlite from 'sqlite3';
import {Film} from './FLmodels.mjs';
import dayjs from 'dayjs';
import crypto from 'crypto';

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if (err) throw err;
});

export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, username: row.email, name: row.name};
        
        crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};

/** FILMS **/
// get all the films
export const listFilms = (userId) => {
  console.log("ALL FILMS");
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE userId = ?';
    db.all(sql, [userId], (err, rows) => {
      if (err){
        reject(err);
      }
      else {
        const films = rows.map(row => new Film(row.id, row.title, row.isFavorite, row.userId, row.watchDate, row.rating));
        resolve(films);
      }
    });
  });
}

export const listFilteredFilms = (name, userId) => {

  const filters = {
    "filter-favorites": films => films.filter(film => film.isFavorite == 1),
    "filter-best-rated": films => films.filter(film => film.rating == 5),
    "filter-seen-last-month": (films) => films.filter(film => !film.watchDate ? false : (dayjs().diff(film.watchDate, "month") < 1)),
    "filter-unseen": films => films.filter(film => !film.watchDate),
  };

  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM films WHERE userId = ?";
    db.all(sql, [userId], (err, rows) => {
      if (err){
        reject(err);
      }
      else {
        const films = rows.map(row => new Film(row.id, row.title, row.isFavorite, row.userId, row.watchDate, row.rating));
        
        if(filters[name]){
          resolve(filters[name](films));
        }
        resolve({error: "Wrong filter"});
      }
    });
  });
}

export const getFilm = (filmId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM films WHERE id = ?";
    db.get(sql, [filmId], (err, row) => {
      if(err) {
        reject(err);
      }
      else {
        if(!row) {
          resolve({error: "Wrong id"})
        }
        else{
          const film = new Film(row.id, row.title, row.isFavorite, row.userId, row.watchDate, row.rating);
          resolve(film);
        }
      }
    })
  });
}

export const getMaxId = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT MAX(id) as maxId from (SELECT id FROM films)";
    db.get(sql, (err, row) => {
      if(err){
        reject(err);
      }
      else {
        resolve(row.maxId);
      }
    });
  });
}

export const addFilm = (body, userId) => {

  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO films(title, isFavorite, rating, watchDate, userId)
                  VALUES(?,?,?,?,?)`;
    db.run(sql, [body.title, body.isFavorite, body.rating, body.watchDate, userId], function(err) {
      console.log(err);
      if(err) {
        reject(err);
      }
      else {
        resolve("Done");
      }
    })
  });
}

export const updateFilm = (body, filmId, userId) => {
  console.log(filmId, userId);
  return new Promise((resolve, reject) => {
    const sql = "UPDATE films SET title = ?, isFavorite = ?, rating = ?, watchDate = ?, userId = ? WHERE id = ?";
    db.run(sql, [body.title, body.isFavorite, body.rating, body.watchDate, userId, filmId], function(err) {
      if(err) {
        reject(err);
      }
      else {
        if(this.changes == 0){
          resolve({error: "Wrong id"})
        }
        else{
          resolve("Done");
        }
      }
    });
  });
}

export const updateRating = (newRating, id) => {
  return new Promise((resolve, reject) => {
    console.log(id);
    const sql = "UPDATE films SET rating = ? WHERE id = ?";
    db.run(sql, [newRating, id], function(err) {
      if(err) {
        reject(err);
      }
      else{
        if(this.changes == 0){
          resolve({error: "Wrong id"});
        }
        else {
          resolve("Done");
        }
      }
    });
  });
}

export const updateFavorite = (newFavorite, id) => {
  return new Promise((resolve, reject) => {
    console.log(id);
    const sql = "UPDATE films SET isFavorite = ? WHERE id = ?";
    db.run(sql, [newFavorite, id], function(err) {
      if(err) {
        reject(err);
      }
      else{
        if(this.changes == 0){
          resolve({error: "Wrong id"});
        }
        else {
          resolve("Done");
        }
      }
    });
  });
}

export const deleteFilm = (id) => {
  return new Promise((resolve, reject) => {
    console.log(id);
    const sql = "DELETE FROM films WHERE id = ?";
    db.run(sql, [id], function(err) {
      if(err) {
        reject(err);
      }
      else{
        if(this.changes == 0){
          resolve({error: "Wrong id"});
        }
        else {
          resolve("Done");
        }
      }
    });
  });
}