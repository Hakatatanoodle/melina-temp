# PetCare Management System Architecture

## 1. Architecture Overview

PetCare will use a clean two-part application structure:

```text
petcare/
│
├── frontend/
│   └── ...
│
└── backend/
    └── ...
```

The frontend and backend are intentionally separated into different top-level folders.

The frontend is responsible for the user interface and user interaction.

The backend is responsible for the server, authentication, business logic, API endpoints, authorization, and data persistence.

The frontend communicates with the backend through HTTP API requests.

---

## 2. High-Level System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               v
                    ┌─────────────────────┐
                    │      Frontend       │
                    │  UI / Components    │
                    │  Pages / Forms      │
                    └──────────┬──────────┘
                               │
                         HTTP / JSON
                               │
                               v
                    ┌─────────────────────┐
                    │       Backend       │
                    │   Node.js Server    │
                    │      / Express      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              v                v                v
        ┌───────────┐    ┌────────────┐   ┌────────────┐
        │   Auth    │    │   Pet API  │   │ Health API │
        └─────┬─────┘    └──────┬─────┘   └──────┬─────┘
              │                 │                 │
              └─────────────────┼─────────────────┘
                                v
                       ┌──────────────────┐
                       │ Storage Service  │
                       └────────┬─────────┘
                                │
                                v
                       ┌──────────────────┐
                       │   JSON Files     │
                       │ users.json       │
                       │ pets.json        │
                       │ health-records   │
                       └──────────────────┘
```

---

## 3. Recommended Project Structure

The project should use a clear frontend/backend separation.

```text
petcare/
│
├── frontend/
│   ├── public/
│   │   └── ...
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── App.*
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── data/
│   │   ├── users.json
│   │   ├── pets.json
│   │   └── health-records.json
│   │
│   ├── routes/
│   │   ├── auth.routes.*
│   │   ├── pets.routes.*
│   │   └── health.routes.*
│   │
│   ├── controllers/
│   │   ├── auth.controller.*
│   │   ├── pets.controller.*
│   │   └── health.controller.*
│   │
│   ├── services/
│   │   ├── auth.service.*
│   │   ├── pets.service.*
│   │   └── health.service.*
│   │
│   ├── middleware/
│   │   └── auth.middleware.*
│   │
│   ├── storage/
│   │   └── json-storage.*
│   │
│   ├── utils/
│   │   └── ...
│   │
│   ├── server.*
│   └── package.json
│
├── README.md
└── .gitignore
```

The exact file extensions depend on whether the project uses JavaScript or TypeScript. The architecture itself should remain conceptually the same.

---

## 4. Frontend Responsibilities

The frontend owns everything related to presentation and user interaction.

### Frontend responsibilities

- Render pages
- Render reusable components
- Handle form input
- Perform client-side validation
- Display loading states
- Display success/error messages
- Send requests to backend APIs
- Store appropriate client-side authentication state
- Protect frontend routes from unauthenticated access
- Display data returned by the backend

### Frontend should NOT own

- Password verification
- Password hashing
- Direct access to JSON files
- Direct file-system operations
- Authorization decisions
- User ownership checks

The frontend asks the backend for data. It does not decide what the user is allowed to access.

---

## 5. Backend Responsibilities

The backend is the trusted application layer.

It owns:

- HTTP server
- API routes
- Request validation
- Authentication
- Password hashing
- Authentication/session or token handling
- Authorization
- Business rules
- User ownership checks
- Reading/writing persistent data
- Consistent API responses
- Server-side error handling

The backend is the only part of the application that should directly interact with the JSON data files.

---

## 6. API Layer

The frontend should communicate with the backend through REST-style HTTP endpoints.

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Pets

```text
GET    /api/pets
GET    /api/pets/:id
POST   /api/pets
PUT    /api/pets/:id
DELETE /api/pets/:id
```

### Health Records

```text
GET    /api/pets/:petId/health-records
POST   /api/pets/:petId/health-records
PUT    /api/health-records/:id
DELETE /api/health-records/:id
```

These endpoints may evolve during implementation, but their responsibilities should remain clearly separated.

---

## 7. Request Flow

### Example: Add Pet

```text
User fills Add Pet form
        |
        v
