# Flowway

> **Flowway — a mind mapping tool for structured thinking.**

<p align="center">
  <a href="https://flowway-pi.vercel.app/"><img src="https://img.shields.io/badge/demo-live-22c55e?style=for-the-badge" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/license-unlicensed-lightgrey?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/stack-React%20%7C%20Express%20%7C%20Postgres-6366f1?style=for-the-badge" alt="Tech Stack" />
  <img src="https://img.shields.io/badge/auth-Clerk-00E0FF?style=for-the-badge" alt="Auth" />
</p>

<p align="center">
  <a href="https://flowway-pi.vercel.app/">Demo</a> •
  <a href="https://github.com/RishavJbn/flowway/issues">Report Bug</a> •
  <a href="https://github.com/RishavJbn/flowway/issues">Request Feature</a>
</p>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Installation (Step-by-Step)](#local-installation-step-by-step)
- [Project Structure](#project-structure)
- [Core Logic / How It Works](#core-logic--how-it-works)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Environment Variables Reference](#environment-variables-reference)
- [Scripts Reference](#scripts-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Folder-Level Configuration (Docker)](#folder-level-configuration-docker)
- [Contributing Guidelines](#contributing-guidelines)
- [Roadmap](#roadmap)
- [FAQ / Troubleshooting](#faq--troubleshooting)
- [License](#license)
- [Contact / Acknowledgements](#contact--acknowledgements)

---

## About the Project

Flowway is a visual mind-mapping app for turning ideas into structured node graphs.  
It helps users brainstorm, connect related thoughts, and iterate quickly on concept maps.

### Key Features

- **Interactive Node Canvas**: Powered by React Flow for smooth creation and connecting of idea nodes.
- **Clerk Authentication**: Secure Login, Signup, and User Account management integrated directly into the client-server loop.
- **Sliding Left Workspace Sidebar**: Manage, create, search, and delete multiple diagram boards synced in the cloud when logged in.
- **Debounced Autosave**: Changes to nodes, edges, canvas patterns, theme colors, or titles are automatically synced to PostgreSQL 1.5 seconds after typing or canvas adjustments.
- **Offline Fallback Mode**: Instantly falls back to local storage if signed out or if keys are unconfigured, showing an warning badge but keeping the app completely functional offline.
- **Global Keyboard Deletion**: Select nodes or connections and tap `Delete` or `Backspace` to delete them (safely ignored when typing in name or node input boxes).
- **Undo/Redo History**: Local state snapshot wrappers to undo node placement, canvas styling, and connections.

### UI Preview

- Add screenshots/GIFs here:
  - `docs/screenshots/canvas.png`
  - `docs/screenshots/toolbar.png`
  - `docs/gifs/flowway-demo.gif`

### High-level Architecture

```mermaid
flowchart TD
  User[User] --> Client[React Client (Vite)]
  Client --> Auth[Clerk Auth SDK]
  Client -->|Bearer JWT| Server[Express Server (TypeScript)]
  Server -->|Prisma Client| DB[(PostgreSQL Database - Neon)]
  Client -->|Offline Fallback| LS[(Browser localStorage)]
```

---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 | UI rendering and state-driven interactions |
| **Build Tool** | Vite 7 | Dev server and production build |
| **Canvas/Graph Engine** | React Flow (`reactflow`) | Node-edge diagram rendering and interactions |
| **Authentication** | Clerk (`@clerk/clerk-react`) | Safe user authentication and JWT session generation |
| **Backend Server** | Express (`@clerk/express`) | Node.js REST API server with Clerk token verification |
| **Database ORM** | Prisma Client | Type-safe database queries and automated schema deployments |
| **Database** | PostgreSQL (Neon DB) | Cloud database storing relational mindmap files in JSON formats |
| **Styling** | Tailwind CSS 4 + CSS | Utility-first styling and glassmorphic interface designs |
| **Icons** | lucide-react | Toolbar and action icons |

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | **>= 18** (recommended LTS) |
| npm | Comes with Node.js |
| Database | **PostgreSQL** instance (e.g. Neon.tech, Supabase, or local) |
| Auth Portal | **Clerk.com** account and set of API keys |

---

## Local Installation (Step-by-Step)

### 1) Clone the repository

```bash
git clone https://github.com/RishavJbn/flowway.git
cd flowway
```

### 2) Setup environment variables

Create and configure your local environments.

*   **For the Frontend Client**:
    Create `client/.env.local` containing:
    ```env
    VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
    ```

*   **For the Backend Server**:
    Create `server/.env` containing:
    ```env
    PORT=5000
    DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"
    CLERK_PUBLISHABLE_KEY="pk_test_..."
    CLERK_SECRET_KEY="sk_test_..."
    ```

### 3) Install dependencies and push database schemas

**Frontend Client Setup**:
```bash
cd client
npm install
```

**Backend Server Setup**:
```bash
cd ../server
npm install
npm run prisma:push
```

### 4) Run in development mode

Open separate terminal windows:

*   **Start the Backend**:
    ```bash
    cd server
    npm run dev
    ```
*   **Start the Frontend**:
    ```bash
    cd client
    npm run dev
    ```

### Default local URLs
- Frontend client: `http://localhost:5173`
- Backend API server: `http://localhost:5000`

---

## Project Structure

```text
flowway/
├─ README.md
├─ client/                  # Frontend Client Application (Vite + React)
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ .env.local
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ components/        # AuthControls, Canvas, Sidebar, TextNode
│     ├─ hooks/             # useAuthSafe wrapping Clerk hooks
│     └─ utils/             # api.js client queries
└─ server/                  # Backend Express Server (TypeScript + Prisma)
   ├─ package.json
   ├─ tsconfig.json
   ├─ .env
   ├─ prisma/
   │  └─ schema.prisma      # Prisma schema file definitions
   └─ src/
      ├─ index.ts           # Server setup & CORS configurations
      ├─ lib/
      │  └─ db.ts           # Database connection client
      └─ routes/
         └─ flows.ts        # CRUD diagram controllers
```

### What each major part does

- `client/src/main.jsx` — React app bootstrap and conditional `<ClerkProvider>` configurations.
- `client/src/App.jsx` — central canvas state + autosave syncing loops.
- `client/src/hooks/useAuthSafe.js` — validates keys, preventing crashes if running locally offline.
- `client/src/utils/api.js` — handles authenticated API fetch actions.
- `server/src/routes/flows.ts` — validates user session tokens and maps Postgres CRUD actions.

---

## Core Logic / How It Works

At runtime, `App.jsx` controls the canvas graph state.

### Syncing workflow
1. If the user is **signed out** (or Clerk keys are missing):
   * App operates in **Local Mode** using browser `localStorage` as a fallback.
   * Diagram updates are saved locally. A warning badge alerts them they are in offline mode.
2. If the user is **signed in**:
   * App operates in **Cloud Mode**, query-fetching their boards from PostgreSQL.
   * Editing nodes, adding elements, modifying canvas patterns, or changing titles triggers a **1.5s debounced autosave** updating the PostgreSQL database.
   * Selecting or creating boards slides open the Left Workspace Sidebar for workspace switching.

```mermaid
sequenceDiagram
  participant User
  participant Toolbar
  participant AppState
  participant Canvas
  participant LocalStorage

  User->>Toolbar: Click "Add Node"
  Toolbar->>AppState: addNode()
  AppState->>AppState: updateNodes() + push history snapshot
  AppState->>Canvas: re-render with new nodes
  AppState->>LocalStorage: save flowway-nodes
```

### Sequence Diagram: Undo/Redo

```mermaid
sequenceDiagram
  participant User
  participant Toolbar
  participant AppState
  participant Canvas

  User->>Toolbar: Click Undo
  Toolbar->>AppState: undo()
  AppState->>AppState: move current -> future, restore prev from history
  AppState->>Canvas: re-render previous graph

  User->>Toolbar: Click Redo
  Toolbar->>AppState: redo()
  AppState->>AppState: move current -> history, restore next from future
  AppState->>Canvas: re-render restored graph
```

---

## API Documentation

All routes expect a valid session token in the authorization header: `Authorization: Bearer <TOKEN>`.

*   `GET /api/flows` - Get all saved flows belonging to the active user.
*   `GET /api/flows/:id` - Fetch details for a specific flow (checks user ownership).
*   `POST /api/flows` - Save and create a new diagram board.
*   `PUT /api/flows/:id` - Update the nodes, edges, styling, and title of a flow.
*   `DELETE /api/flows/:id` - Delete a flow by ID.

---

## Database Schema

Prisma PostgreSQL schema model:

```prisma
model Flow {
  id        String   @id @default(uuid())
  name      String   @default("Untitled Diagram")
  nodes     Json     // stores array of flow nodes
  edges     Json     // stores array of flow edges
  theme     String   @default("light")
  pattern   String   @default("grid")
  userId    String   // Clerk user ID
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

---

## Environment Variables Reference

### Frontend Client variables (`client/.env.local`)
| Variable | Description | Required |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Public publishable key for Clerk SDK | Yes |

### Backend Server variables (`server/.env`)
| Variable | Description | Required |
|---|---|---|
| `PORT` | Local port for server execution (defaults to 5000) | No |
| `DATABASE_URL` | PostgreSQL database connection string | Yes |
| `CLERK_PUBLISHABLE_KEY` | Public publishable key for Clerk SDK | Yes |
| `CLERK_SECRET_KEY` | Private secret key for Clerk SDK verification | Yes |

---

## Scripts Reference

### Client Scripts (`client/package.json`)
| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Starts local Vite client server |
| `npm run build` | `vite build` | Compiles frontend client code |
| `npm run preview` | `vite preview` | Serves client build locally |

### Server Scripts (`server/package.json`)
| Script | Command | Description |
|---|---|---|
| `npm run dev` | `tsx watch src/index.ts` | Starts tsx hot-reloading development server |
| `npm run build` | `tsc` | Compiles server TypeScript files |
| `npm run prisma:generate` | `prisma generate` | Generates local Prisma client |
| `npm run prisma:push` | `prisma db push` | Pushes schema changes directly to the PostgreSQL database |

---

## Testing

No testing framework or test scripts are currently configured.

### Current status

- Unit tests: Not configured
- Integration tests: Not configured
- E2E tests: Not configured
- Coverage: Not configured

### Suggested future setup

- Unit/Component: Vitest + React Testing Library
- E2E: Playwright

---

## Deployment

Current live URL: **https://flowway-pi.vercel.app/**

### Vercel deployment (recommended)

1. Push latest code to GitHub.
2. Import `RishavJbn/flowway` into Vercel.
3. Set **Root Directory** to `client`.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

### Production env vars

None currently required.

### CI/CD

No CI workflow is currently defined in the inspected files.  
If you add GitHub Actions later, document workflow paths under `.github/workflows/`.

---

## Folder-Level Configuration (Docker)

Docker configuration is not currently present (`Dockerfile`/`docker-compose.yml` not found).

If needed, add:
- `client/Dockerfile`
- `docker-compose.yml`

Then document build/run commands here.

---

## Contributing Guidelines

Contributions are welcome.

### Workflow

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Commit using conventional-style messages:
   - `feat: add node color presets`
   - `fix: resolve edge reconnect bug`
   - `docs: improve setup instructions`
4. Push branch and open a Pull Request.

### Code quality

- Run lint before PR:
  ```bash
  cd client
  npm run lint
  ```

No `CONTRIBUTING.md` file is currently present in the repository root.

---

## Roadmap

- [x] Interactive node canvas
- [x] Local persistence for graph state
- [x] Undo/redo
- [x] Keyboard shortcuts (delete selected node/connection)
- [x] Backend sync and Clerk auth integration
- [x] Sliding left sidebar board management workspace
- [ ] Export/import mind maps (JSON)
- [ ] Auto-layout options
- [ ] Mini-map and advanced navigation
- [ ] Collaboration mode (multi-user)

---

## FAQ / Troubleshooting

<details>
<summary><strong>Where is the database and how do I deploy the schema?</strong></summary>
The schema is managed by Prisma and stored in a PostgreSQL database (e.g. on Neon). To push the schema to your database, simply run <code>npm run prisma:push</code> inside the <code>server/</code> directory.
</details>

<details>
<summary><strong>Where is my data stored if I am not logged in?</strong></summary>
If you are logged out (or haven't set up the API keys yet), the app runs in Offline Mode and saves your diagrams locally inside your browser's <code>localStorage</code> under <code>flowway-nodes</code> and <code>flowway-edges</code>.
</details>

<details>
<summary><strong>Why is there no test command?</strong></summary>
Testing setup hasn’t been added yet. You can add Vitest/RTL and define a `test` script in `client/package.json`.
</details>

---

## License

This repository currently has **no license file configured** (`license: null` in repository metadata).

If you want open-source reuse, add a `LICENSE` file (e.g., MIT), then update this section.

---

## Contact / Acknowledgements

- **Maintainer:** [RishavJbn](https://github.com/RishavJbn)
- **Repository:** https://github.com/RishavJbn/flowway
- **Live Demo:** https://flowway-pi.vercel.app/

### Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [React Flow](https://reactflow.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/)
