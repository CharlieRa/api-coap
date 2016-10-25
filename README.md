# API CoAP

A API for communicate with device running CoAP server

## API Routes
### API
1. /api
    1. /
        - metodo: **GET**
        - descripción: Informacion de la api
        - recursos: localizacion, id usuario.
        - autentificación: No.
        - entrada temporal : Objeto.
            ```
            {
                "content": "test postman",
                "location": {
                    "longitude" : -70.5807622,
                    "latitude" : -33.5065764
                    }
             }
            ```
        - entrada oficial: Objeto.
            ```
            {
                "content": "test postman",
                "location": {
                    "longitude" : -70.5807622,
                    "latitude" : -33.5065764
                },
                "author": {
                    "id": "5623195c1d5696d514eab562"
                }
            }
            ```
    1. /nearest
