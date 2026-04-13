# Xemelgo Dashboard

A full-stack item lifecycle management dashboard for tracking assets, inventory, and work orders across locations. Built with React, Node.js/Express, and PostgreSQL.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Architecture](#frontend-architecture)
- [Authentication Flow](#authentication-flow)
- [Features & Functionality](#features--functionality)
- [Known Issues & Limitations](#known-issues--limitations)
- [Demo Credentials](#demo-credentials)

---

## Overview

Xemelgo Dashboard lets warehouse/operations teams track items across three solution types:

| Solution Type | Actions Available         | Terminal State |
|---------------|---------------------------|----------------|
| Asset         | Move to, Missing          | missing        |
| Inventory     | Scanned at, Consumed      | consumed       |
| Work Order    | Received at, Complete     | complete       |

Each action is recorded under a selected user and optionally updates the item's current location. A full history of location changes and user actions is stored and displayed per item.

---

## Tech Stack

### Frontend (`client/`)
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI framework |
| React Router DOM | 7.14.0 | Client-side routing |
| Axios | 1.15.0 | HTTP client with JWT interceptor |
| Tailwind CSS | 4.2.2 | Utility-first styling |
| Vite | 8.0.4 | Build tool and dev server |

### Backend (`server/`)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js + Express | 5.2.1 | REST API server |
| PostgreSQL + pg | 8.20.0 | Relational database |
| bcryptjs | 3.0.3 | Password hashing |
| jsonwebtoken | 9.0.3 | JWT generation and verification |
| dotenv | 17.4.1 | Environment variable loading |
| nodemon | 3.1.14 | Dev server auto-restart |

---

## Project Structure

```
xemelgo-dashboard/
├── client/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios instance — base URL + JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state (token + user)
│   │   ├── components/
│   │   │   ├── ActionHistoryTable.jsx   # Table of past actions per item
│   │   │   ├── ActionPanel.jsx          # Action buttons + location selector
│   │   │   ├── ItemTable.jsx            # Dashboard items listing
│   │   │   ├── LocationHistoryTable.jsx # Table of past locations per item
│   │   │   └── UserSwitcher.jsx         # Active user dropdown
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx       # Login form
│   │   │   ├── DashboardPage.jsx   # All items overview
│   │   │   └── DetailsPage.jsx     # Single item detail view
│   │   ├── App.jsx                 # Route definitions + ProtectedRoute
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Tailwind CSS imports
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                         # Express backend
    ├── controllers/
    │   ├── authController.js       # Login logic
    │   └── itemsController.js      # Item CRUD + action submission
    ├── db/
    │   ├── index.js                # PostgreSQL connection pool
    │   ├── schema.sql              # Table definitions
    │   └── seed.sql                # Initial data
    ├── middleware/
    │   └── auth.js                 # JWT middleware (currently empty)
    ├── routes/
    │   ├── auth.js                 # POST /api/auth/login
    │   ├── items.js                # GET/POST /api/items
    │   ├── locations.js            # GET /api/locations
    │   └── users.js                # GET /api/users
    ├── index.js                    # Express app setup
    ├── .env                        # Environment variables
    └── package.json
```

---

## Database Schema

```
solution_types          locations
──────────────          ─────────
id   SERIAL PK          id   SERIAL PK
name VARCHAR            name VARCHAR

users
─────────────────────────────────────
id        SERIAL PK
name      VARCHAR
email     VARCHAR UNIQUE
password  VARCHAR (bcrypt hash)
role      VARCHAR DEFAULT 'user'

items
──────────────────────────────────────────────
id                  SERIAL PK
name                VARCHAR
solution_type_id    FK → solution_types(id)
current_location_id FK → locations(id) (nullable)
status              VARCHAR DEFAULT 'active'
                    values: active | missing | consumed | complete

location_history
─────────────────────────────────
id          SERIAL PK
item_id     FK → items(id)
location_id FK → locations(id)
timestamp   TIMESTAMPTZ DEFAULT NOW()

action_history
─────────────────────────────────
id        SERIAL PK
item_id   FK → items(id)
user_id   FK → users(id)
action    VARCHAR
timestamp TIMESTAMPTZ DEFAULT NOW()
```

### Relationships
- Each item belongs to one solution type and optionally has a current location
- Location history tracks every location an item has been at, with timestamps
- Action history tracks every action performed on an item, by which user, with timestamps
- When a terminal action (Missing / Consumed / Complete) is submitted, `current_location_id` is set to NULL and status is updated accordingly

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL 18 running on port 5432

### 1. Set up the database

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U manan -h 127.0.0.1 -d xemelgo_dashboard
```

If starting from scratch:

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h 127.0.0.1 -c "CREATE USER manan;"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h 127.0.0.1 -c "CREATE DATABASE xemelgo_dashboard OWNER manan;"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U manan -h 127.0.0.1 -d xemelgo_dashboard -f server/db/schema.sql
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U manan -h 127.0.0.1 -d xemelgo_dashboard -f server/db/seed.sql
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Start the backend

```bash
cd server
npm run dev
# Server runs on http://localhost:5001
```

### 4. Start the frontend

```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

---

## Environment Variables

Located at `server/.env`:

```env
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=xemelgo_dashboard
DB_USER=manan
DB_PASSWORD=
JWT_SECRET=xemelgo_secret_key_123
```

| Variable | Description |
|----------|-------------|
| `PORT` | Express server port |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | PostgreSQL user |
| `DB_PASSWORD` | PostgreSQL password (empty for trust auth) |
| `JWT_SECRET` | Secret used to sign/verify JWT tokens |

---

## API Reference

### Authentication

#### `POST /api/auth/login`
Authenticate a user and receive a JWT token.

**Request body:**
```json
{
  "email": "tabitha@xemelgo.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Tabitha Ryne",
    "email": "tabitha@xemelgo.com",
    "role": "admin"
  }
}
```

**Response `401`:** `{ "error": "Invalid email or password" }`

---

### Items

#### `GET /api/items`
Returns all items with their solution type and current location.

**Response `200`:**
```json
[
  {
    "id": 1,
    "name": "Item 1",
    "status": "active",
    "solution_type": "Asset",
    "current_location": "Storage 1"
  }
]
```

---

#### `GET /api/items/:id`
Returns a single item with its full location and action history.

**Response `200`:**
```json
{
  "item": {
    "id": 1,
    "name": "Item 1",
    "status": "active",
    "solution_type": "Asset",
    "current_location": "Storage 1"
  },
  "locationHistory": [
    { "id": 4, "location": "Storage 1", "timestamp": "2026-04-09T10:00:00Z" }
  ],
  "actionHistory": [
    { "id": 4, "user_name": "Tabitha Ryne", "action": "Moved", "timestamp": "2026-04-09T10:00:00Z" }
  ]
}
```

**Response `404`:** `{ "error": "Item not found" }`

---

#### `POST /api/items/:id/action`
Submit an action on an item. Updates item status, records location history (if applicable), and records the action.

**Request body:**
```json
{
  "action": "Moved",
  "location_id": 2,
  "user_id": 1
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `action` | Yes | One of: `Moved`, `Missing`, `Scanned`, `Consumed`, `Received`, `Complete` |
| `location_id` | Conditional | Required for actions that need a location (Moved, Scanned, Received) |
| `user_id` | Yes | ID of the user performing the action |

**Terminal actions** (`Missing`, `Consumed`, `Complete`) set `current_location_id` to NULL and update item status. No further actions can be submitted after a terminal state.

**Response `200`:** Returns the updated item object.

---

### Locations

#### `GET /api/locations`
Returns all available locations.

**Response `200`:**
```json
[
  { "id": 1, "name": "Storage 1" },
  { "id": 2, "name": "Storage 2" }
]
```

---

### Users

#### `GET /api/users`
Returns all users (used to populate the active user dropdown).

**Response `200`:**
```json
[
  { "id": 1, "name": "Tabitha Ryne", "email": "tabitha@xemelgo.com", "role": "admin" }
]
```

---

### Health Check

#### `GET /api/health`
**Response `200`:** `{ "status": "ok" }`

---

## Frontend Architecture

### Routing (`App.jsx`)

```
/login          → LoginPage          (public)
/dashboard      → DashboardPage      (protected)
/items/:id      → DetailsPage        (protected)
*               → redirect /login
```

`ProtectedRoute` checks for a JWT token in `AuthContext`. If none exists, it redirects to `/login`.

---

### Auth Context (`context/AuthContext.jsx`)

Global state for authentication. Persists to `localStorage`.

```
AuthContext
  ├── token       — JWT string (null if logged out)
  ├── user        — { id, name, email, role }
  ├── login()     — stores token + user to state and localStorage
  └── logout()    — clears token + user from state and localStorage
```

Consumed via the `useAuth()` hook anywhere in the component tree.

---

### Axios Instance (`api/axios.js`)

A configured Axios instance that:
- Sets `baseURL` to `http://localhost:5001/api`
- Attaches `Authorization: Bearer <token>` on every request via a request interceptor, reading the token from `localStorage`

All components import this instance instead of raw Axios.

---

### Component Breakdown

#### `LoginPage`
- Email + password form
- Calls `POST /api/auth/login`
- On success: calls `login()` from AuthContext, navigates to `/dashboard`
- Displays error message on failed login

#### `DashboardPage`
- Fetches all items from `GET /api/items` on mount
- Renders the page header with `UserSwitcher` and a logout button
- Passes items to `ItemTable`
- `activeUser` state is initialized by `UserSwitcher` and passed down (used later on DetailsPage)

#### `DetailsPage`
- Reads `:id` from the URL via `useParams()`
- Fetches item detail from `GET /api/items/:id` on mount and after every action submission
- Renders: Detail Summary card, `ActionPanel`, `LocationHistoryTable`, `ActionHistoryTable`
- Passes `fetchItem` as `onActionSubmit` to `ActionPanel` so the page refreshes after an action

#### `ItemTable`
- Renders items in a table: Name | Solution Type badge | Current Location | "See Details" button
- Clicking a row toggles highlighting of all rows with the **same solution type** (click again to deselect)
- "See Details" button navigates to `/items/:id` (uses `e.stopPropagation()` to prevent row click)

#### `ActionPanel`
- Receives `item`, `activeUser`, `onActionSubmit` as props
- Reads valid actions from `actionConfig` keyed by `item.solution_type`
- If item status is terminal (`missing`, `consumed`, `complete`), shows a disabled message
- Otherwise renders action buttons; selecting one that `needsLocation: true` shows a location dropdown
- On submit: POSTs to `/api/items/:id/action`, calls `onActionSubmit()` on success

```js
// Action configuration (frontend-only)
const actionConfig = {
  'Asset':      [{ label: 'Move to',    value: 'Moved',    needsLocation: true  },
                 { label: 'Missing',    value: 'Missing',  needsLocation: false }],
  'Inventory':  [{ label: 'Scanned at', value: 'Scanned',  needsLocation: true  },
                 { label: 'Consumed',   value: 'Consumed', needsLocation: false }],
  'Work Order': [{ label: 'Received at',value: 'Received', needsLocation: true  },
                 { label: 'Complete',   value: 'Complete', needsLocation: false }],
}
```

#### `UserSwitcher`
- Fetches all users from `GET /api/users` on mount
- Auto-selects the first user if no `activeUser` is set
- Renders a dropdown; selecting a user calls `setActiveUser` to update parent state
- Used in both DashboardPage and DetailsPage headers

#### `LocationHistoryTable`
- Renders location history rows: Location | Timestamp
- Clicking a row highlights all rows with the **same location** (toggle)

#### `ActionHistoryTable`
- Renders action history rows: User | Action | Timestamp
- Clicking a row highlights all rows by the **same user** (toggle)

---

## Authentication Flow

```
User enters email + password
        │
        ▼
POST /api/auth/login
        │
        ├─ User not found → 401
        ├─ Wrong password → 401
        └─ Success:
              bcrypt.compare() verifies password
              jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '24h' })
              Returns token + user object
                    │
                    ▼
        AuthContext.login() called
        Stores token + user in localStorage
                    │
                    ▼
        Navigate to /dashboard
                    │
                    ▼
        All subsequent API calls attach:
        Authorization: Bearer <token>
        (via Axios request interceptor)
```

---

## Features & Functionality

### Item Lifecycle

Every item follows this lifecycle based on its solution type:

```
Asset:
  active ──[Move to]──▶ active (location updated)
  active ──[Missing]──▶ missing (terminal — no further actions)

Inventory:
  active ──[Scanned at]──▶ active (location updated)
  active ──[Consumed]───▶ consumed (terminal)

Work Order:
  active ──[Received at]──▶ active (location updated)
  active ──[Complete]────▶ complete (terminal)
```

### Row Highlighting

Two types of interactive highlighting:

| Table | Click behavior |
|-------|---------------|
| Item Table (Dashboard) | Highlights all rows with the same **solution type** |
| Location History | Highlights all rows with the same **location** |
| Action History | Highlights all rows by the same **user** |

Click again to deselect.

### Active User

The "Active User" dropdown (top-right on all pages) determines **who is credited** for a submitted action. It is independent of the logged-in user — operators can record actions on behalf of any team member.

---

## Known Issues & Limitations

| # | Issue | Impact |
|---|-------|--------|
| 1 | Auth middleware (`server/middleware/auth.js`) is empty — all API routes are unprotected | High |
| 2 | `user_id` is sent from the frontend — the server trusts it without JWT verification | High |
| 3 | `UserSwitcher` has no error handling — if `/api/users` fails, `activeUser` stays null and action submission crashes | Medium |
| 4 | Dashboard data is not refreshed after returning from DetailsPage | Medium |
| 5 | No input validation on any API endpoint | Medium |
| 6 | `solutionColors` object is duplicated in `ItemTable` and `DetailsPage` | Low |
| 7 | No React Error Boundary — a single component crash takes down the whole app | Medium |
| 8 | Error responses include raw `err.message`, which can leak internal details | Medium |
| 9 | No server-side logging | Low |
| 10 | JWT secret is weak and hardcoded in `.env` | High |

---

## Demo Credentials

All users have the password `password`.

| Name | Email | Role |
|------|-------|------|
| Tabitha Ryne | tabitha@xemelgo.com | admin |
| Jacob Eld | jacob@xemelgo.com | user |
| Claire Stroup | claire@xemelgo.com | user |
| Curtis Trak | curtis@xemelgo.com | user |

---

## Seed Data Summary

| Category | Count |
|----------|-------|
| Solution Types | 3 (Asset, Inventory, Work Order) |
| Locations | 4 (Storage 1–4) |
| Users | 4 |
| Items | 12 (4 per solution type) |
| Location History records | 30 |
| Action History records | 30 |
