import { Film } from "./FilmModel.mjs";

const SERVER_URL = "http://localhost:3001"

const serverFilterURLs = {
    "All": "",
    "Favorites": "filter-favorites",
    "Best rated": "filter-best-rated",
    "Seen last month": "filter-seen-last-month",
    "Unseen": "filter-unseen"
};


const getFilms = async (filter) => {
    console.log(filter);
    const filterPath = filter === "All" ? "" : `?filter=${serverFilterURLs[filter]}`;
    const response = await fetch(SERVER_URL + "/api/films" + filterPath, {
        credentials: "include"
    });
    if (response.ok) {
        const filmsJson = await response.json();

        console.log(filmsJson);

        return filmsJson && filmsJson.map(film => {
            return new Film(
                film.id, film.title, film.isFavorite, film.userId, film.watchDate, film.rating
            );
        });
    }
    else {
        throw("Internal server error");
    }
}

const addFilm = async (film) => {
    const response = await fetch (SERVER_URL + "/api/films", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            title: film.title,
            isFavorite: film.favorite,
            rating: film.rating == 0 ? null : film.rating,
            watchDate: film.date ? film.date : null
        })
    });

    if (response.ok) {
        return null;
    }

    const errMsg = await response.json();
    throw errMsg;
}

const updateFilm = async (film, filmId) => {
    const response = await fetch (SERVER_URL + `/api/films/${filmId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            title: film.title,
            isFavorite: film.favorite,
            rating: film.rating == 0 ? null : film.rating,
            watchDate: film.date ? film.date : null,
            id: filmId
        })
    });

    if (response.ok) {
        return null;
    }

    const errMsg = await response.json();
    throw errMsg;
}

const updateRating = async (filmId, newRating) => {
    const response = await fetch(`${SERVER_URL}/api/films/${filmId}/rating`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            rating: newRating
        })
    });

    if (response.ok) {
        return null;
    }

    const errMsg = await response.json();
    throw errMsg;
}

const toggleFavorite = async (filmId, favorite) => {
    const response = await fetch(`${SERVER_URL}/api/films/${filmId}/isFavorite`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            isFavorite: favorite
        })
    });

    if (response.ok) {
        return null;
    }

    const errMsg = await response.json();
    throw errMsg;
}

const deleteFilm = async (filmId) => {
    const response = await fetch(`${SERVER_URL}/api/films/${filmId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (response.ok) {
        return null;
    }

    const errMsg = await response.json();
    throw errMsg;
}

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if(response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
};
  

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;  // an object with the error coming from the server
    }
};
  

const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

const API = {getFilms, addFilm, updateFilm, updateRating, toggleFavorite, deleteFilm, logIn, getUserInfo, logOut};
export default API;