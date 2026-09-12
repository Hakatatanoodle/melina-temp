# PetCare Management System

## 1. Product Overview

**Product name:** PetCare Management System

**Product type:** Web-based pet care and pet record management application

**Purpose:**
PetCare is a small web application that allows a user to create an account, log in securely, and manage information about their pets and their basic health/care records.

The project is designed as a college-level full-stack application that demonstrates:

- User registration and authentication
- Backend data persistence
- Dashboard-based application design
- CRUD operations
- Client/server communication
- Clean frontend and backend separation

The goal is not to build a massive veterinary platform. The goal is to build a **complete, coherent, polished application** where every technical feature has a visible product purpose.

---

## 2. Product Concept

The application represents a simple pet-care management tool for pet owners.

A user can:

1. Register an account.
2. Log in to the application.
3. Reach a personalized dashboard.
4. Add their pets.
5. View pet information.
6. Edit pet information.
7. Delete pet records.
8. Add and manage basic health records for their pets.
9. Log out securely.

The application should feel like a small real product rather than a collection of disconnected college-assignment pages.

---

## 3. Target User

### Primary user

A pet owner who wants a simple place to keep track of their pets and basic care information.

### Example user

A user may have:

- Bruno, a 3-year-old Golden Retriever
- Luna, a 2-year-old Persian cat

The dashboard should make it easy to see their pets and access their information without navigating through unnecessary complexity.

---

## 4. Core User Flow

```text
Landing Page
     |
     v
Register / Login
     |
     v
Authenticated Dashboard
     |
     +----> View Pets
     |
     +----> Add Pet
     |
     +----> Edit Pet
     |
     +----> Delete Pet
     |
     +----> View Health Records
     |
     +----> Add / Edit / Delete Health Records
     |
     v
Logout
```

### Registration flow

```text
User enters registration information
            |
            v
Frontend sends data to backend
            |
            v
Backend validates input
            |
            v
Password is securely hashed
            |
            v
User is stored in backend data storage
            |
            v
Registration succeeds
```

### Login flow

```text
User enters email + password
            |
            v
Frontend sends credentials to backend
            |
            v
Backend finds user
            |
            v
Backend verifies password hash
            |
            v
Authenticated session/token is created
            |
            v
User enters dashboard
```

---

## 5. Pages and Screens

### 5.1 Landing Page

Purpose:
Introduce the application and provide entry points to registration and login.

Suggested content:

- Product name and short tagline
- Brief explanation of the application
- Call to action
- Login button
- Register button

Example positioning:

> **Better care. Happier pets.**
> Keep your pets, health records, and care information organized in one place.

---

### 5.2 Registration Page

Required fields:

- Full name
- Email
- Password
- Confirm password

Requirements:

- Client-side validation for basic input errors
- Server-side validation
- Duplicate email prevention
- Password confirmation validation
- Clear success/error feedback

The password must never be stored as plain text.

---

### 5.3 Login Page

Required fields:

- Email
- Password

Requirements:

- Backend credential verification
- Clear invalid-login feedback
- Successful authentication redirects to dashboard
- Unauthenticated users should not access protected dashboard pages

---

### 5.4 Dashboard

The dashboard is the main application screen after login.

It should contain:

- User greeting
- Total number of pets
- Total number of health records
- Upcoming care/appointment information if implemented
- List/grid of the user's pets
- Quick action to add a pet
- Navigation to pet and health-record management

Example structure:

```text
--------------------------------------------------
PetCare                               Profile / Logout
--------------------------------------------------

Good morning, Alex 🐾

2 Pets       5 Health Records       1 Upcoming Event

My Pets
--------------------------------------------------

[ Bruno ]                         [ Luna ]
Dog · Golden Retriever             Cat · Persian
Age: 3 years                       Age: 2 years

[ View ] [ Edit ]                 [ View ] [ Edit ]

                 [ + Add Pet ]
--------------------------------------------------
```

The dashboard should expose the product's purpose instead of exposing raw CRUD terminology.

---

## 6. Pet Management

Pet management is the primary CRUD module.

### Pet data

Each pet should support at least:

- Unique ID
- Owner ID
- Name
- Species
- Breed
- Age or date of birth
- Gender
- Weight
- Basic notes

Optional polished fields:

