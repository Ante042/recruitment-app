# Recruitment App

Recruitment application for KTH course IV1201. Built with Express.js (backend) and React (frontend).

Live: https://recruitment-app-antf.onrender.com

## Prerequisites

- Node.js 18+
- PostgreSQL

## Getting started

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Edit `.env` with your database credentials and a JWT secret. The app runs on port 3000 by default.

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key for signing tokens |
| `FRONTEND_URL` | Frontend origin for CORS (default: `http://localhost:5173`) |

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on port 5173. Set `VITE_API_URL` in a `.env` file if the backend runs on a different URL.

## Data migration

To import data from the existing database, place the SQL dump at `backend/migrations/data/old_database.sql`, then run:

```bash
cd backend
npm run migrate
```

This imports all persons, competences, competence profiles and availability periods. It handles missing data (users without passwords get a temporary password, missing usernames are generated from name and ID).

## Project structure

```
backend/src/
  config/       - Database connection (Sequelize)
  controller/   - Request handling and business logic
  integration/  - Database access (DAOs)
  middleware/   - Auth and guard middleware
  migrations/   - Data migration script
  model/        - Sequelize models
  routes/       - Express route definitions
  util/         - JWT, password, validation, logging, errors

frontend/src/
  api/          - Axios client and API calls
  components/   - Reusable UI components
  context/      - Auth context
  pages/        - Page components
  utils/        - Client-side validation and error helpers
```

## Higher grade tasks

| Task | Description | Where to find it |
|------|-------------|-----------------|
| 7 | Password hashing | `backend/src/util/password.js`, bcrypt with configurable rounds via `BCRYPT_ROUNDS` |
| 8 | CORS | `backend/src/app.js`, configured with `credentials: true` and origin from `FRONTEND_URL` |
| 9 | Logging | `backend/src/util/logger.js`, Winston logger writing to `logs/error.log` and `logs/combined.log`. Controllers log successful operations, error handler logs all errors |
| 25 | Server-side validation | `backend/src/controller/` - all input is validated before any database call using `util/validation.js` |
| 26 | Client-side validation | `frontend/src/utils/validation.js`, used in `Register.jsx` and `Login.jsx` |
| 27 | Reusable view components | `frontend/src/components/Layout.jsx`, `Header.jsx`, `Footer.jsx` - used by all pages via `App.jsx` |
| 28 | Data migration with lacking data | `backend/migrations/importExistingData.js` - generates usernames and hashes passwords for users that lack them in the old database |
| 29 | Integration layer validation | All DAOs in `backend/src/integration/` validate input with guard assertions before any database call |
| 32 | Canvas resources | Three resources added to the course Canvas Links page |
