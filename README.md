# API CoAP
API for communicate with device running CoAP server
## API Routes
Todas las rutas estan bajo /api

1) /
  - metodo: **GET**
  - descripción: Informacion de la api
  - autentificación: No.

**Parametros:** Empty
**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta entrega       |
| message       | String         |  mensaje con la Informacion de la api       |

**Error:** 500
Internal Server Error

- Ejemplo(Respuesta): Objeto.
```
{
  "success": true,
  "message": "API CoAP"
}
```

2) /signup
  - metodo: **POST**
  - descripción: Crear nuevos usuarios Cliente en el sistema
  - autentificación: No.

**Parametros:**

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| username       | String         | Nombre de usuario       |
| password       | String         | Contraseña del usuario nuevo       |

**Success:** 201

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta entrega       |
| message       | String         |  mensaje con la Informacion que fue creado con exitosamente |
| _id       | String         |  Id del usuairo recientemente creado |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElUsuarioExiste        |  El usuario ya existe en el sistema       |
| NoParametros        |  No se entregaron parametos para crear el usuario |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
      "success": true,
      "message": "Usuario creado exitosamente.",
      "_id": "5834d612c817b66367000001"
  }
  ```

3) /auth
  - metodo: **POST**
  - descripción: Autenticar usuarios en el sistema
  - autentificación: No.

**Parametros:**

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| username       | String         | Nombre de usuario a autenticar       |
| password       | String         | Contraseña del usuario a autenticar       |

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta entrega       |
| token       | String         |  token de autenticacion para consultar la API. Solo dura 24 hrs. |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElUsuarioNoExiste        |  El usuario no existe en el sistema       |
| NoParametros        |  No se entregaron parametros para autenticar el usuario |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7InBhc3N3b3JkIjoiaW5pdCIsInVzZXJuYW1lIjoiaW5pdCIsImFkbWluIjoiaW5pdCIsIm5ldHdvcmtzIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsImFkbWluIjp0cnVlLCJuZXR3b3JrcyI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsInVzZXJuYW1lIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0Il19fSwiaXNOZXciOmZhbHNlLCJfbWF4TGlzdGVuZXJzIjowLCJfZG9jIjp7ImFkbWluIjp0cnVlLCJuZXR3b3JrcyI6WyI1ODJhNWEwZTIzNDExZjU0MzYwMDAwMDEiXSwiX192IjowLCJwYXNzd29yZCI6IiQyYSQxMCRQSUpQZ2x0YUNRWXF2dWE1UHlZdlRlTXpHV2NYWmRZSUh2V05mVEZLZVV5ZER0Y053Ty5DTyIsInVzZXJuYW1lIjoiYWRtaW4iLCJfaWQiOiI1ODJjZGI1MjNiNzkxYzQ3MDMwMDAwMDEifSwiX3ByZXMiOnsic2F2ZSI6W251bGwsbnVsbCxudWxsLG51bGxdfSwiX3Bvc3RzIjp7InNhdmUiOltdfSwiaWF0IjoxNDc5ODU3NDg1LCJleHAiOjE0Nzk5NDM4ODV9.ot9DWV9dXOgPi_2C5QH33GYeknCZemVc63pMNcEUiTU"
  }
  ```

4) /me

  - metodo: **GET**
  - descripción: Obtiene informacion de un usuario a partir de un token
  - autentificación: Si.

