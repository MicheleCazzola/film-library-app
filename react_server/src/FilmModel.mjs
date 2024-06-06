import dayjs from "dayjs";

function Film(filmId, title, favorite, userId=1, date=null, rating=0){
    this.id = filmId;
    this.title = title;
    this.favorite = favorite;
    this.date = date && dayjs(date, "YYYY-MM-DD");
    this.rating = rating;
    this.userId = userId;

    this.getDate = (format) => {
        if (!this.date){
            return "";
        }
        return this.date.format(format);
    }

    this.serialize = () => {
        return JSON.stringify({
            id: this.id,
            title: this.title,
            favorite: this.favorite,
            date: this.getDate("YYYY-MM-DD"),
            rating: this.rating,
            userId: this.userId
        });
    }

    this.toString = () => {
        return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.favorite}, ` +
        `Watch date: ${this.date}, Score: ${this.rating}, User: ${this.userId}`;
    }
}

function FilmLibrary() {
    this.films = [];

    this.init = () => {
        this.films = [
            new Film(1, "Pulp fiction", true, 1, "2024-03-10", 5),
            new Film(2, "21 Grams", true, 1, "2024-03-17", 4),
            new Film(3, "Star Wars", false, 1),
            new Film(4, "Matrix", false, 1),
            new Film(5, "Shrek", false, 1, "2024-03-21", 3)
        ];
    }

    this.getFilms = (filterCondition=this.filterConditions["All"]) => {
        return this.films.filter(filterCondition);
    }

    this.deleteFilm = (id) => {
        this.films = this.films.filter(film => film.id !== id);
    }

    this.filterTitle = (id) => {
        return id[0].toUpperCase() + id.slice(1).split("").map(c => c === "-" ? " " : c).join("");
    }

    this.filterConditions = {
        "All": (film) => true,
        "Favorites": (film) => film.favorite,
        "Best rated": (film) => film.rating == 5,
        "Seen last month": (film) => film.date && (dayjs().diff(film.date, "month") < 1),
        "Unseen": (film) => !film.date
    };

    this.filterURLs = {
        "All": "",
        "Favorites": "filter/filter-favorites",
        "Best rated": "filter/filter-best-rated",
        "Seen last month": "filter/filter-seen-last-month",
        "Unseen": "filter/filter-unseen"
    };
}

export {Film, FilmLibrary};