# PetCare — Management System

**Better care. Happier pets.**
A small, full-stack pet-care product: register, log in, manage your pets and
their health records. Built as a college-level full-stack project, but designed
to feel like a real product.

---

## Quick start

Requires **Node 18+**.

```bash
# 1. install dependencies (two separate packages)
npm --prefix backend install
npm --prefix frontend install

# 2. start the backend  → http://localhost:4000
npm run dev:backend

# 3. start the frontend → http://localhost:3000 (proxies /api to :4000)
npm run dev:frontend
```

Or use the root shortcuts:

```bash
npm run install:all
npm run dev:backend      # in one terminal
npm run dev:frontend     # in another
```

### Demo data (optional)

```bash
npm run seed             # resets backend/data/ to a fresh demo state
```

Creates **demo@petcare.dev** / **demo-petcare** with Bruno (Golden Retriever),
Luna (Persian), Coco (Tabby) and Nibbles (Hamster) plus realistic health
records. Use it for screenshots and demos; the smoke test or manual sign-up
can create other accounts.

### Verification

```bash
npm run smoke-test       # 34 end-to-end API checks (backend must be running)
```

---

## What the product does

```
Landing  →  Register / Login  →  Protected Dashboard
                                    ├─ pets at a glance (image cards)
                                    ├─ next upcoming care
                                    ├─ My Pets — full CRUD
                                    ├─ Pet detail — profile + health timeline
                                    ├─ Health Records — timeline across all pets
                                    └─ Profile — account summary, logout
```

* **Pets** — add, view, edit, remove; each pet has name, species, breed, date
  of birth, gender, weight, notes and an optional photo — **upload one from
  your device or paste a URL** (a warm branded monogram fallback is used when
  there is none).
* **Health records** — per-pet timeline of vaccinations, checkups, medications,
  treatments and other notes, with title, date, clinic and description.
* **Ownership** — every request is checked against the logged-in user;
  users can never see or modify another user's pets or records.

---

## Architecture

Strict frontend/backend separation (see `architecture.md`):

```
petcare/
├── frontend/                      # React + Vite, presentation only
│   ├── public/images/pets/sample/ # local CC-licensed photos + CREDITS.txt
│   └── src/
│       ├── api/                   # fetch client (single place for HTTP)
│       ├── services/              # auth / pets / health API services
│       ├── context/               # client-side auth state
│       ├── components/            # reusable UI (cards, modals, forms, nav…)
│       ├── pages/                 # Landing, Login, Register, Dashboard,
│       │                          # Pets, PetDetail, PetFormPage, Health, Profile
│       ├── utils/                 # presentation formatting
│       └── styles/                # design tokens + CSS (no UI framework)
│
└── backend/                       # Node.js + Express, the authority
    ├── server.js                  # entry point only — wiring, no logic
    ├── routes/                    # auth / pets / health endpoints
    ├── controllers/               # HTTP concerns
    ├── services/                  # business logic + ownership rules
    ├── middleware/                # JWT cookie auth, error handling
    ├── storage/                   # THE ONLY module touching JSON files
    ├── utils/                     # HttpError, validation
    ├── scripts/                   # smoke-test.js, seed.js
    └── data/                      # users.json · pets.json · health-records.json
```

Request lifecycle:

```
Browser → Express route → auth middleware → controller → service
        → storage → JSON files → response → UI
```

### API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account (validates, hashes password, sets cookie) |
| POST | `/api/auth/login` | – | Verify credentials, set cookie |
| POST | `/api/auth/logout` | ✓ | Clear the auth cookie |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/pets` | ✓ | List the user's pets (with `healthRecordCount`, `nextCare`, `lastCare`) |
| POST | `/api/pets` | ✓ | Add pet |
| GET | `/api/pets/:id` | ✓ | Pet detail (ownership enforced) |
| PUT | `/api/pets/:id` | ✓ | Update pet (ownership enforced) |
| DELETE | `/api/pets/:id` | ✓ | Remove pet + cascade its records (ownership enforced) |
| GET | `/api/pets/:petId/health-records` | ✓ | Records for a pet (ownership enforced) |
| POST | `/api/pets/:petId/health-records` | ✓ | Add record (ownership enforced) |
| GET | `/api/health-records` | ✓ | All the user's records, newest first, joined with pet |
| PUT | `/api/health-records/:id` | ✓ | Update record (ownership via parent pet) |
| DELETE | `/api/health-records/:id` | ✓ | Delete record (ownership via parent pet) |
| POST | `/api/uploads` | ✓ | Upload a pet photo (multipart `photo` field; JPG/PNG/WebP/GIF ≤ 5 MB) → `{ path }` |
| GET | `/api/uploads/:owner/:file` | ✓ | Serve an uploaded photo (owner-only) |
| GET | `/api/health` | – | Liveness probe |

Responses are consistent: `{ "success": true, "data": … }` or
`{ "success": false, "message": "…", "errors": { field: message } }`.

### Security

* Passwords hashed with **bcrypt** (10 rounds) — never stored in plain text.
* **HttpOnly** session cookie (`SameSite=Lax`, 7 days) signed as a JWT;
  the browser sends it automatically and JavaScript cannot read it.
* Login errors never reveal whether an email exists.
* Foreign resources are indistinguishable from missing ones (both → 404).
* Configuration lives in `backend/.env` (`PORT`, `JWT_SECRET`,
  `JWT_EXPIRES_IN`) — see `backend/.env.example`. `.env` is gitignored.

### Data persistence

`backend/data/*.json` survives restarts (verified in the smoke workflow).
The storage layer is the single seam — swapping JSON for a database later
would not touch controllers or services. Uploaded photos live in
`backend/data/uploads/<userId>/` (also gitignored); the image file is deleted
when its pet is removed or its photo is replaced.

---

## Design

The UI follows the **Warm Editorial Companion** direction (`design.md`):
warm ivory foundation, moss/clay accents, Manrope for UI with a serif for
editorial moments, real pet photography, soft geometry, restrained motion.
Design tokens live in `frontend/src/styles/tokens.css`.

---

## Demonstration script

1. Open the landing page → *Get Started*.
2. Register a new account (try a short password to see validation).
3. Land on the empty dashboard → *Add Your First Pet*.
4. Add Bruno, open his profile, add a *Rabies Vaccination* record dated soon.
5. Edit the pet (change weight), edit the record, delete a record.
6. Log out → try opening `http://localhost:3000/app` → redirected to login.
7. Restart the backend and log in again — data is still there.
8. (Optional) run `npm run smoke-test` to show the 34 automated checks,
   including one user failing to access another user's pet.

---

## Notes

* Sample photos are locally committed (Wikimedia Commons, CC-licensed — see
  `frontend/public/images/pets/sample/CREDITS.txt`). The app works fully
  offline except for optional web fonts (system fallbacks are configured).
* The frontend never reads `backend/data/` — all access goes through the API.


