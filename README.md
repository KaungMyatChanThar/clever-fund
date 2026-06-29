# Clever Fund

**Learn Now Pay Later (LNPL)** platform for Myanmar students. Zero upfront cost — repayment starts only after you earn.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS v4 |
| Backend | Go 1.22 + chi router |
| Database | PostgreSQL 16 |
| Container | Docker + Docker Compose |

## Project Structure

```
clever-fund/
├── src/                  # React frontend
│   ├── App.tsx           # Main app + all page sections
│   └── components/
├── backend/
│   ├── cmd/main.go       # Server entry point
│   └── internal/
│       ├── db/           # Connection, migrations (embedded SQL)
│       ├── handler/      # HTTP handlers
│       └── model/        # Request/response types
├── docker-compose.yml    # Postgres + API
└── vite.config.ts        # Proxies /api → localhost:8080
```

## Getting Started

### 1. Start the backend

```bash
docker compose up --build
```

This starts PostgreSQL and the Go API. On first boot, migrations run automatically and seed 18 courses across 6 programs.

### 2. Start the frontend

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> Vite proxies `/api` to `http://localhost:8080`, so no CORS config or env vars needed in development.

## API

Base URL: `http://localhost:8080`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/v1/applications` | Submit application, returns matched courses |
| `GET` | `/api/v1/courses` | All courses (filter with `?program=Healthcare`) |

### POST /api/v1/applications

**Request**
```json
{
  "full_name": "Ma Aye Aye",
  "contact": "09 123 456 789",
  "program": "Tech & Software",
  "motivation": "I want to become a developer"
}
```

**Response `201`**
```json
{
  "application": {
    "id": "uuid",
    "full_name": "Ma Aye Aye",
    "contact": "09 123 456 789",
    "program": "Tech & Software",
    "motivation": "I want to become a developer",
    "created_at": "2025-01-01T00:00:00Z"
  },
  "matched_courses": [
    {
      "id": 1,
      "title": "Full-Stack Web Development",
      "description": "...",
      "program": "Tech & Software",
      "provider": "Code Myanmar Institute",
      "duration": "6 months",
      "price_mmk": 450000
    }
  ]
}
```

### Available programs

- Tech & Software
- Healthcare
- Engineering
- Business & Finance
- Teacher Training
- Languages

## Database

Two tables managed via embedded SQL migrations (`backend/internal/db/migrations/`):

- **`applications`** — form submissions (name, contact, program, motivation)
- **`courses`** — seeded catalogue of 18 courses across all 6 programs

Migrations run on every server start and are idempotent — already-applied versions are skipped.

## Environment

The backend reads one required env var:

```
DATABASE_URL=postgres://cleverfund:cleverfund@localhost:5432/cleverfund?sslmode=disable
```

Docker Compose sets this automatically. For local Go development outside Docker, copy `backend/.env.example` to `backend/.env`.
