# Coursework Tracker & GPA Calculator

A web-based grade tracking and GPA simulation tool for students, professors, academic advisors, and parents. Allows users to organize coursework by institution & semester, calculate course averages and cumulative GPAs, and simulate "what-if" grade outcomes against target goals. All without re-entering data.

**Live:** https://courseworkcalculator.mmjohn3601.workers.dev  
**Repository:** https://github.com/kenz95/courseworkcalculator

---

## Team: **CSCI 3300 — Software Engineering** Group Two

| Member | Primary Contributions |
|--------|----------------------|
| Mason Benton | Jira coordination; GPA calculation and target simulation logic; grade scaling editor; GPA simulation modal frontend |
| Mackenzie Johnson-Tucker | Backend and deployment infrastructure (Cloudflare Workers, Wrangler CLI, GitHub); React frontend framework; data models; search functionality; multi-institution support; import/export; integration |
| Adam Dulaney | Course average calculation; target grade simulation; grade conversion utility; GPA validation against academic formulas |
| Angie Garcia | Data storage schema; institution dashboard; automatic grade alerts; formatting and date/time utilities |

Full sprint history and task assignments tracked in Jira.

---

## Features

- **Multi-level organization:** Courses grouped into semesters, semesters optionally grouped into institutions, supporting students enrolled at multiple schools (dual enrollment, transfers)
- **Grade tracking:** Per-assignment grade entry with weighted percentages; automatic course average calculation with letter grade conversion
- **GPA calculation:** Weighted by credit hours; per-semester and cumulative; configurable per-institution grade scales
- **GPA Simulation:** Calculates the letter grades needed across all courses to reach a target semester GPA; flags impossible targets
- **Grade Outcome Simulation:** For a single course, calculates the score needed on remaining work to reach a target course grade; auto-fills from existing course data
- **Grade scale editor:** Per-semester grade scale customization (e.g. +/- vs. simple letter grades)
- **Search:** Real-time search across institutions, semesters, courses, and assignments with quick navigation to results
- **Data portability:** Export to JSON, TXT, or PDF; import from JSON for backup or device transfer
- **Browser-based persistence:** All data stored locally in `localStorage`; no login or cloud account required
- **Responsive design:** Adapts from desktop to phone with mobile-optimized navigation

---

## Architecture

The application uses a four-layer architecture adapted from Sommerville's generic web architecture (Sommerville, 2020, Figure 4.10), compacting his five-layer model where authentication and transaction management are not needed for a local-first application.

| Layer | Responsibility |
|-------|----------------|
| Presentation | React components for course/assignment entry, modals, dashboards, alerts |
| Application Logic | Grade calculation, GPA computation, weighted-value processing, simulation engines |
| Data Access | `localStorage` persistence, JSON import/export, schema migration |
| Utility Services | Grade conversion, formatting, search, shared cross-cutting helpers |

Full architectural justification with diagram references is in:  
*Assignment 5: Layered Architecture*

---

## Tech Stack

- **Frontend:** React 19, Vite, Lucide-style SVG icons
- **Backend:** Cloudflare Workers (serverless edge runtime)
- **Persistence:** Browser `localStorage` with versioned schema migrations
- **Deployment:** Wrangler CLI (Cloudflare's deployment tool)
- **Project Management:** Jira (Atlassian)

---

## Getting Started

### Local Development

> **Note:** Requires Node.js 18 or higher.

**1. Clone and install dependencies:**
```bash
git clone https://github.com/kenz95/courseworkcalculator.git
cd courseworkcalculator
npm install
cd frontend && npm install && cd ..
```

**2. Start the development server:**
```bash
cd frontend
npm run dev
```
Then open the URL shown in your terminal (typically `http://localhost:5173`) in your browser. The frontend will connect to the deployed Cloudflare Worker backend by default.

### Deployment

> **Note:** Requires a Cloudflare account and the Wrangler CLI (`npm install -g wrangler`).

**1. Authenticate with Cloudflare (one-time):**
```bash
npx wrangler login
```

**2. Build and deploy:**
```bash
npm run deploy
```
This builds the React frontend, copies the bundle to `public/`, and pushes the Worker to Cloudflare.

To run the Worker locally during development:
```bash
npx wrangler dev
```

---

## Project Structure

```
courseworkcalculator/
├── src/                          # Cloudflare Worker (backend)
│   ├── data/                     # Storage helpers
│   ├── logic/                    # Grade & simulation engines
│   ├── models/                   # Data model factories
│   └── utils/                    # Shared utilities
├── frontend/                     # React application
│   └── src/
│       ├── assets/               # SVG icons
│       ├── components/
│       │   ├── alerts/
│       │   ├── assignments/
│       │   ├── courses/
│       │   ├── folders/          # Semesters
│       │   ├── institutions/
│       │   ├── layout/           # Top nav dashboard
│       │   ├── search/
│       │   ├── settings/
│       │   └── simulation/       # GPA & Grade Outcome modals
│       ├── data/                 # localStorage manager
│       ├── logic/                # Grade calc, simulation, conversion
│       ├── models/               # Data model factories
│       ├── styles/               # Shared CSS
│       └── utils/                # Icon component
├── public/                       # Worker static assets (built frontend)
├── wrangler.toml                 # Cloudflare Worker config
└── package.json
```

---

## References

- Sommerville, I. (2020). *Engineering Software Products: An Introduction to Modern Software Engineering* (1st ed.). Pearson.
- Cloudflare Workers documentation — https://developers.cloudflare.com/workers/
- React documentation — https://react.dev/
- MDN Web Docs (`localStorage`, web APIs) — https://developer.mozilla.org/
- patterns.dev — Factory Pattern reference for data model design

---

## License

Default copyright: All rights reserved.

