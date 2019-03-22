# JWT

## Authentication

__GET__ - `http://localhost:3000/authenticate`

__Response__ `{
    "message": "authentication done ",
    "token": "token123"
}`

## Access Data

__POST__ `http://localhost:3000/api/data`

__Header__ `"access-token": "token123"`

__Response__ `[
    {
        "id": 1,
        "name": "Ferrari"
    },
    {
        "id": 2,
        "name": "Lamborghini"
    }
]`