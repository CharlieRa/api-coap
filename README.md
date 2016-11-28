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
<!-- *********************************************** -->
<!-- Documentacion de rutas de registro de usuarios  -->
<!-- *********************************************** -->
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
  <!-- *************************************** -->
  <!-- Documentacion de rutas de autenticacion -->
  <!-- *************************************** -->
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

<!-- ******************************************* -->
<!-- Documentacion de rutas para Usuario logeado -->
<!-- ******************************************* -->
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

  <!-- ************************************ -->
  <!-- Documentacion de rutas para Usuarios -->
  <!-- ************************************ -->
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
| ErrorDeAcceso        |  no tienes los permisos necesarios para acceder a este recurso       |
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

- metodo:  **DELETE**
- descripción: Elimina un usuario a partir de su id
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | Boolean         | bool de correcta entrega       |
| message       | String         |  mensaje de eliminado correctamente |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElIdUsuarioExiste        |  El id proporniconado no existe en el sistema       |
- Ejemplo(Respuesta): Objeto.
```
{
  "success": true,
  "message": "Usuario eliminado.",
}
```

<!-- ************************************ -->
<!-- Documentacion de rutas para Netwroks -->
<!-- ************************************ -->
7) /networks

- método: **GET**
- descripción: Obtiene la lista de redes en el sistema
- autentificación: Si.

**Parametros:** Empty

**Success:** 200 - Arreglo de objetos con las redes del sistema. Cada objeto consta de

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| \_id |  String | Id del usuario. |
| name | String | Nombre de la red. |
| address | String | Direccion fisica de su ubicacion |
| panid  | String | Identificador de la red. |
| motes  | Object[] | Array de Objetos de motes de la red. |
| \__v  | Integer | versionKey de Mongo |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ErrorDeAcceso        |  no tienes los permisos necesarios para acceder a este recurso       |
  - Ejemplo(Respuesta): Objeto.
  ```
  [
    {
      "_id": "582a5a0e23411f5436000001",
      "name": "Casa",
      "address": "Nataniel",
      "panid": "ce-fa",
      "__v": 0,
      "motes": []
    }
  ]
  ```

- método: **POST**
- descripción: Crea un nuevo recurso de red en el sistema
- autentificación: Si.

**Parametros:**

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| name | String | Nombre de la red. |
| address | String | Direccion fisica de su ubicacion |
| panid  | String | Identificador de la red. |
| motes  | Object[] | Array de Objetos de motes de la red. |

**Success:** 201

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta entrega       |
| message       | String         |  mensaje con la informacion que fue creado con exito |
| _id       | String         |  Id de la red recientemente creada |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ErrorDeAcceso        |  no tienes los permisos necesarios para acceder a este recurso       |
- Ejemplo(Respuesta): Objeto.
  ```
  {
    "success": true,
    "message": "Red creada exitosamente.",
    "_id": "5834d612c817b66367000001"
  }
  ```

8) /networks/:network_id

- metodo:  **GET**
- descripción: Obtiene informacion de una red  a partir de su id
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| name | String | Nombre de la red. |
| address | String | Direccion fisica de su ubicacion |
| panid  | String | Identificador de la red. |
| motes  | Object[] | Array de Objetos de motes de la red. |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ErrorDeAcceso        |  No tiene lo permisos para acceder a este recurso       |
- Ejemplo(Respuesta): Objeto.
  ```
  {
      "success": true,
      "message": "red creada exitosamente.",
      "_id": "5834d612c817b66367000001"
  }
  ```
- metodo:  **PUT**
- descripción: Actualiza la informacion de una red a partir de su id
- autentificación: Si.

