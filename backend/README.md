# HMCTS Task Manager API

A RESTful API for managing caseworker tasks, built with Node.js, TypeScript, Express, Prisma ORM and SQLite.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript |
| Framework | Express.js |
| Database | SQLite (via Prisma ORM) |
| Validation | Zod |
| API Docs | Swagger UI |
| Tests | Jest + Supertest |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Database Setup

Copy the example environment file, then run the Prisma migration to create the SQLite database:

```bash
cp .env.example .env
npx prisma migrate dev
```

### Running the API

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build && npm start
```

The API will be available at: `http://localhost:4000`

## API Documentation

Interactive Swagger docs are available at: `http://localhost:4000/api-docs`

Here you can view and test all endpoints directly in your browser without needing any extra tools.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/:id` | Get a task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id/status` | Update task status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Task Status Values

| Status | Description |
|--------|-------------|
| `TODO` | Task has not been started (default) |
| `IN_PROGRESS` | Task is currently being worked on |
| `DONE` | Task has been completed |

### Example Requests

**Create a task:**
```json
POST /api/tasks
Content-Type: application/json

{
  "title": "Review case documents",
  "description": "Check all supporting files for case ABC123",
  "status": "TODO",
  "dueDate": "2024-12-31T17:00:00.000Z"
}
```

**Update task status:**
```json
PATCH /api/tasks/1/status
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

### Validation Rules

- `title` — required, max 200 characters
- `description` — optional, max 1000 characters
- `status` — must be one of `TODO`, `IN_PROGRESS`, `DONE`
- `dueDate` — required, must be a valid ISO 8601 date-time string

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

The test suite includes:
- **Unit tests** for the service layer (mocking Prisma)
- **Integration tests** for the controller layer (mocking the service, using Supertest)

## Project Structure

```
src/
├── config/
│   └── swagger.ts          # Swagger/OpenAPI configuration
├── controllers/
│   └── task.controller.ts  # HTTP request handlers
├── lib/
│   └── prisma.ts           # Prisma client instance
├── middleware/
│   ├── errorHandler.ts     # Global error handling
│   └── validate.ts         # Zod request validation
├── routes/
│   └── task.routes.ts      # API route definitions
├── schemas/
│   └── task.schema.ts      # Zod validation schemas
├── services/
│   └── task.service.ts     # Business logic and database calls
├── tests/
│   ├── task.controller.test.ts
│   └── task.service.test.ts
├── app.ts                  # Express app setup
└── server.ts               # Server entry point
```

## Health Check

```
GET /health
→ { "status": "ok" }
```