**Parametros:** Empty

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta entrega       |
| message       | String         |  mensaje con la Informacion que fue creado con exitosamente |
| _id       | String         |  Id del usuairo recientemente creado |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| TokenExpired        |  Token con tiempo expirado       |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
    {
      "admin": true,
      "networks": [
        "582a5a0e23411f5436000001"
      ],
      "__v": 0,
      "password": "$2a$10$PIJPgltaCQYqvua5PyYvTeMzGWcXZdYIHvWNfTFKeUydDtcNwO.CO",
      "username": "admin",
      "_id": "582cdb523b791c4703000001"
    }
  }
  ```

5) /users

  - metodo: **GET**
  - descripción: Obtiene la lista de usuarios del sistema
  - autentificación: Si.

**Parametros:** Empty

**Success:** 200 - Arreglo de objetos con los usuarios del sistema. Cada objeto consta de

 |Campo |Tipo |Descripcion |
 |---  |---  |---  |
 | \_id |  String | Id del usuario. |
 | username | String | Nombre de usuario. |
 | password | String | Password del usuario |
 | networks  | Object[] | Array de Objetos a las cuales el usuario tiene acceso. |
 | admin  | Boolean | True o False si el usuario es admin |
 | \__v  | Integer | versionKey de Mongo |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElUsuarioExiste        |  El usuario ya existe en el sistema       |
| NoParametros        |  No se entregaron parametos para crear el usuario |
  - Ejemplo(Respuesta): Objeto.
  ```
  [
    {
      "_id": "5834d612c817b66367000001",
      "username": "clienteaaassaddsa",
      "password": "$2a$10$vrTaVUAbv0CwdJINjvcTSefAwhfSqeh2OytLNRZSBGkSkm06oLngC",
      "__v": 0,
      "networks": [],
      "admin": false
    },
    {
      "_id": "5834d65222afdfa367000001",
      "username": "clienteaaassaddsaaads",
      "password": "$2a$10$ZKYMXvJFZLgZKIOU16k53.9XUNwOtuuVNfN.QqsgvzBdKY74QpBBG",
      "__v": 0,
      "networks": [],
      "admin": false
    }
  ]
  ```

6) /users/:user_id

- metodo:  **GET**
- descripción: Obtiene informacion de un usuario a partir de su id
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| \_id |  String | Id del usuario. |
| username | String | Nombre de usuario. |
| password | String | Password del usuario |
| networks  | Object[] | Array de Objetos a las cuales el usuario tiene acceso. |
| admin  | Boolean | True o False si el usuario es admin |
| \__v  | Integer | versionKey de Mongo |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElUsuarioExiste        |  El usuario ya existe en el sistema       |
| Prohibido        |  Ruta prohibida. Solo usuarios autenticados pueden ver esta informacion  |
  - Ejemplo(Respuesta): Objeto.
  ```
    {
      "_id": "5834d65222afdfa367000001",
      "username": "clienteaaassaddsaaads",
      "password": "$2a$10$ZKYMXvJFZLgZKIOU16k53.9XUNwOtuuVNfN.QqsgvzBdKY74QpBBG",
      "__v": 0,
      "networks": [],
      "admin": false
    }
  ```

- metodo:  **PUT**
- descripción: Actualiza la informacion de un usuario a partir de su id
- autentificación: Si.

**Parametros:**

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| username | String | Nombre de usuario. |
| password | String | Password del usuario |
| networks  | Object[] | Array de Objetos a las cuales el usuario tiene acceso. |
| admin  | Boolean | True o False si el usuario es admin |

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta entrega       |
| message       | String         |  mensaje con la Informacion que fue creado con exitosamente |
| _id       | String         |  Id del usuairo recientemente creado |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElUsuarioNoExiste        |  El usuario no existe en el sistema       |
| ElUsuarioExiste        |  El usuario ya existe en el sistema       |
| NoParametros        |  No se entregaron parametos para actulizar al usuario |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
    "success": true,
    "message": "Usuario actualizado correctamente.",
  }
  ```

3.  metodo:  **DELETE**
  - descripción: Elimina un usuario a partir de su id
  - autentificación: Si.

**Parametros:** Empty

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta entrega       |
| message       | String         |  mensaje con la Informacion que fue creado con exitosamente |
| _id       | String         |  Id del usuairo recientemente creado |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElUsuarioExiste        |  El usuario ya existe en el sistema       |
| NoParametros        |  No se entregaron parametos para crear el usuario |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
      "success": true,
      "message": "Usuario creado exitosamente.",
      "_id": "5834d612c817b66367000001"
  }
  ```


7. /motes/:user_id
1.  metodo:  **GET**
  - descripción: Obtiene informacion de un usuario a partir de su id
  - recursos: user_id
  - autentificación: Si.
  - reponses: Objeto
    - Success:  Objetos con la informacion del usuario
      <!-- ```
      {
         "_id": "ID",
         "username": "USERNAME",
         "password": "PASSWORD STRING",
         "__v": 0,
         "networks": [             {
             "_id": "582a5a0e23411f5436000001",
             "name": "Casa",
             "address": "Nataniel",
             "panid": "ce-fa",
             "__v": 0,
             "motes": [
               "581e0fea106ee44b46000001",
               "581e11786f7ed8f749000001",
               "581e125da6447f544a000001",
               "58112cd0868570e478000001"
             ]
           }
      ``` -->
    - Error:
      ```
        {
          "success": false,
          "message": "Mensaje de Error"
        }
      ```
2.  metodo:  **PUT**
  - descripción: Actualiza la informacion de un usuario de su id
  - recursos: Objeto con la informacion a actualizar
  - autentificación: Si.
  - salidas: Objeto
    - Success:
      ```
      {
        "success": true,
        "message": "Usuario actualizado"
      }
      ```
    - Error:
      ```
        {
          "success": false,
          "message": "Mensaje de Error"
        }
      ```
3.  metodo:  **DELETE**
  - descripción: Elimina un usuario a partir de su id
  - recursos: user_id
  - autentificación: Si.
  - salidas: Objeto
    - Success:
      ```
      {
        "success": true,
        "message": "Usuario eliminado"
      }
      ```
    - Error:
      ```
        {
          "success": false,
          "message": "Mensaje de Error"
        }
      ```