- Profile image
- Color
- Medical status

### Create

User can add a new pet through a form.

### Read

User can view a list of pets and an individual pet's details.

### Update

User can edit existing pet information.

### Delete

User can delete a pet after confirmation.

### Ownership rule

A logged-in user may only access and modify pets that belong to that user.

---

## 7. Health Record Management

Health records provide a second meaningful CRUD feature.

A health record belongs to a specific pet.

Example record types:

- Vaccination
- General checkup
- Medication
- Treatment
- Other health note

Suggested fields:

- Record ID
- Pet ID
- Record type
- Title
- Date
- Description
- Optional veterinarian/clinic name

The user should be able to:

- Add a health record
- Read health records
- Edit a health record
- Delete a health record

---

## 8. Optional Enhancement Features

These features are **not required for the first version**. They may be added if time remains after the core product is stable.

### Priority enhancement features

- Upcoming vaccination reminders
- Appointment tracking
- Pet profile images
- Dashboard statistics
- Search/filter pets
- Responsive mobile layout
- Empty states and polished loading states
- Dark mode

### Important rule

Optional features must not destabilize the core application.

A smaller finished product is better than a large unfinished product.

---

## 9. Authentication and Data Requirements

The project will use a **custom backend authentication flow** rather than Firebase Authentication.

Registration credentials will be sent from the frontend to the Node.js backend.

The backend will:

- Validate registration data
- Hash passwords before storage
- Store user records in backend data storage
- Verify credentials during login
- Maintain authenticated access to protected application routes

### Important security rule

Passwords must not be stored in plain text in `users.json` or any other file.

---

## 10. Data Persistence

For this college project, JSON files will be used as simple persistent storage.

Planned data files include:

```text
data/
├── users.json
├── pets.json
└── health-records.json
```

This is intentionally simpler than using a production database.

The architecture should still isolate the storage logic so that the JSON layer could later be replaced by a real database without rewriting the entire application.

---

## 11. Product Quality Goals

The project should prioritize:

### Coherence

Every feature should have a clear purpose in the pet-care product.

### Usability

A first-time user should understand the main dashboard without being taught how to use it.

### Visual quality

The UI should look like a small modern web product, not a collection of default HTML forms.

### Technical correctness

Authentication, authorization, CRUD operations, API communication, and persistence must function correctly.

### Demonstrability

The student should be able to explain how the system works during a class presentation or viva.

### Maintainability

Frontend, backend, API logic, authentication, and data access should remain separated.

---

## 12. Scope Boundary

### Mandatory for Version 1

- Landing page
- Registration
- Login
- Logout
- Protected dashboard
- User-specific pet management
- Pet CRUD
- Health-record CRUD
- Backend persistence using JSON
- Node.js backend server
- Secure password hashing
- Proper frontend/backend communication

### Not part of the initial scope

- Online payments
- Real veterinary consultation
- Real-time chat
- Complex notification infrastructure
- Production-grade cloud database
- Multi-role hospital management
- Microservices architecture
- Advanced AI features

The project should remain proportional to a college project while still looking polished.

---

## 13. Demonstration Scenario

For the final demonstration, the application should be able to show a complete story:

```text
1. Register a new account
2. Show that the account is stored by the backend
3. Log in using the newly created account
4. Reach the personalized dashboard
5. Add a pet
6. View the pet
7. Edit the pet
8. Add a health record
9. Edit/delete the health record
10. Log out
11. Attempt to access the dashboard again and show that authentication is required
```

This sequence demonstrates the product and the technical requirements together.

---

## 14. Success Criteria

The project is considered successful when:

- A new user can register successfully.
- A registered user can log in successfully.
- User credentials are persisted by the backend.
- Passwords are not stored in plain text.
- Authenticated users can reach their dashboard.
- Users can perform complete CRUD operations on their own pets.
- Users can perform complete CRUD operations on health records.
- Data remains available after restarting the server.
- Users cannot access another user's pet records.
- The UI is visually polished and understandable.
- The student can explain the architecture, authentication flow, API routes, and data flow.

---

## 15. Product Principle

> **Don't build a CRUD demo disguised as pet care. Build a small pet-care product whose features happen to demonstrate CRUD.**

The implementation should always preserve this distinction.
