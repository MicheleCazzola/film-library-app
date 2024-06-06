# `fl-server`

The `fl-server` is the server-side app companion for FilmLibrary. It presents some APIs to perform some CRUD operations on films.

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __List all films__

URL: `/api/films`

HTTP Method: GET

Description: Retrieve all the films

Response: `200 OK` (success) or `500 Internal Server Error` (generic error)

Response body:
```
[
    {
        "id": 1,
        "title": "Pulp fiction",
        "isFavorite": 1,
        "rating": 5,
        "watchDate": "2024-03-10",
        "userId": 1
    },
    ...
]
```

### __List filtered films__

URL: `/api/films?filter=name`

HTTP Method: GET

Description: Retrieve filtered films:
-   isFavorite: favorite films
-   rating: best rated films
-   lastMonth: films seen last month
-   unseen: unseen films

Response: `200 OK` (success), `404: Not found` (wrong filter) or `500 Internal Server Error` (generic error)

Response body:
```
[
    {
        "id": 1,
        "title": "Pulp fiction",
        "isFavorite": 1,
        "rating": 5,
        "watchDate": "2024-03-10",
        "userId": 1
    },
    ...
]
```

### __Retrieve a specific film__

URL: `/api/films/<id>`

HTTP Method: GET

Description: Retrieve the specified film, given its is

Response: `200 OK` (success), `404 Not found` (wrong id) or `500 Internal Server Error` (generic error).

Response body:
```
[
    {
        "id": 3,
        "title": "Star Wars",
        "isFavorite": 0,
        "rating": null,
        "watchDate": null,
        "userId": 1
    },
    ...
]
```

### __Create a new film__

URL: `/api/films`

HTTP Method: POST

Description: Insert a new film into the library

Request body:
```
{
    "title": "John Wick",
    "isFavorite": 0,
    "rating": 4,
    "watchDate": "2024-02-10",
    "userId": 2
}
```

Response: `201 Created` (success) or `500 Internal Server Error` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: __None__

### __Update an existing film__

URL: `/api/films/<id>`

HTTP Method: PUT

Description: Updates an existing film, given its id

Request body:
```
{
    "title": "John Wick",
    "isFavorite": 0,
    "rating": 4,
    "watchDate": "2024-02-10",
    "userId": 2
}
```

Response: `200 OK` (success), `404 Not found` (wrong id) or `500 Internal Server Error` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: __None__

### __Update the rating of a specific film__

URL: `/api/films/<id>/rating`

HTTP Method: POST

Description: Updates the rating of a specific film, given its id

Request body:
```
{
    "rating": 4
}
```

Response: `204 No content` (success), `404 Not found` (wrong id) or `500 Internal Server Error` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: __None__

### __Mark an existing film as favorite/unfavorite__

URL: `/api/films/<id>/isFavorite`

HTTP Method: POST

Description: Mark an existing film as favorite(1) or unfavorite(0)

Request body:
```
{
    "isFavorite": 1
}
```

Response: `204 No content` (success), `404 Not found` (wrong id) or `500 Internal Server Error` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: __None__

### __Delete an existing film__

URL: `/api/films/<id>`

HTTP Method: DELETE

Description: Delete an existing film, given its id

Response: `204 No content` (success), `404 Not found` (wrong id) or `500 Internal Server Error` (generic error).

Response body: __None__