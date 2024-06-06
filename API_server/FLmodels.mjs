import dayjs from "dayjs"

function Film(filmId, title, isFavorite=false, userId=1, watchDate=null, rating=0){
    this.id = filmId;
    this.title = title;
    this.isFavorite = isFavorite;
    this.watchDate = watchDate && dayjs(watchDate);
    this.rating = rating;
    this.userId = userId;
}

export {Film};