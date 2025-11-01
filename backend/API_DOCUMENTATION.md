# User API Documentation

## Overview
This document describes the User CRUD operations API for the Chatting App backend.

## Base URL
```
http://localhost:3000
```

## Swagger Documentation
Interactive API documentation is available at:
```
http://localhost:3000/api
```

## Endpoints

### 1. Create User
Creates a new user with hashed password.

**Endpoint:** `POST /user`

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "StrongP@ss123"
}
```

**Validation Rules:**
- `email`: Must be a valid email address, required
- `firstName`: String, 2-50 characters, required
- `lastName`: String, 2-50 characters, required
- `password`: Minimum 8 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

**Success Response (201 Created):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already exists

---

### 2. Get All Users
Retrieves a list of all users.

**Endpoint:** `GET /user`

**Success Response (200 OK):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

---

### 3. Get User by ID
Retrieves a single user by their UUID.

**Endpoint:** `GET /user/:id`

**Parameters:**
- `id` (path parameter): User UUID

**Success Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid UUID format
- `404 Not Found`: User not found

---

### 4. Update User
Updates an existing user. All fields are optional.

**Endpoint:** `PATCH /user/:id`

**Parameters:**
- `id` (path parameter): User UUID

**Request Body (all fields optional):**
```json
{
  "email": "newemail@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "NewStr0ng@Pass"
}
```

**Success Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "newemail@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data or UUID format
- `404 Not Found`: User not found
- `409 Conflict`: Email already exists (when updating email)

---

### 5. Delete User
Deletes a user by their UUID.

**Endpoint:** `DELETE /user/:id`

**Parameters:**
- `id` (path parameter): User UUID

**Success Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid UUID format
- `404 Not Found`: User not found

---

## Security Features

### Password Hashing
- All passwords are hashed using bcrypt with a salt round of 10
- Passwords are never returned in API responses
- Password hashing occurs automatically on create and update operations

### Email Uniqueness
- Email addresses must be unique across all users
- The database enforces this constraint
- Duplicate emails will result in a 409 Conflict error

### Input Validation
- All inputs are validated using class-validator decorators
- Whitelist: Only specified properties are allowed
- Non-whitelisted properties will cause a 400 error
- Automatic transformation of request bodies to DTOs

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Or for validation errors:

```json
{
  "statusCode": 400,
  "message": [
    "Email is required",
    "Please provide a valid email address"
  ],
  "error": "Bad Request"
}
```

---

## Testing with cURL

### Create a user:
```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "SecureP@ss123"
  }'
```

### Get all users:
```bash
curl http://localhost:3000/user
```

### Get a specific user:
```bash
curl http://localhost:3000/user/{user-id}
```

### Update a user:
```bash
curl -X PATCH http://localhost:3000/user/{user-id} \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated"
  }'
```

### Delete a user:
```bash
curl -X DELETE http://localhost:3000/user/{user-id}
```

---

## Notes

- All timestamps are in ISO 8601 format
- UUID validation is performed automatically on all ID parameters
- The API uses class-transformer to exclude sensitive data (passwords) from responses
- CORS is enabled for all origins in development
