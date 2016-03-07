# :moon: Lunar

## Users

### Create a user

_Creates a user record in the db._

```
POST /users
```

**Parameters**

| Name       | Type     | Description                 |
|:----------:|:--------:|:---------------------------:|
| `username` | `string` | **Required.** The username. |
| `email`    | `string` | **Required.** The email.    |
| `password` | `string` | **Required.** The password. |

**Example**

```json
{
  "username": "alexbooker",
  "email": "alexbooker@fastmail.im",
  "password": "Q35mBFGPYHIl9DMMcIt5"
}
```

**Response if request was successful:**

```
Status 201: Created
```

```json
{
  "message": "User created."
}
```

**Response if input validation failed:**

```
Status 400: Bad Request
```

```json
{
  "message": "Validation error",
  "errors": [
    {
      "path": "username",
      "message": "\"username\" is not allowed to be empty"
    },
    {
      "path": "password",
      "message": "\"password\" is not allowed to be empty"
    }
  ]
}
```
