# HMCTS Task Manager: Frontend

Web interface for caseworkers to manage their tasks, built on the HMCTS Node.js frontend starter with Express, Nunjucks and the GOV.UK Design System.

It talks to the API in [`../backend`](../backend), which must be running on http://localhost:4000.

## Running it

```bash
yarn install
yarn webpack
yarn start:dev
```

Then open https://localhost:3100 (accept the self-signed certificate warning).

## Pages

| Page | Route | What it does |
|------|-------|--------------|
| Task list | `/` | All tasks in a GOV.UK table with a coloured status tag and due date |
| Create task | `/tasks/create` | Form for title, description, status and due date, with validation errors shown in a GOV.UK error summary |
| Update status | `/tasks/:id/status` | Change a task's status |
| Delete | `/tasks/:id/delete` | Removes a task and returns to the list |

## Structure

```
src/main/
├── routes/
│   ├── home.ts            # Task list
│   └── tasks.ts           # Create, update status, delete
├── utils/taskFilters.ts   # Turns tasks into GOV.UK table rows and status tags
├── types/task.ts          # Task type shared by the routes
└── views/
    ├── home.njk
    └── tasks/
        ├── create.njk
        └── update-status.njk
```

## Tests

```bash
yarn test
```
