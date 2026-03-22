# AlumAI — Emerald Intelligence Dashboard

> AI-powered industrial maintenance platform with automated Root Cause Analysis, real-time plant monitoring, and multi-agent ticket classification for aluminum manufacturing.

**Live Demo:** [alumai.vercel.app](https://alumai.vercel.app)
**Credentials:** `admin` / `Sai`

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Frontend Deep Dive](#frontend-deep-dive)
- [Backend Deep Dive](#backend-deep-dive)
- [AI Pipeline](#ai-pipeline)
- [Data Flow](#data-flow)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Asset Monitoring System](#asset-monitoring-system)
- [Plant Operations (SCADA KPIs)](#plant-operations-scada-kpis)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)
- [Getting Started](#getting-started)

---

## Overview

AlumAI is an end-to-end industrial maintenance intelligence platform built for the **DPW Aluminum Plant**. It processes maintenance tickets from multiple sources (ServiceNow, Microsoft Teams, Outlook), classifies them using AI, performs automated Root Cause Analysis, and monitors plant equipment health in real-time.

### What It Does

1. **Ticket Ingestion** — Upload Excel files containing maintenance tickets from ServiceNow, Teams, or Outlook
2. **AI Classification** — Single-call LLM analysis that classifies asset, system, severity, and performs RCA
3. **Root Cause Analysis** — Automated diagnosis with fix recommendations, confidence scoring, and escalation logic
4. **Plant Monitoring** — Real-time status map of 42 plant components across 4 production sections
5. **SCADA KPI Dashboard** — Drill-down into individual melters, holders, and casting pits with operational data
6. **Escalation Hub** — AI-assisted diagnostic chat for tickets requiring human investigation
7. **Human-in-the-Loop** — Every AI decision can be overridden, escalated, or accepted by operators

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│                        Deployed on Vercel                       │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  Login   │ │ Landing  │ │Dashboard │ │  Triage Center   │   │
│  │  (JWT)   │ │  Page    │ │ Mission  │ │  Upload Excel    │   │
│  └──────────┘ └──────────┘ │ Control  │ │  View Tickets    │   │
│                             └──────────┘ └──────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  RCA     │ │Escalation│ │  Asset   │ │ Plant Operations │   │
│  │  Report  │ │   Hub    │ │ Monitor  │ │  SCADA KPIs      │   │
│  │  Card    │ │  (Chat)  │ │ (Live)   │ │  (Drill-down)    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│                                                                 │
│  Services: api.js (Axios + JWT interceptor)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS (REST API)
                             │ Auto-detects localhost vs production
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI + Python)                   │
│                     Deployed on Render                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Routers (API Layer)                    │   │
│  │  /auth/login  /tickets/*  /ai/*  /assets/*  /assistant/* │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────┴───────────────────────────────┐   │
│  │                   Services (Business Logic)               │   │
│  │  TicketsService  AIPipelineService  AssistantService      │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────┴───────────────────────────────┐   │
│  │                    AI Agents Layer                         │   │
│  │  SingleCallAnalyzer (1 LLM call = full RCA)               │   │
│  │  AssistantAgent (diagnostic chat)                         │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────┐  ┌────────┴────────┐  ┌──────────────────┐   │
│  │  PostgreSQL  │  │   Groq API      │  │  JWT Auth        │   │
│  │  (Render)    │  │  (llama-3.3-70b)│  │  (python-jose)   │   │
│  └──────────────┘  └─────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations and transitions |
| Recharts | Charts and data visualization |
| Axios | HTTP client with JWT interceptor |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | Python web framework |
| SQLAlchemy | ORM for database operations |
| PostgreSQL | Persistent database (Render) |
| SQLite | Local development database |
| Groq API | LLM inference (llama-3.3-70b-versatile) |
| python-jose | JWT token generation and validation |
| Pandas | Excel file processing |
| OpenPyXL | Excel file reading |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting (auto-deploy from GitHub) |
| Render | Backend hosting + PostgreSQL database |
| GitHub | Source control and CI/CD trigger |

---

## Project Structure

```
AlumAi/
├── requirements.txt              # Python dependencies (root for Render)
├── .gitignore                    # Git ignore rules
│
├── backend/                      # FastAPI backend
│   ├── __init__.py               # Package init
│   ├── .env                      # Environment variables (local only)
│   ├── config.py                 # Pydantic settings (GROQ key, JWT, CORS)
│   ├── database.py               # SQLAlchemy engine, session, TicketModel
│   ├── main.py                   # FastAPI app factory, CORS, routers
│   │
│   ├── agents/                   # AI agent implementations
│   │   ├── __init__.py           # Exports SingleCallAnalyzer, AssistantAgent
│   │   └── ai_agents.py          # LLM call logic, prompt engineering
│   │
│   ├── routers/                  # API route handlers
│   │   ├── __init__.py           # Exports all routers
│   │   ├── auth.py               # /auth/login, /auth/me
│   │   ├── tickets.py            # /tickets/upload, /tickets/all, etc.
│   │   ├── ai.py                 # /ai/classify (triggers RCA pipeline)
│   │   ├── assets.py             # /assets/* (asset data endpoints)
│   │   └── assistant.py          # /assistant/chat (escalation chat)
│   │
│   ├── services/                 # Business logic layer
│   │   ├── tickets.py            # TicketsService (Excel parsing, CRUD)
│   │   ├── ai_pipeline.py        # AIPipelineService (orchestrates AI)
│   │   ├── ai.py                 # AIService (wrapper)
│   │   └── assistant.py          # AssistantService (chat with context)
│   │
│   ├── models/                   # Pydantic models for request/response
│   ├── utils/                    # Utility functions
│   └── data/                     # Uploaded Excel files (temporary)
│
└── frontend/                     # React frontend
    ├── package.json              # Node dependencies
    ├── vite.config.js            # Vite configuration
    ├── tailwind.config.js        # Tailwind configuration
    ├── postcss.config.js         # PostCSS configuration
    ├── index.html                # Entry HTML
    │
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Root component (routing, auth, theme)
        ├── index.css             # Global styles (CSS variables, glass, etc.)
        │
        ├── components/           # Reusable UI components
        │   ├── Sidebar.jsx       # Navigation sidebar (desktop + mobile)
        │   ├── TicketTable.jsx   # Sortable, filterable ticket table
        │   ├── RCAReportCard.jsx # AI analysis report modal
        │   ├── JarvisOverlay.jsx # AI processing animation overlay
        │   ├── ChatBubble.jsx    # Chat message bubble
        │   ├── SeverityPill.jsx  # Priority badge (Critical/High/etc.)
        │   ├── ConfidenceMeter.jsx # Circular confidence gauge
        │   ├── FileUpload.jsx    # Drag-and-drop file upload
        │   └── PageTransition.jsx # Page enter/exit animations
        │
        ├── pages/                # Page-level components
        │   ├── Login.jsx         # JWT authentication page
        │   ├── Landing.jsx       # "Enter Command Center" splash
        │   ├── Dashboard.jsx     # Mission Control (stats, charts)
        │   ├── Triage.jsx        # Source selection (ServiceNow/Teams/Outlook)
        │   ├── DataView.jsx      # Ticket table with RCA actions
        │   ├── Escalation.jsx    # AI diagnostic chat for escalated tickets
        │   ├── AssetMonitor.jsx  # DPW plant health map
        │   └── PlantOperations.jsx # SCADA KPI drill-down dashboard
        │
        ├── services/
        │   └── api.js            # Axios instance, all API calls, JWT handling
        │
        ├── hooks/                # Custom React hooks
        ├── layouts/              # Layout wrappers
        └── types/                # TypeScript-like type definitions
```

---

## Frontend Deep Dive

### Page-by-Page Breakdown

#### Login.jsx
Split-screen Apple-style login with scrolling marquee text, floating glass cards, and JWT authentication. Stores token in localStorage with 24-hour expiry.

#### Landing.jsx
Cinematic splash page with "Five intelligent agents. One unified command center." tagline. Five pillar cards (Intake, Triage, Classifier, RCA Engine, Assistant) with hover animations.

#### Dashboard.jsx (Mission Control)
Real-time stats with animated counters, AI confidence area chart (Recharts), severity donut chart, and recent activity table. Auto-refreshes every 30 seconds.

#### Triage.jsx
Three source cards (ServiceNow, Teams, Outlook) with drag-and-drop Excel upload. Each source has a unique color and glow effect.

#### DataView.jsx
Full-featured ticket table with search, sort, filter by severity/status, pagination. Each ticket has an "RCA" button that triggers AI classification.

#### AssetMonitor.jsx
**42 hardcoded DPW plant components** across 4 sections:
- Ingot Casting (8 melters, 8 holders, 5 casting pits, 3 support systems)
- Plate (6 components)
- Rolling (7 components)
- Sheet Finishing (5 components)

Status colors driven by ticket data:
- Green = Online (no active tickets)
- Amber = Pending (unclassified tickets exist)
- Red = Fault (escalated tickets)

Features dot matrix overview with bordered grid + detailed section cards with side panel on click.

#### PlantOperations.jsx
SCADA-style KPI dashboard with cascading dropdowns:
DPW Plant → Ingot Casting → Melters/Holders/Casting Pits → Individual units

Each unit card shows hardcoded operational data (temperatures, charge weights, cycle times) plus real ticket data from the backend.

#### Escalation.jsx
Split-panel: escalated ticket list (left) + AI diagnostic chat (right). On mobile, ticket list and chat are full-screen views with back navigation. "Finalize RCA" button resolves tickets with confetti animation.

### Key Components

#### RCAReportCard.jsx
Full-screen modal showing AI analysis results:
- Pipeline steps (Intake → Classify → RCA → Auditor) with animation
- Problem statement (original ticket description)
- Classification metadata (Asset, System, Status)
- Root cause analysis text
- Numbered fix steps
- Confidence meter (circular gauge)
- Accept/Override buttons

#### Sidebar.jsx
Collapsible navigation with:
- Mission Control, Triage Center, Escalation Hub, Asset Monitor, Plant Operations
- Escalation badge counter (live)
- Theme toggle (dark/light)
- Sign out button
- User profile card
- Mobile: hidden by default, slides in as overlay

#### api.js (Services)
Axios instance with:
- Auto-detect localhost vs production URL
- JWT token interceptor (adds Authorization header)
- Auth expiry handler (dispatches custom event)
- All API functions: login, upload, classify, escalate, finalize, chat, etc.

---

## Backend Deep Dive

### Startup Flow
1. `main.py` → `create_app()` initializes FastAPI
2. `database.py` → `init_db()` creates tables via SQLAlchemy
3. CORS middleware configured with exact Vercel URLs
4. All routers registered (auth, tickets, ai, assets, assistant)

### AI Agents (ai_agents.py)

#### SingleCallAnalyzer
One LLM call does everything — classification, RCA, and confidence scoring.

**Prompt structure:**
```
You are an industrial maintenance AI. Analyze this ticket:
Description: [ticket description]

Return JSON with:
- clean_description: Cleaned version
- asset: Physical equipment identified
- system: System category (Thermal/Hydraulic/etc.)
- severity: Critical/High/Medium/Low
- summary: Brief finding
- root_cause: Detailed root cause
- fix: Numbered repair steps
- confidence_score: 0.0 to 1.0
- escalate: true/false
```

**JSON Cleaning:** Aggressive extraction — strips markdown, finds `{` to `}`, handles malformed responses. Fallback uses actual ticket data if parsing fails.

#### AssistantAgent
Diagnostic chat for escalated tickets. Maintains conversation history, uses ticket context for informed responses.

### Services Layer

#### TicketsService
- Reads Excel columns: source, priority, asset_name, location, description, reported_by, created_at, status
- CRUD operations on SQLAlchemy TicketModel
- Filters by source, status, classification state

#### AIPipelineService
- Orchestrates SingleCallAnalyzer
- Saves results to database
- Sets ticket status based on AI decision (Resolved or Escalated)

#### AssistantService
- Wraps AssistantAgent with database integration
- Saves chat history to ticket record
- Provides context from RCA analysis

---

## AI Pipeline

```
Ticket Upload (Excel)
     │
     ▼
[TicketsService] Parse Excel → Store in PostgreSQL
     │
     ▼ (User clicks "RCA" button)
     │
[AIPipelineService] → [SingleCallAnalyzer]
     │                        │
     │                   ┌────┴────┐
     │                   │ Groq API │
     │                   │llama-3.3 │
     │                   │ -70b     │
     │                   └────┬────┘
     │                        │
     │              JSON Response:
     │              - asset, system, severity
     │              - root_cause, fix steps
     │              - confidence_score
     │              - escalate (true/false)
     │                        │
     ▼                        ▼
┌─────────────────────────────────┐
│       Confidence Check          │
│  confidence >= 0.7 → Resolved   │
│  confidence < 0.7  → Escalated  │
│  or AI says escalate → Escalated│
└──────────┬──────────────────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
 [Resolved]   [Escalated]
 RCA Report   → Escalation Hub
 Accept/       AI Diagnostic Chat
 Override      → Finalize RCA
```

---

## Database Schema

```
TicketModel (PostgreSQL)
├── id              INTEGER     Primary Key, Auto-increment
├── source          VARCHAR     "ServiceNow" | "Teams" | "Outlook"
├── description     TEXT        Original ticket description
├── priority        VARCHAR     From Excel: "Critical" | "High" | "Medium" | "Low"
├── asset_name      VARCHAR     From Excel: "Melter-3", "Hot Rolling Mill", etc.
├── location        VARCHAR     From Excel: "Ingot Casting - Melter Bay"
├── reported_by     VARCHAR     From Excel: Reporter name
├── created_at      VARCHAR     From Excel: Date string
├── asset           VARCHAR     AI-classified: Physical asset name
├── system          VARCHAR     AI-classified: "Thermal" | "Hydraulic" | etc.
├── severity        VARCHAR     AI-classified: Severity level
├── clean_description TEXT      AI-cleaned description
├── rca_analysis    JSON        Full AI analysis (root_cause, fix, summary)
├── is_classified   BOOLEAN     True after AI processes the ticket
├── status          VARCHAR     "Open" | "In Progress" | "Resolved" | "Escalated"
├── confidence_score FLOAT      AI confidence 0.0 - 1.0
└── chat_history    JSON        Escalation chat messages array
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login with username/password, returns JWT |
| GET | `/auth/me` | Get current user from JWT token |

### Tickets
| Method | Endpoint | Description |
|---|---|---|
| POST | `/tickets/upload` | Upload Excel file, parse and store tickets |
| GET | `/tickets/all` | Get all tickets with stats |
| GET | `/tickets/{id}` | Get single ticket by ID |
| GET | `/tickets/escalated` | Get all escalated tickets |

### AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/classify` | Run AI classification + RCA on a ticket |
| POST | `/ai/escalate/{id}` | Manually escalate a ticket |
| POST | `/ai/finalize/{id}` | Mark escalated ticket as resolved |

### Assistant
| Method | Endpoint | Description |
|---|---|---|
| POST | `/assistant/chat` | Send message in escalation diagnostic chat |

### System
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check endpoint |

---

## Authentication

JWT-based authentication with 24-hour token expiry.

**Flow:**
1. User enters username/password on Login page
2. Frontend POSTs to `/auth/login`
3. Backend validates against `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars
4. Returns JWT token signed with `SECRET_KEY`
5. Frontend stores token in `localStorage` as `alumai-token`
6. Every API request includes `Authorization: Bearer <token>` header
7. Backend validates token on protected endpoints
8. On expiry, frontend dispatches `auth-expired` event → redirects to login

---

## Asset Monitoring System

### How Status Is Determined

The Asset Monitor page shows 42 DPW plant components with color-coded status. The status is determined by matching ticket data to plant components using fuzzy matching.

**Matching Logic (matchAsset function):**
1. Exact match: "Melter-3" === "Melter-3"
2. Case-insensitive: "melter-3" matches "Melter-3"
3. Partial contains: "Melter-3 burner" matches "Melter-3"
4. Normalized: "Melter 3" matches "Melter-3" (removes dashes/spaces)

**Status Rules:**
| Ticket State | Monitor Color |
|---|---|
| No tickets or all resolved | Green (Online) |
| Open / In Progress / Awaiting Parts / Scheduled | Amber (Pending) |
| Classified + Escalated | Red (Fault) |
| Classified + Pending Review | Amber (Pending) |
| Resolved | Green (Online) |

**Auto-refresh:** Every 30 seconds via `setInterval`.

---

## Plant Operations (SCADA KPIs)

### Current Implementation
Hardcoded operational data simulating SCADA/DCS sensor readings:

**Melters (8 units):** Bath Temperature, Flue Temperature, Charge Weight, Charge Number, Sample Grade, Cycle Time, Cycle Step (Charge → Melt → Skim → Heat → Transfer)

**Holders (8 units):** Bath Temperature, Flue Temperature, Sample Grade, Taps Taken, Last Tap Time

**Casting Pits (5 units):** Bath Temperature, Cast Number, Cast Alloy, Cast Speed, Cast Length, Time Remaining, BCT

**Ticket Integration:** Each KPI card also shows live ticket count and worst severity from the actual backend data.

### Future: Real SCADA Integration
In production, this data would come from:
- **OPC-UA** protocol connecting to PLCs (Allen-Bradley, Siemens)
- **Modbus TCP/IP** for legacy equipment
- **MQTT** broker for IoT sensors
- **Historian databases** (OSIsoft PI, Wonderware)

---

## Deployment

### Backend (Render)
- **URL:** `https://alumai-backend-ra3y.onrender.com`
- **Runtime:** Python 3.14
- **Build:** `pip install -r requirements.txt`
- **Start:** `python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Database:** PostgreSQL (Render free tier, persistent)
- **Environment Variables:** GROQ_API_KEY, SECRET_KEY, ADMIN_USERNAME, ADMIN_PASSWORD, DATABASE_URL

### Frontend (Vercel)
- **URL:** `https://alumai.vercel.app`
- **Framework:** Vite (auto-detected)
- **Root Directory:** `frontend`
- **Build:** `npm run build` (auto)
- **Output:** `dist` (auto)

### API URL Detection
```javascript
// frontend/src/services/api.js
baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000'
  : 'https://alumai-backend-ra3y.onrender.com',
```

---

## Future Roadmap

### Phase 1: Data Intelligence
- **RAG (Retrieval Augmented Generation)** — AI learns from past RCA reports to improve future diagnoses
- **Similar Ticket Detection** — When a new ticket comes in, show similar past tickets and their resolutions
- **Trend Analysis** — Track recurring issues per asset over time

### Phase 2: Real-Time Integration
- **OPC-UA / Modbus Integration** — Connect to real PLCs for live sensor data
- **MQTT Broker** — IoT sensor data streaming
- **WebSocket Updates** — Real-time push updates instead of polling
- **Historian Database** — Time-series storage for sensor data (InfluxDB / TimescaleDB)

### Phase 3: Advanced AI
- **Multi-Model Ensemble** — Use multiple LLMs and vote on classification
- **Computer Vision** — Analyze equipment photos for visual defect detection
- **Predictive Maintenance** — ML models predicting failures before they happen
- **Natural Language Queries** — "Show me all melter issues from last month"

### Phase 4: Enterprise
- **Role-Based Access Control** — Different permissions for operators, engineers, managers
- **SSO Integration** — SAML/OAuth with corporate identity providers
- **Audit Trail** — Complete history of every action taken on every ticket
- **Multi-Plant Support** — Manage multiple plant locations from one dashboard
- **Mobile App** — Native iOS/Android app for field technicians
- **Email/SMS Alerts** — Automated notifications for critical escalations
- **API Webhooks** — Integration with ServiceNow, Jira, SAP

### APIs for Future Integration
| API / Protocol | Purpose |
|---|---|
| OPC-UA | Real-time PLC data (temperatures, pressures, speeds) |
| Modbus TCP/IP | Legacy equipment sensor data |
| MQTT | IoT sensor streaming |
| ServiceNow API | Bi-directional ticket sync |
| Microsoft Graph API | Teams/Outlook message ingestion |
| OSIsoft PI Web API | Historian data retrieval |
| SAP PM API | Enterprise maintenance management |
| Twilio API | SMS alerts for critical escalations |
| SendGrid API | Email notifications |
| Firebase Cloud Messaging | Push notifications for mobile app |

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Local Development

**Backend:**
```bash
# Create .env file in backend/
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Sai

# Install dependencies
pip install -r requirements.txt

# Run backend
python -m uvicorn backend.main:app --reload
# Runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Deploy Your Own

1. Push to GitHub
2. **Render:** New Web Service → connect repo → Python 3 → set env vars → deploy
3. **Render:** New PostgreSQL → copy Internal Database URL → add as `DATABASE_URL` env var
4. **Vercel:** New Project → connect repo → set root directory to `frontend` → deploy
5. Update `api.js` with your Render URL

---

## License

This project was built by **Sai** with AI assistance. All rights reserved.

---

*Built with passion for industrial intelligence. Five agents. One command center.*