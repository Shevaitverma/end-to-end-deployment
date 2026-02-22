# Todo App — Full-Stack Production-Grade Application

A modern, full-stack todo application built with **Next.js 15**, **Bun + Express**, and **MongoDB**. Features a glassmorphism UI with dark mode, optimistic updates, and comprehensive test coverage.

## Tech Stack

### Frontend (`client/`)
- **Next.js 15** (App Router) with TypeScript
- **Tailwind CSS v4** — utility-first styling with custom animations
- **TanStack Query v5** — server state management with optimistic updates
- **Jest + React Testing Library** — 149 tests across 11 suites

### Backend (`server/`)
- **Bun** runtime + **Express** framework
- **MongoDB** with **Mongoose** ODM
- **Zod** — schema validation for requests and environment variables
- **bun:test** — 23 unit tests across 3 suites

### CI/CD
- **GitHub Actions** — automated test and build pipeline on push/PR to `main` and `stage`

## Project Structure

```
.
├── client/                     # Next.js frontend
│   ├── src/
│   │   ├── app/                # Root layout, page, global styles
│   │   ├── components/
│   │   │   ├── todo/           # TodoList, TodoItem, TodoForm, TodoFilters, TodoStats
│   │   │   └── ui/             # Button, Input, Select, Badge, LoadingSpinner, EmptyState, ThemeToggle
│   │   ├── hooks/              # useTodos (React Query), useTheme (dark mode)
│   │   ├── lib/                # API client, utility functions
│   │   ├── providers/          # React Query provider
│   │   └── types/              # Shared TypeScript interfaces
│   ├── __tests__/              # Component, hook, and utility tests
│   ├── next.config.ts          # API proxy rewrites to backend
│   ├── jest.config.ts
│   └── package.json
│
├── server/                     # Bun + Express backend
│   ├── src/
│   │   ├── config/             # Database connection (retry logic), env validation (Zod)
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/          # Error handler, Zod validation, 404 handler
│   │   ├── models/             # Mongoose schemas with indexes
│   │   ├── routes/             # Express route definitions
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── services/           # Business logic layer
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # API response helpers, AppError class
│   │   └── app.ts              # Express app entry point
│   ├── tests/unit/             # Service, validation, and response tests
│   └── package.json
│
└── .github/workflows/ci.yml   # CI pipeline
```

## Features

### Todo Management
- Create, read, update, and delete todos
- Toggle completion status
- Set priority levels (low, medium, high)
- Optional descriptions

### Filtering & Sorting
- Filter by status (all / active / completed)
- Filter by priority
- Sort by date created, priority, or title
- Ascending / descending order
- Pagination with page navigation

### UI/UX
- Glassmorphism design with gradient backgrounds and floating blobs
- Dark mode / light mode toggle (persisted in localStorage, respects system preference)
- Smooth animations — fade-in, slide-down, staggered list, checkbox bounce
- Priority accent bars on each todo card
- Progress bar with completion percentage
- Responsive layout (mobile-first)
- Accessible — ARIA labels, roles, keyboard navigation

### Backend
- RESTful API with standardized JSON responses
- Input validation with Zod schemas
- Mongoose model with indexes for common queries
- Rate limiting, CORS, Helmet security headers
- Global error handling (Mongoose errors, validation, unknown errors)
- Database connection retry logic with graceful shutdown
- Cloudflare + Google DNS for reliable SRV lookups (MongoDB Atlas)

## API Endpoints

| Method | Endpoint          | Description             |
|--------|-------------------|-------------------------|
| GET    | `/health`         | Health check            |
| GET    | `/api/todos`      | List todos (with filters, pagination, sorting) |
| GET    | `/api/todos/:id`  | Get a single todo       |
| POST   | `/api/todos`      | Create a todo           |
| PATCH  | `/api/todos/:id`  | Update a todo           |
| DELETE | `/api/todos/:id`  | Delete a todo           |

### Query Parameters (GET `/api/todos`)

| Param      | Type    | Default     | Description                          |
|------------|---------|-------------|--------------------------------------|
| page       | number  | 1           | Page number                          |
| limit      | number  | 10          | Items per page (max 100)             |
| sortBy     | string  | createdAt   | Sort field: createdAt, priority, title, updatedAt |
| order      | string  | desc        | Sort order: asc, desc                |
| completed  | string  | —           | Filter: "true" or "false"            |
| priority   | string  | —           | Filter: low, medium, high            |
| search     | string  | —           | Search by title (case-insensitive)   |

### Response Format

```json
{
  "success": true,
  "data": [],
  "message": "Todos retrieved successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (v1.0+)
- [Node.js](https://nodejs.org/) (v20+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI
bun install
bun dev
```

The server starts on `http://localhost:5000` (or the PORT in `.env`).

### Frontend Setup

```bash
cd client
cp .env.local.example .env.local
npm install
npm run dev
```

The app starts on `http://localhost:3000` with API requests proxied to the backend.

### Environment Variables

**Server** (`.env`):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todo-app
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**Client** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running Tests

```bash
# Backend (23 tests)
cd server && bun test

# Frontend (149 tests)
cd client && npm test

# Frontend with coverage
cd client && npm run test:coverage
```

## CI Pipeline

GitHub Actions runs on push/PR to `main` and `stage`:

- **Server job** — install, type check, test
- **Client job** — install, lint, test (with coverage), build
- **Test summary** — confirms all jobs passed

## Scripts

### Server
| Script       | Command                       |
|-------------|-------------------------------|
| `bun dev`    | Start with hot reload         |
| `bun start`  | Start in production mode      |
| `bun test`   | Run unit tests                |
| `bun run typecheck` | TypeScript type checking |

### Client
| Script              | Command                       |
|--------------------|-------------------------------|
| `npm run dev`       | Start dev server (Turbopack)  |
| `npm run build`     | Production build              |
| `npm start`         | Start production server       |
| `npm test`          | Run tests                     |
| `npm run test:coverage` | Run tests with coverage   |
| `npm run lint`      | Run ESLint                    |
