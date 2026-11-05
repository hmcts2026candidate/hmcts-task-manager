# HMCTS Task Manager

A small case management tool that lets caseworkers create, view, update and delete their tasks. Built for the [HMCTS DTS Developer Challenge](https://github.com/hmcts/dts-developer-challenge).

| Part | Folder | Stack | Runs on |
|------|--------|-------|---------|
| API | [`backend/`](backend) | Node.js, TypeScript, Express, Prisma (SQLite), Zod, Swagger | http://localhost:4000 |
| Web app | [`frontend/`](frontend) | HMCTS Node.js starter, Express, Nunjucks, GOV.UK Design System | https://localhost:3100 |

Each task has a **title**, an optional **description**, a **status** (`TODO`, `IN_PROGRESS`, `DONE`) and a **due date/time**.

## Prerequisites

- Node.js 18 or later
- npm (backend) and Yarn via Corepack (frontend: run `corepack enable` once)

## Running the app

Start the API first, then the frontend, in two terminals.

### 1. Backend API (port 4000)

```bash
cd backend
npm install
cp .env.example .env              # sets DATABASE_URL to a local SQLite file
npx prisma migrate dev            # creates the database and tables
npm run dev
```

Check it is up: http://localhost:4000/health returns `{ "status": "ok" }`.

### 2. Frontend (port 3100)

```bash
cd frontend
yarn install
yarn webpack                      # builds the GOV.UK styles and scripts
yarn start:dev
```

Open https://localhost:3100. The dev server uses a self-signed certificate, so your browser will show a warning the first time; continue to the site.

## API documentation

Interactive Swagger docs: **http://localhost:4000/api-docs**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/:id` | Get a task by ID |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id/status` | Update a task's status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

Request examples and validation rules are in [`backend/README.md`](backend/README.md).

## Running the tests

```bash
# Backend: unit tests for the service layer and Supertest tests for the routes
cd backend
npm test
npm run test:coverage

# Frontend
cd frontend
yarn test
```

## Design decisions

- **Layered backend.** Routes, controllers, services and validation are kept separate, so business logic is tested without HTTP and HTTP is tested without the database.
- **Validation at the edge.** Zod schemas validate every request body and return field-level errors, which the frontend shows using the GOV.UK error summary pattern.
- **Consistent errors.** A single error handler returns `{ error }` JSON with the right status code (400, 404, 500).
- **SQLite via Prisma** keeps setup to one command. Prisma makes moving to PostgreSQL a one-line change to the datasource.
- **GOV.UK Design System** on the HMCTS frontend starter, so the interface looks and behaves like other HMCTS services and follows its accessibility patterns.

## What I'd do next

- Switch to PostgreSQL with a `docker-compose.yml` so the whole stack starts with one command.
- Add route tests for the frontend task pages, with the API mocked.
- Change delete to a POST with a confirmation page, and add CSRF protection to the forms.
- Move the API URL into the frontend's `config` files instead of a constant.
- Allow editing a task's title, description and due date, not just its status.
- Add filtering and sorting by status and due date, and pagination for large task lists.
- Add authentication so each caseworker sees their own tasks.
- Add a GitHub Actions pipeline to lint, test and build both parts on every push.