Frontend validates basic input
        |
        v
POST /api/pets
        |
        v
Backend authentication middleware
        |
        v
Verify authenticated user
        |
        v
Pet controller
        |
        v
Pet service
        |
        v
JSON storage service
        |
        v
pets.json updated
        |
        v
Backend returns response
        |
        v
Frontend updates dashboard
```

The browser never directly edits `pets.json`.

---

## 8. Authentication Architecture

Firebase Authentication will **not** be used for the core project.

Authentication will be handled by the project's own Node.js backend.

### Registration

```text
Frontend
   |
   | POST /api/auth/register
   v
Backend
   |
   | validate input
   | check duplicate email
   | hash password
   v
users.json
```

### Login

```text
Frontend
   |
   | POST /api/auth/login
   v
Backend
   |
   | locate user
   | verify password hash
   | create authenticated session/token
   v
Frontend receives authentication result
```

### Protected request

```text
Frontend
   |
   | authenticated request
   v
Backend auth middleware
   |
   | verify identity
   v
Controller
   |
   | check resource ownership
   v
Service
   |
   v
Data storage
```

The important security principle is:

> **Authentication answers "Who are you?"**
>
> **Authorization answers "Are you allowed to do this?"**

Both are required.

---

## 9. Password Storage

Passwords must never be stored directly in `users.json`.

Instead:

```text
Plain password
      |
      v
Password hashing library
      |
      v
Password hash
      |
      v
users.json
```

At login, the backend compares the supplied password with the stored password hash.

The frontend must never perform password hashing as a substitute for backend verification.

---

## 10. Storage Layer

JSON files are being used because the project is a college application and the requirement explicitly allows backend JSON persistence.

However, the application should not scatter file-system code throughout the backend.

Instead, a dedicated storage module should expose operations such as:

```text
readUsers()
writeUsers()
findUserByEmail()
findPetById()
createPet()
updatePet()
deletePet()
```

The service layer should use the storage layer instead of manipulating files directly.

This gives the project a clean abstraction:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Storage
  ↓
JSON files
```

Later, a database could replace JSON storage with much less architectural disruption.

---

## 11. Controller / Service / Storage Separation

The backend should avoid putting all logic inside `server.js`.

### `server.js`

Responsible mainly for:

- Creating the server
- Configuring middleware
- Mounting routes
- Starting the application

### Routes

Define API endpoints and connect them to controllers.

### Controllers

Handle HTTP-specific concerns:

- Read request data
- Read authenticated user
- Call appropriate service
- Return HTTP response

### Services

Contain business logic:

- Register user
- Authenticate user
- Create pet
- Update pet
- Check ownership
- Create health record

### Storage

Handles actual JSON file operations.

This separation keeps each part understandable and testable.

---

## 12. Authorization and Ownership

A user must never be able to access another user's pets simply by changing an ID in the URL.

For example, this request:

```text
GET /api/pets/pet-123
```

must not be treated as permission to access `pet-123` automatically.

The backend should verify:

```text
loggedInUser.id === pet.ownerId
```

before returning or modifying the record.

The same principle applies to health records through their parent pet.

---

## 13. Error Handling

The backend should use consistent error responses.

Examples:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

or:

```json
{
  "success": false,
  "message": "Pet not found"
}
```

The frontend should convert these responses into understandable user-facing messages.

---

## 14. Environment and Secrets

Sensitive configuration should not be hard-coded.

For example:

```text
backend/
└── .env
```

Possible environment variables:

```text
PORT=...
SESSION_SECRET=...
```

The actual `.env` file must be excluded from Git using `.gitignore`.

For a classroom project, the configuration should remain simple.

---

## 15. Separation of Package Management

Because frontend and backend are separate applications, they may maintain separate `package.json` files.

