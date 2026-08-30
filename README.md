# Exhibition Hub (HydExpo)

**Exhibition Hub** (HydExpo) is a full-stack exhibition management system designed for trade expos, conventions, and exhibition organizers. It provides comprehensive management for stall inventory and floor plans, lead tracking, booking transactions, payment receipts, invoice generation, service add-ons, and event expense tracking with role-based security and multi-exhibition isolation.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Structure](#-project-structure)
- [Environment Configuration](#-environment-configuration)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Option A: Running with Docker Compose (Recommended)](#option-a-running-with-docker-compose-recommended)
  - [Option B: Manual Local Setup](#option-b-manual-local-setup)
- [Available Commands](#-available-commands)
  - [Frontend (`apps/frontend`)](#frontend-appsfrontend)
  - [Backend (`apps/api`)](#backend-appsapi)
  - [Scripts & Deployment](#scripts--deployment)
- [Database & Migrations](#-database--migrations)
- [Security & Development Notes](#-security--development-notes)

---

## ✨ Features

- **Interactive Floor Layout**: Visual grid view of stalls with color-coded booking statuses (*Available*, *Reserved*, *Pending*, *Sold*, *Blocked*), interactive detail drawers, and pan/zoom controls.
- **Multi-Exhibition Management**: Switch dynamically between active exhibitions with complete data isolation per event.
- **Lead & CRM Pipeline**: Manage prospective exhibitors across stages (*New*, *Follow Up*, *Interested*, *Converted*, *Cancelled*).
- **Booking Transactions**: Workflows for booking stalls and adding auxiliary services (e.g., extra lighting, power outlets, furniture). Includes dynamic balance and status tracking.
- **Payment & Receipts**: Multi-channel payment recording (Cash, UPI, Bank Transfer) with automated sequential invoice/receipt generation (PDF & printable HTML formatted for INR `₹` and Indian English number words).
- **Stall Pricing Editor**: Admin-only batch and inline stall pricing management per zone.
- **Expense Management**: Track exhibition overheads and vendor expenses by categories (Venue, Furniture, Marketing, Utilities, Staff, Misc).
- **Role-Based Access Control (RBAC)**: Enforces role permissions (*Admin* vs. *Maintainer*) across API endpoints and frontend navigation.
- **Production Hardened**: Features Redis caching, rate limiting, secure password hashing (bcrypt with salt & pepper), strict CORS enforcement, compression, and structured error handling.

---

## 🛠️ Tech Stack & Architecture

### Frontend (`apps/frontend`)
- **Framework & Build**: React 18, TypeScript, Vite
- **UI & Styling**: Tailwind CSS, shadcn/ui (Radix UI primitives), Lucide React icons
- **State & Data Fetching**: TanStack React Query (v5), React Context API
- **Utilities & Visualization**: `date-fns`, Recharts, XLSX for data export
- **Testing**: Vitest, React Testing Library

### Backend (`apps/api`)
- **Runtime & Framework**: Node.js / Bun, Express.js (ESM TypeScript)
- **Database**: PostgreSQL 16 (via `pg` connection pool with CTEs and dynamic SQL unnesting)
- **Cache & Performance**: Redis 7 (`ioredis`) for query and session caching
- **Security & Validation**: JSON Web Tokens (`jsonwebtoken`), `bcrypt`/`bcryptjs`, Zod, Helmet, `express-rate-limit`, CORS

### Infrastructure & Containerization
- **Containerization**: Docker & Docker Compose
- **Database Engine**: Custom PostgreSQL image with pre-configured migrations (`Dockerfile.db`)

---

## 📁 Project Structure

```
exhibition-hub/
├── apps/
│   ├── api/                      # Express.js TypeScript Backend API
│   │   ├── src/
│   │   │   ├── config/           # Database, Redis, and Environment config
│   │   │   ├── middleware/       # Auth (JWT), RBAC, Error Handler
│   │   │   ├── routes/           # REST API endpoints (stalls, leads, transactions, etc.)
│   │   │   └── types/            # TypeScript type definitions
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── frontend/                 # React + Vite Frontend Application
│       ├── src/
│       │   ├── components/       # UI, Layout (Sidebar, Header), Floor layout components
│       │   ├── contexts/         # Auth, Exhibition, and Supabase/API Data Contexts
│       │   ├── hooks/            # Custom React hooks & queries
│       │   ├── lib/              # Formatters, Export, Invoice generators, Layout utils
│       │   ├── pages/            # View pages (Floor plan, Leads, Transactions, Receipts, etc.)
│       │   └── types/            # Frontend TypeScript interfaces
│       ├── Dockerfile
│       └── package.json
│
├── deploy/                       # Production deployment scripts & Docker Compose configs
│   ├── docker-compose.production.yml
│   ├── run-production.sh
│   └── run.sh
│
├── scripts/                      # Utility scripts (database backup, stall seeding)
│   ├── backup-postgres.sh
│   └── seed-stalls.ts
│
├── supabase/
│   └── migrations/               # SQL migrations (001_initial_schema to 012_expenses_schema)
│
├── docker-compose.yml            # Development Docker Compose file
├── Dockerfile.db                 # PostgreSQL image with auto-migration entrypoint
├── .env.example                  # Environment template
└── PROJECT_DOCUMENTATION.md      # Detailed architectural documentation
```

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` for development (or create `.env.production` for production deployments).

```bash
cp .env.example .env
```

### Key Environment Variables

| Variable | Scope | Description | Default / Example |
|----------|-------|-------------|-------------------|
| `PORT` | Backend | Port for API server | `4000` |
| `DATABASE_URL` | Backend | PostgreSQL connection string | `postgresql://app_user:devpassword123@localhost:5432/exhibition_hub` |
| `REDIS_URL` | Backend | Redis instance connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Backend | Secret key for signing JWT tokens | *Secret string (must change in production)* |
| `JWT_EXPIRES_IN` | Backend | Expiration duration for JWT tokens | `7d` |
| `BCRYPT_PEPPER` | Backend | Optional secret pepper for password hashing | *Secret string* |
| `BCRYPT_SALT_ROUNDS` | Backend | Salt rounds for bcrypt password hashing | `12` |
| `CORS_ORIGIN` | Backend | Allowed origin(s) (comma-separated for multiple) | `http://localhost:5173` |
| `NODE_ENV` | Backend | Environment mode (`development` or `production`) | `development` |
| `VITE_API_URL` | Frontend | Base API URL endpoint for frontend HTTP requests | `http://localhost:4000/api` |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ or v20+) or **Bun** (v1.1+)
- **Docker** and **Docker Compose** (recommended for easy setup)
- **PostgreSQL 16** and **Redis 7** (if running manually without Docker)

---

### Option A: Running with Docker Compose (Recommended)

To start the database, Redis cache, backend API, and frontend server in containers:

1. Build and launch all services:
   ```bash
   docker-compose up --build
   ```
2. Access the applications:
   - **Frontend App**: `http://localhost:5173`
   - **Backend API**: `http://localhost:4000/api`
   - **Health Check**: `http://localhost:4000/api/health`

---

### Option B: Manual Local Setup

#### 1. Start PostgreSQL & Redis
Ensure PostgreSQL and Redis are running locally. You can use Docker for the databases only:
```bash
docker run -d --name local-postgres -p 5432:5432 -e POSTGRES_DB=exhibition_hub -e POSTGRES_USER=app_user -e POSTGRES_PASSWORD=devpassword123 postgres:16-alpine
docker run -d --name local-redis -p 6379:6379 redis:7-alpine
```

#### 2. Apply Database Migrations
Run the SQL migration files located in `supabase/migrations/` sequentially against your PostgreSQL database.

#### 3. Start the Backend API (`apps/api`)
```bash
cd apps/api
npm install
npm run dev
```
The backend API will start on `http://localhost:4000`.

#### 4. Start the Frontend App (`apps/frontend`)
```bash
cd apps/frontend
npm install
npm run dev
```
The frontend application will start on `http://localhost:5173`.

---

## 📜 Available Commands

### Frontend (`apps/frontend`)

Run these commands inside `apps/frontend` (or via `bun`):

```bash
npm run dev         # Starts Vite development server
npm run build       # Builds production distribution assets
npm run preview     # Previews production build locally
npm run lint        # Executes ESLint checks
npm run test        # Runs unit tests with Vitest
npm run seed-stalls # Runs stall seeding script via tsx
```

### Backend (`apps/api`)

Run these commands inside `apps/api`:

```bash
npm run dev         # Starts API in watch mode via tsx
npm run build       # Compiles TypeScript to dist/ via tsc
npm run start       # Runs production build from dist/index.js
```

### Scripts & Deployment

Run these from the root directory:

```bash
# Production Deployment Scripts (in deploy/)
./deploy/run.sh               # Local production deploy helper
./deploy/run-production.sh    # Production deployment launcher

# Database Management
./scripts/backup-postgres.sh  # Creates PostgreSQL database backups
```

---

## 🗄️ Database & Migrations

The database uses PostgreSQL with custom schema enums (`app_role`: `admin`, `maintainer`; `item_type`: `stall`, `service`).

Migration files are managed under `supabase/migrations/`:
1. `001_initial_schema.sql` - Core schema (exhibitions, stalls, leads, transactions, payments)
2. `002_create_views.sql` - Analytics and reporting views
3. `003_rls_policies.sql` - Row-Level Security policies
4. `004_seed_data.sql` - Initial sample data
5. `005_user_management.sql` - Profiles and roles table definitions
6. `006_make_profiles_flexible.sql` - User profile enhancements
7. `007_fix_user_roles_rls_recursion.sql` - Security recursion fix
8. `008_allow_profiles_insert.sql` - Profile insertion policies
9. `010_seed_test_users.sql` - Test user credentials
10. `011_allow_exhibitions_insert.sql` - Exhibition creation policies
11. `012_expenses_schema.sql` - Expense tracking table and schema updates

---

## 🛡️ Security & Development Notes

- **Authentication**: JWT tokens are passed via standard HTTP Bearer headers (`Authorization: Bearer <token>`).
- **Authorization**: API endpoints enforce role checks via `requireAuth` and `requireAdmin` middleware. Role verification is validated against the authenticated user account and never trusts client headers.
- **Production Guardrails**:
  - Direct wildcard CORS origins (`*`) are disallowed in production mode.
  - Development fallback secrets (`dev-jwt-secret...`) cause the server to halt execution if detected in production mode.
  - Critical error boundaries capture frontend runtime exceptions while console logging is automatically disabled in production builds.
- **Data Integrity**: Batch dynamic operations (e.g., bulk transaction items, unnesting arrays for stall/service updates) utilize CTEs and array safeguards to eliminate N+1 query patterns and guard against empty dataset syntax errors.
