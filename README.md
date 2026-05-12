<div align="center">

# 🩺 VitalGuard AI
### Advanced ML-Powered Health Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![NeonDB](https://img.shields.io/badge/Database-NeonDB-green.svg)](https://db.com)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow.svg)](https://python.org)

**VitalGuard AI** is a full-stack health monitoring platform that uses machine learning and AI to analyze symptoms, predict diseases, monitor vitals, and interpret lab reports — all in real time.

[Live Demo](#) • [Report Bug](https://github.com/Sne-04/VitalGuard/issues) • [Request Feature](https://github.com/Sne-04/VitalGuard/issues)

</div>

---

## ✨ Features

- 🤖 **AI Symptom Checker** — ML-powered disease prediction with confidence scores
- 📊 **Severity Analysis** — Risk timeline and triage recommendations
- 💓 **IoT Vitals Monitoring** — Track heart rate, SpO₂, temperature, blood pressure
- 🔬 **Lab Report Analysis** — Upload PDFs and get AI-powered plain-English explanations (Claude AI)
- 🖼️ **Image AI** — Skin/medical image condition detection
- 📈 **Analytics Dashboard** — Historical trends, disease distribution charts
- 🔒 **Secure Authentication** — JWT-based auth with bcrypt password hashing
- 🗄️ **NeonDB Backend** — PostgreSQL database with Row Level Security

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────────┐      ┌───────────────┐
│   React Frontend│ ───► │  Express.js Backend   │ ───► │   NeonDB    │
│   (Vite, :3039) │      │  (Node.js, :5002)     │      │  (PostgreSQL) │
└─────────────────┘      └──────────────────────┘      └───────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    ML API (Flask)     │
                         │  (Python, :5001)      │
                         │  disease_predictor    │
                         │  severity_classifier  │
                         └──────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- A [NeonDB](https://db.com) account

### 1. Clone the Repository

```bash
git clone https://github.com/Sne-04/VitalGuard.git
cd VitalGuard
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5002
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here

# NeonDB
SUPABASE_URL=https://your-project-ref.db.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here

# ML API
ML_API_URL=http://127.0.0.1:5001

# Claude AI (for lab reports)
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 3. Set Up NeonDB Tables

1. Go to your [NeonDB SQL Editor](https://db.com/dashboard/project/_/sql/new)
2. Run the SQL from `ml-models/schema.sql` (creates all 5 tables)

### 4. Set Up the ML API

```bash
cd ml-models
pip install -r requirements.txt
# Train the models (first time only)
python src/train_all.py
```

### 5. Start All Services

**Terminal 1 – ML API:**
```bash
cd backend/services
python3 ml_api.py
```

**Terminal 2 – Backend API:**
```bash
cd backend
npm run dev
```

**Terminal 3 – Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3039** 🎉

### Demo Login
| Field | Value |
|-------|-------|
| Email | `snehashaw1525@gmail.com` |
| Password | `sneha25` |

---

## 📁 Project Structure

```
VitalGuard/
├── backend/                  # Express.js API Server
│   ├── config/
│   │   └── db.js       # NeonDB client
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── routes/
│   │   ├── auth.js           # Register / Login / Me
│   │   ├── prediction.js     # Disease prediction
│   │   ├── vitals.js         # IoT vitals
│   │   ├── imageAnalysis.js  # Image AI
│   │   ├── lab.js            # Lab report analysis
│   │   └── analytics.js      # Dashboard analytics
│   ├── services/
│   │   ├── ml_api.py         # Flask ML microservice
│   │   └── claudeService.js  # Anthropic Claude integration
│   └── server.js
│
├── frontend/                 # React + Vite Frontend
│   └── src/
│       ├── pages/
│       │   ├── SymptomChecker.jsx
│       │   ├── Results.jsx
│       │   ├── Dashboard.jsx
│       │   └── ...
│       ├── context/AuthContext.jsx
│       └── services/api.js
│
└── ml-models/                # ML Training Pipeline
    ├── src/
    │   └── train_all.py
    ├── models/               # Trained .pkl files
    └── requirements.txt
```

---

## 🗄️ Database Schema (NeonDB)

| Table | Description |
|-------|-------------|
| `users` | User accounts with medical history |
| `predictions` | Disease predictions with JSONB disease/severity data |
| `vitals` | IoT sensor readings (heart rate, SpO₂, temperature) |
| `image_analyses` | Medical image analysis results |
| `lab_reports` | PDF lab report analysis results |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Recharts, Lucide Icons |
| Backend | Node.js, Express.js, JWT, bcryptjs |
| Database | NeonDB (PostgreSQL) |
| ML API | Python, Flask, scikit-learn |
| AI | Anthropic Claude 3.5 Sonnet |
| Styling | CSS Modules / Vanilla CSS |

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Sne-04">Sne-04</a>
</div>