**Parametros:**

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| name | String | Nombre de la red. |
| address | String | Direccion fisica de su ubicacion |
| panid  | String | Identificador de la red. |
| motes  | Object[] | Array de Objetos de motes de la red. |

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta operacion       |
| message       | String         |  mensaje con la Informacion que fue actualizada con exito |
| _id       | String         |  Id de la red recientemente actualizada |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| LaRedNoExiste   |  La red no existe en el sistema       |
| ErrorDeAcceso  |  No tiene lo permisos para acceder a este recurso       |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
    "success": true,
    "message": "Red actualizada correctamente.",
    _id: 58112cd0868570e478000001
  }
  ```

- metodo:  **DELETE**
- descripción: Elimina una red a partir de su id
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | Boolean         | bool de correcta operacion       |
| message       | String         |  mensaje de error/eliminado correctamente |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElIdRedNoExiste        |  El id proporcionado no existe en el sistema       |
- Ejemplo(Respuesta): Objeto.
```
{
  "success": true,
  "message": "Red eliminada",
}
```

<!-- ************************************ -->
<!-- Documentacion de rutas para Motes -->
<!-- ************************************ -->
9) /motes

  - metodo: **GET**
  - descripción: Obtiene la lista de motes del sistema
  - autentificación: Si.

**Parametros:** Empty

**Success:** 200 - Arreglo de objetos con los motes del sistema. Cada objeto consta de

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| \_id |  String | Id del usuario. |
| ipv6 | String | IPv6 del mote. |
| dagroot | Boolean | True/False es DAGroot el mote |
| eui64  | String | Identificador EUI64 del mote. |
| panid  | String | Identificador de la red a la que pertenece el mote |
| mac  | String | Mac del mote |
| name  | String | Nombre del mote |
| \__v  | Integer | versionKey de Mongo |
| commands  | Object[] | Array de Objetos de comandos disponibles para el mote. |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ErrorDeAcceso        |  no tienes los permisos necesarios para acceder a este recurso       |
  - Ejemplo(Respuesta): Objeto.
  ```
    [
      {
        "_id": "58112cd0868570e478000001",
        "ipv6": "bbbb::12:4b00:3a5:6b3c",
        "dagroot": true,
        "eui64": "00-12-4b-00-03-a5-6b-3c",
        "panid": "ca-fe",
        "mac": "00:12:4b:00:03:a5:6b:3c",
        "name": "cocina",
        "__v": 0,
        "commands": []
      },
      {
        "_id": "581e0fea106ee44b46000001",
        "ipv6": "bbbb::1415:92cc:0:1",
        "dagroot": false,
        "eui64": "14-15-92-cc-00-00-00-01",
        "panid": "ca-fe",
        "mac": "14:15:92:cc:00:00:00:01",
        "name": "emulated1",
        "__v": 0,
        "commands": []
      }
    ]
  ```

10) /motes/:mote_ip

- metodo:  **GET**
- descripción: Obtiene informacion de un mote a partir de su ipv6
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| \_id |  String | Id del usuario. |
| ipv6 | String | IPv6 del mote. |
| dagroot | Boolean | True/False es DAGroot el mote |
| eui64  | String | Identificador EUI64 del mote. |
| panid  | String | Identificador de la red a la que pertenece el mote |
| mac  | String | Mac del mote |
| name  | String | Nombre del mote |
| \__v  | Integer | versionKey de Mongo |
| commands  | Object[] | Array de Objetos de comandos disponibles para el mote. |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ErrorDeAcceso        |  No tiene lo permisos para acceder a este recurso       |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
    "_id": "58112cd0868570e478000001",
    "ipv6": "bbbb::12:4b00:3a5:6b3c",
    "dagroot": true,
    "eui64": "00-12-4b-00-03-a5-6b-3c",
    "panid": "ca-fe",
    "mac": "00:12:4b:00:03:a5:6b:3c",
    "name": "cocina",
    "__v": 0,
    "commands": []
  }
  ```

- metodo:  **PUT**
- descripción: Actualiza la informacion de un mote a partir de su ipv6
- autentificación: Si.

**Parametros:**

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| ipv6 | String | IPv6 del mote. |
| dagroot | Boolean | True/False es DAGroot el mote |
| eui64  | String | Identificador EUI64 del mote. |
| panid  | String | Identificador de la red a la que pertenece el mote |
| mac  | String | Mac del mote |
| name  | String | Nombre del mote |
| commands  | Object[] | Array de Objetos de comandos disponibles para el mote. |

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta entrega       |
| message       | String         |  mensaje con la Informacion que fue creado con exitosamente |
| _id       | String         |  Id del usuairo recientemente actualizado |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElMoteExiste   |  El mote no existe en el sistema       |
| ErrorDeAcceso  |  No tiene lo permisos para acceder a este recurso       |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
    "success": true,
    "message": "Mote actualizado correctamente.",
    _id: 58112cd0868570e478000001
  }
  ```

- metodo:  **DELETE**
- descripción: Elimina un usuario a partir de su id
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | Boolean         | bool de correcta entrega       |
| message       | String         |  mensaje de eliminado correctamente |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElIpMoteNoExiste        |  El id proporcionado no existe en el sistema       |
- Ejemplo(Respuesta): Objeto.
```
{
  "success": true,
  "message": "Mote eliminado.",
}
```

<!-- ********************************************* -->
<!-- Documentacion de rutas para Comandos de Motes -->
<!-- ********************************************* -->

11) /motes/mote_ip/commands/

- metodo: **GET**
- descripción: Obtiene una lista comandos disponibles para el mote de ip ***mote_ip***,  obtenida utilizando CoAP con el comando ***well-known/core***
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| mote      | String | IPv6 del mote. |
| query     | String | String del comanod ejecutado. |
| response  | String | Respuesta del comando ejecutado |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| Timeout        |  La red es alcanzable pero el Mote no responde       |
| EnetUnReach        |  la red es inalcanzable       |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
    "mote": "bbbb::1415:92cc:0:2",
    "query": ".well-known/core",
    "response": [
      "</rt>",
      "</storm>",
      "</l>",
      "</i>",
      "</6t>"
    ]
  }
  ```