```text
petcare/
├── frontend/
│   └── package.json
│
└── backend/
    └── package.json
```

This keeps frontend dependencies and backend dependencies isolated.

A root-level script or README instructions may later be added to make running both applications convenient.

---

## 16. Development and Runtime Model

During development, the application may run as:

```text
Frontend dev server
        |
        | HTTP API requests
        v
Node.js backend server
        |
        v
JSON data files
```

In a final demonstration, the project should have a clearly documented way to start the backend and frontend.

If desired, the production build can later serve the frontend from the backend, but that is an implementation detail rather than a core architectural requirement.

---

## 17. Technology Decisions

### Frontend

Recommended:

- React or another modern frontend framework already chosen for the project
- CSS or a component/styling system suitable for the desired UI

### Backend

- Node.js
- Express

### Storage

- JSON files
- Node.js filesystem APIs through the dedicated storage layer

### Authentication

- Custom backend authentication
- Password hashing
- Session-based or token-based authentication depending on implementation choice

### Version control

- Git
- GitHub

The architecture intentionally avoids introducing Firebase as the primary authentication backend because the project requirement is to demonstrate its own Node.js backend and backend-managed data.

---

## 18. What `userdata.json` Means in the Final Architecture

The client's original request mentioned `userdata.json`.

The final architecture should interpret this as **backend persistent user data**, not as a file that the frontend manipulates.

The backend owns the file.

Recommended structure:

```text
backend/
└── data/
    ├── users.json
    ├── pets.json
    └── health-records.json
```

Using separate files is cleaner than putting unrelated users, pets, and health records into one large object.

If the client specifically requires a single `userdata.json`, the storage layer can support it without changing the frontend or API architecture. The default architecture, however, favors separation by entity.

---

## 19. Architecture Principles

### Principle 1: Frontend is presentation

The frontend displays and collects information.

### Principle 2: Backend is authority

The backend validates identity, permissions, and data changes.

### Principle 3: Routes are interfaces

API endpoints define how the frontend communicates with the backend.

### Principle 4: Services contain business logic

Business rules should not be buried inside route handlers or UI components.

### Principle 5: Storage is isolated

Only the storage layer directly manipulates JSON files.

### Principle 6: Keep architecture proportional

The project should be structured, not unnecessarily complicated.

### Principle 7: Design for replacement

JSON storage should be replaceable by a real database later without rebuilding the entire application.

---

## 20. Architecture Success Criteria

The architecture is considered successful when:

- Frontend and backend are clearly separated into top-level folders.
- The frontend never directly accesses JSON files.
- The backend owns authentication and authorization.
- Passwords are securely hashed before storage.
- API routes are separated by feature.
- Business logic is separated from raw file operations.
- User ownership is verified before protected resource access.
- Data survives server restarts.
- `server.js` remains an application entry point rather than a giant monolithic file.
- The structure can later migrate from JSON storage to a database.

---

## 21. Final Architecture Summary

```text
petcare/
│
├── frontend/                    # Presentation layer
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/            # API client
│   │   ├── hooks/
│   │   └── styles/
│   └── package.json
│
├── backend/                     # Application/backend layer
│   ├── routes/                   # HTTP endpoints
│   ├── controllers/              # HTTP handling
│   ├── services/                 # Business logic
│   ├── middleware/               # Authentication/authorization
│   ├── storage/                  # JSON persistence abstraction
│   ├── data/                     # Actual JSON files
│   ├── utils/
│   ├── server.*                  # Server entry point
│   └── package.json
│
├── README.md
└── .gitignore
```

### Request lifecycle

```text
Browser
  ↓
Frontend UI
  ↓
API request
  ↓
Backend route
  ↓
Authentication middleware
  ↓
Controller
  ↓
Service / business logic
  ↓
Storage layer
  ↓
JSON data
  ↓
Response
  ↓
Frontend UI
```

> **The architecture should make the project easy to understand, easy to demo, and easy to replace piece-by-piece later.**
