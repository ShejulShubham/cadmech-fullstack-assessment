<div align="center">

# 🏭 CADMech Full Stack Developer Assessment

### SmartLab Equipment Manager

**Technical Round 1** — Full Stack Development Assessment  
**Company:** Cadmech Engineering Pvt. Ltd., Pune  
**Role:** Full Stack Developer (1–3 years experience)

---

</div>

## 📋 About This Assessment

Build a **SmartLab Equipment Manager** — a full-stack web application that helps lab administrators manage laboratory equipment, monitor sensor health, and make data-driven maintenance decisions.

This assessment is designed to test your core full-stack development skills: frontend UI design, responsive layouts, API development, database interaction, and application deployment.

> **⏰ Time Limit:** 5 days from the date you receive this assessment.  
> **🤖 AI Usage:** Allowed and encouraged — but you **must understand every line** of your code. You will be asked to explain it.

---

## 🎯 Assessment Requirements

Build a complete equipment management system with these features:

### Core Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Dashboard** | Summary cards: total equipment, active count, under maintenance, decommissioned |
| 2 | **Equipment List** | Table/grid showing all equipment with details |
| 3 | **Add Equipment** | Form with validation (name, type, status, location, serial number, description) |
| 4 | **Edit Equipment** | Pre-filled form, update functionality |
| 5 | **Delete Equipment** | Confirmation dialog before deletion |
| 6 | **Search & Filter** | Search by name + filter by type and/or status |
| 7 | **Responsive Design** | Works on desktop (1920px) and mobile (375px) |

### Equipment Types

`CNC Machine` · `IoT Sensor` · `Automation Trainer` · `PLC Module` · `Hydraulic System` · `Pneumatic System` · `Electrical Panel`

### Equipment Status

- ✅ **Active** — Currently operational
- 🔧 **Under Maintenance** — Temporarily offline
- ❌ **Decommissioned** — No longer in use

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/equipment` | List all (supports `?search=`, `?type=`, `?status=`) |
| `GET` | `/api/equipment/:id` | Get single item |
| `POST` | `/api/equipment` | Create new (validate required fields) |
| `PUT` | `/api/equipment/:id` | Update existing |
| `DELETE` | `/api/equipment/:id` | Delete item |
| `GET` | `/api/stats` | Dashboard statistics |

---

## 🛠️ Tech Stack

| Layer | Technology | Notes |
|--------|-----------|-------|
| **Frontend** | React.js (Vite) | Starter provided in `/frontend` |
| **Backend** | Node.js + Express | Starter provided in `/backend` |
| **Database** | MySQL / PostgreSQL / SQLite | Your choice. Schema in `/backend/db/schema.sql` |
| **Deployment** | GitHub Pages + Render/Railway | Free tier acceptable |

---

## 📁 Project Structure

```
├── frontend/               # React + Vite starter
│   ├── src/
│   │   ├── App.jsx         # Start here
│   │   └── components/     # Your components
│   └── package.json
│
├── backend/                # Node.js + Express starter
│   ├── server.js           # Entry point
│   ├── routes/api.js       # API routes (scaffolded)
│   ├── db/schema.sql       # Database schema
│   └── package.json
│
├── SUBMISSION.md           # ← Fill this before submitting
└── GITHUB-WORKFLOW-GUIDE.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ · Git · GitHub account · SQL database (SQLite is easiest)

### Setup

```bash
# 1. Fork this repo, then clone your fork
git clone https://github.com/YOUR-USERNAME/cadmech-fullstack-assessment.git
cd cadmech-fullstack-assessment

# 2. Start frontend
cd frontend && npm install && npm run dev
# → http://localhost:5173

# 3. Start backend (in a new terminal)
cd backend && npm install && cp .env.example .env && node server.js
# → http://localhost:5000
```

### Deployment

- **Frontend →** GitHub Pages (see [GITHUB-WORKFLOW-GUIDE.md](./GITHUB-WORKFLOW-GUIDE.md))
- **Backend →** [Render](https://render.com) or [Railway](https://railway.app) (free tier)

---

## 📝 Submission Requirements

Reply to the assessment email with:

| # | Requirement |
|---|-------------|
| 1 | **GitHub Repository Link** — Your forked repo |
| 2 | **Live Frontend URL** — GitHub Pages |
| 3 | **Live Backend URL** — Render / Railway |
| 4 | **Completed SUBMISSION.md** |

---

## ⚖️ Evaluation Criteria

| Category | Points |
|----------|--------|
| CRUD Functionality | 40 |
| API Design & Error Handling | 25 |
| UI/UX & Responsive Design | 25 |
| Deployment (FE + BE live) | 10 |
| **Total** | **100** |

### What We're Really Testing

Beyond code, we evaluate:

- 🧠 **Problem-solving** — How do you approach building full-stack components?
- 📝 **Communication** — Can you document your decisions clearly?
- 🔍 **Attention to detail** — Edge cases, error handling, validation
- 📈 **Growth mindset** — Your commit history tells a story

---

## ❓ Questions?

- **Email:** mktg@cadmech.co.in / akash.virdhe@cadmech.co.in
- **Response time:** Within 24 hours on business days

---

## ⏰ Deadline

**5 days** from the date you received the assessment email.  
Late submissions will not be evaluated.

---

<div align="center">

**Cadmech Engineering Pvt. Ltd.** — Transforming Engineering Education 🚀  
Pune, India

</div>