12) /motes/mote_ip/commands/:command

- metodo: **GET**
- descripción: Obtiene una respuesta a traves de CoAP del comando ejecutado ***command*** en el mote de ip ***mote_ip***.
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| mote      | String | IPv6 del mote. |
| query     | String | String del comanod ejecutado. |
| response  | String | Respuesta del comando ejecutado |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| Timeout        |  La red es alcanzable pero el Mote no responde       |
| EnetUnReach        |  la red es inalcanzable       |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
    "mote": "bbbb::1415:92cc:0:2",
    "query": "i",
    "response": [
      "OpenWSN 1.9.0\nPython\nPython\nPython"
    ]
  }
  ```

- metodo:  **PUT**
- descripción: Actualiza la informacion de un mote a partir de su ipv6
- autentificación: Si.

**Parametros:**

|Campo |Tipo |Descripcion |
|---  |---  |---  |
| ipv6 | String | IPv6 del mote. |
| dagroot | Boolean | True/False es DAGroot el mote |
| eui64  | String | Identificador EUI64 del mote. |
| panid  | String | Identificador de la red a la que pertenece el mote |
| mac  | String | Mac del mote |
| name  | String | Nombre del mote |
| commands  | Object[] | Array de Objetos de comandos disponibles para el mote. |

**Success:** 200

| Campo          | Tipo           | Descripcion    |
| :------------- | :------------- | :------------- |
| success       | boolean         | bool de correcta entrega       |
| message       | String         |  mensaje con la Informacion que fue creado con exitosamente |
| _id       | String         |  Id del usuairo recientemente actualizado |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ElMoteExiste   |  El mote no existe en el sistema       |
| ErrorDeAcceso  |  No tiene lo permisos para acceder a este recurso       |
  - Ejemplo(Respuesta): Objeto.
  ```
  {
    "success": true,
    "message": "Mote actualizado correctamente.",
    _id: 58112cd0868570e478000001
  }
  ```



<!-- ********************************************************* -->
<!-- Documentacion de rutas para captura de paquetes en la red -->
<!-- ********************************************************* -->

13) /packets

- metodo: **GET**
- descripción: Obtiene un Array de objetso de paquetes captuarados en la red de Motes
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

 |Campo |Tipo |Descripcion |
 |---  |---  |---  |
 | \_id |  String | Id del packete. |
 | src_port | Int | Numero del puerto UDP por el cual el paquete sale. |
 | dst_port | Int | Numero del puerto UDP por el cual el paquete entra. |
 | local_ipv6_src | String | IPv6 local de fuente del paquete  |
 | local_ipv6_dst | String | IPv6 local de destino del paquete  |
 | ipv6_src | String | IPv6 de fuente del paquete  |
 | ipv6_dst | String | IPv6 de destino del paquete  |
 | layers  | Object[] | Array de capas del paquete |
 | panid | String | Identificar de la red  |
 | highest_layer | String | Capa de mas arriba del paquete  |

**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| Timeout        |  La red es alcanzable pero el Mote no responde       |
| EnetUnReach        |  la red es inalcanzable       |
- Ejemplo(Respuesta): Objeto.
  ```
  [
    {
      "_id": "583146306bb048719d097c4e",
      "src_port": 0,
      "coap_code": null,
      "local_ipv6_dst": "ff02::1a",
      "ipv6_dst": "bbbb::1",
      "local_ipv6_src": "fe80::1615:92cc:0:3",
      "highest_layer": "icmpv6",
      "dst_port": 17754,
      "ipv6_src": "bbbb::1",
      "panid": "ca-fe",
      "layers": [
        "raw",
        "ipv6",
        "udp",
        "zep",
        "wpan",
        "data",
        "6lowpan",
        "ipv6",
        "icmpv6"
      ]
    }
  ]
  ```

14) /packets/start

- metodo: **GET**
- descripción: Inicia la captura de paquetes de la red
- autentificación: Si.

**Parametros:** Empty

**Success:** 200

 |Campo |Tipo |Descripcion |
 |---  |---  |---  |
 | success | Boolean | Boolean de exito en el comienzo del script |
 | message | String | Mensaje de informacion. |


**Error:** 4xx

| Campo          | Descripcion    |
| :------------- | :------------- |
| ErrorDeAcceso        |  no tienes los permisos necesarios para acceder a este recurso       |
| ErrorAlEjecutarScript | Error al ejecutar el script       |
- Ejemplo(Respuesta): Objeto.
  ```
    {
      "success": true,
      "msg": "Script capturando datos."
    }
  ```
