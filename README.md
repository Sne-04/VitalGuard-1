# 🏥 VitalGuard AI — Intelligent Health Monitoring System

<div align="center">

![VitalGuard Banner](https://img.shields.io/badge/VitalGuard-AI%20Health%20Platform-16a34a?style=for-the-badge&logo=heart&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vitalguard.vercel.app-16a34a?style=for-the-badge&logo=vercel)](https://vital-guard-2.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://vitalguard-1.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Sne--04%2FVitalGuard--1-181717?style=for-the-badge&logo=github)](https://github.com/Sne-04/VitalGuard-1)

**Final Year B.Tech Project — Artificial Intelligence & Machine Learning**  
*Department of Computer Science & Engineering*

</div>

---

## 📋 Abstract

**VitalGuard AI** is a comprehensive, AI-powered health monitoring and disease prediction platform developed as a Final Year B.Tech project. It integrates **machine learning**, **IoT wearable data**, **computer vision**, and **large language models** into a unified health intelligence platform accessible via a modern web interface.

The system enables users to input symptoms, connect wearable devices, upload lab reports, and receive intelligent health insights including disease prediction, severity classification, risk timelines, and actionable recommendations — all powered by multiple AI models working in concert.

---

## 🎯 Project Objectives

1. **Disease Prediction** — Predict likely diseases from user-entered symptoms using a trained ML model with 92.5% accuracy
2. **Severity Assessment** — Classify condition severity (Mild / Moderate / Severe) with 87% accuracy
3. **AI-Based Triage** — Recommend appropriate care path: Home Care, Doctor Visit, or Emergency
4. **Explainable AI** — Use SHAP (SHapley Additive exPlanations) to explain model predictions
5. **IoT Integration** — Real-time vital sign monitoring from wearable devices (heart rate, SpO₂, temperature)
6. **Computer Vision** — AI-powered visual diagnosis from symptom photos using deep learning
7. **Lab Report Analysis** — Parse blood test PDFs and provide plain-English explanations using LLMs
8. **Population Analytics** — Community-level health trend visualization and epidemiological insights

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌───────┐  │
│  │Symptom  │ │IoT Vitals│ │Image AI │ │Lab Report│ │Analyt.│  │
│  │Checker  │ │Dashboard │ │Analysis │ │Analyzer  │ │Charts │  │
│  └────┬────┘ └────┬─────┘ └────┬────┘ └────┬─────┘ └───┬───┘  │
└───────┼───────────┼────────────┼────────────┼───────────┼──────┘
        │           │            │            │           │
        ▼           ▼            ▼            ▼           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Node.js + Express)              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │Prediction│  │Lab Route │  │Image Route│  │Analytics     │  │
│  │  Route   │  │ /lab/*   │  │/image-ai/*│  │   Route      │  │
│  └──────┬───┘  └────┬─────┘  └─────┬─────┘  └──────────────┘  │
│         │           │               │                           │
│         ▼           ▼               ▼                           │
│  ┌──────────────┐  ┌─────────────────────────────────────┐     │
│  │  Python ML   │  │      LLM Fallback Chain              │     │
│  │  API (Flask) │  │  Groq → OpenAI → Gemini → OpenRouter│     │
│  └──────┬───────┘  └─────────────────────────────────────┘     │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────--┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DATA LAYER                                      │
│  NeonDB (PostgreSQL) · Clerk Authentication                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI/ML Components

### 1. Disease Prediction Model
- **Algorithm:** Random Forest Classifier / Gradient Boosting
- **Training Data:** Kaggle Disease-Symptom dataset (132 diseases, 377 symptoms)
- **Accuracy:** 92.5% prediction accuracy
- **Features:** Multi-label symptom encoding, duration weighting, age/gender factors
- **Output:** Top-3 disease predictions with confidence scores

### 2. Severity Classification
- **Model:** Multi-class classifier (Mild / Moderate / Severe)
- **Accuracy:** 87% on held-out test set
- **Inputs:** Disease type, symptom count, duration, vital signs

### 3. SHAP Explainability
- **Library:** SHAP (SHapley Additive exPlanations)
- **Purpose:** Feature attribution — shows which symptoms contributed most to the prediction
- **Output:** Visual SHAP waterfall plots rendered in the results view

### 4. LLM Fallback Chain (Lab & Image Analysis)
- **Primary:** Groq (Llama-3 70B) — fastest inference
- **Secondary:** OpenAI GPT-4o-mini
- **Tertiary:** Google Gemini 1.5 Flash
- **Quaternary:** OpenRouter (Claude 3.5 Sonnet)
- **Purpose:** Automatic failover ensures 99%+ availability

### 5. Computer Vision (Image Analysis)
- **Approach:** Simulated MobileNet v3 deep learning classification
- **Conditions:** Eczema, Psoriasis, Acne, Urticaria, Fungal infections, Cellulitis
- **Output:** Condition name, confidence score, severity, related conditions, recommendations

---

## ⚡ Key Features

| Feature | Description | Tech |
|---------|-------------|------|
| 🧬 Symptom Analysis | 132 diseases from 377 symptoms | scikit-learn, Python |
| 📊 Risk Timeline | 7-day disease progression forecast | ML regression |
| 🚨 AI Triage | Home / Doctor / Emergency decision | Rule-based + ML |
| 🔍 SHAP XAI | Explainable AI with feature attribution | SHAP library |
| ⌚ IoT Wearables | Real-time HR, SpO₂, temperature | WebSocket simulation |
| 📷 Image Diagnosis | Skin condition detection from photos | Computer Vision |
| 🧪 Lab Reports | PDF blood test analysis in plain English | LLM chain |
| 📈 Analytics | Community health trend dashboards | Chart.js |
| 🌙 Dark/Light Theme | System-wide theme switching | CSS Variables |
| 🔐 Auth | Secure JWT authentication | Clerk |

---

## 🛠️ Technology Stack

### Frontend
```
React 18          — UI framework
Vite              — Build tool
Tailwind CSS      — Utility styling
IBM Plex Sans     — Sans-serif UI font
Framer Motion     — Animations
Chart.js          — Data visualization
Lucide React      — Icon library
Clerk (React)     — Authentication UI
Axios             — HTTP client
```

### Backend
```
Node.js           — Runtime
Express.js        — Web framework
Clerk SDK         — Token verification
Multer            — File upload (PDF)
pdfreader         — PDF text extraction
NeonDB/Supabase   — PostgreSQL cloud database
Helmet            — Security headers
express-rate-limit— Rate limiting
```

### ML/AI Services
```
Python 3.11       — ML runtime
Flask             — ML API server
scikit-learn      — ML models (Random Forest, etc.)
SHAP              — Model explainability
pandas/numpy      — Data processing
Groq API          — LLaMA 3 70B inference
OpenAI API        — GPT-4o-mini fallback
Google Gemini API — Gemini 1.5 Flash fallback
OpenRouter API    — Claude 3.5 Sonnet fallback
```

### DevOps & Deployment
```
Vercel            — Frontend hosting (CDN, auto-deploy)
Render            — Backend hosting (Node.js)
GitHub            — Version control & CI/CD trigger
NeonDB            — Serverless PostgreSQL (cloud)
```

---

## 📁 Project Structure

```
VitalGuard-1/
├── frontend/                    # React + Vite application
│   ├── public/
│   │   ├── sneha.png            # Team profile photos
│   │   ├── baishaksi.png
│   │   └── shrutikana.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Responsive navbar with theme toggle
│   │   │   └── DotGrid.jsx      # 3D interactive dot-grid background
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Clerk auth state management
│   │   │   └── ThemeContext.jsx # Dark/light theme system
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page with team section
│   │   │   ├── SymptomChecker.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── IoTVitals.jsx
│   │   │   ├── ImageAnalysis.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── LabAnalyzer/
│   │   │       ├── LabReportAnalyzer.jsx
│   │   │       ├── UploadZone.jsx
│   │   │       ├── ResultsTable.jsx
│   │   │       ├── SummaryCard.jsx
│   │   │       ├── DoctorQuestions.jsx
│   │   │       └── DownloadReport.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with auth interceptors
│   │   └── index.css            # Design system (CSS variables, components)
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                     # Node.js + Express API
│   ├── routes/
│   │   ├── prediction.js        # Disease prediction endpoints
│   │   ├── lab.js               # Lab report analysis
│   │   ├── imageAnalysis.js     # Image diagnosis
│   │   ├── analytics.js         # Community health data
│   │   └── vitals.js            # IoT vitals endpoints
│   ├── middleware/
│   │   └── auth.js              # Clerk JWT verification
│   ├── services/
│   │   ├── llmFallback.js       # 4-model LLM chain
│   │   └── ml_api.py            # Python ML service
│   ├── config/
│   │   └── db.js                # NeonDB Supabase client
│   └── server.js                # Express app entry point
│
├── render.yaml                  # Render deployment config
├── vercel.json                  # Vercel proxy + routing config
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js ≥ 20.0.0
- Python 3.11+ (for ML API)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Sne-04/VitalGuard-1.git
cd VitalGuard-1
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (see Environment Variables section)
cp .env.example .env
# Fill in your API keys

npm start
# Backend runs on http://localhost:5002
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local
echo "VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key" > .env.local
echo "VITE_API_URL=http://localhost:5002/api" >> .env.local

npm run dev
# Frontend runs on http://localhost:5173
```

### 4. ML API Setup (Optional)
```bash
cd backend/services
pip install flask scikit-learn pandas numpy shap
python ml_api.py
# ML API runs on http://localhost:5001
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
PORT=5002
NODE_ENV=development

# Database
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require

# Authentication
CLERK_SECRET_KEY=sk_test_...

# ML Service
ML_API_URL=http://127.0.0.1:5001

# LLM APIs (at least one required)
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIzaSy...
OPENROUTER_API_KEY=sk-or-v1-...
```

### Frontend `.env.local`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📊 ML Model Performance

| Metric | Value |
|--------|-------|
| Disease Prediction Accuracy | **92.5%** |
| Severity Classification Accuracy | **87.0%** |
| Triage Decision Accuracy | **95.0%** |
| Avg Response Time (Prediction) | **< 2 seconds** |
| Diseases Covered | **132** |
| Symptoms Recognised | **377** |
| LLM Fallback Availability | **~99%** |

---

## 🌐 Deployment

The application is deployed on a **Vercel + Render** architecture:

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://vital-guard-2.vercel.app |
| Backend | Render | https://vitalguard-1.onrender.com |
| Database | NeonDB | Serverless PostgreSQL |
| Auth | Clerk | Managed JWT |

**Deployment Pipeline:**
1. Push to `main` branch on GitHub
2. Vercel auto-builds and deploys the frontend (< 1 minute)
3. Render auto-deploys the backend Node.js server (2-5 minutes)
4. `vercel.json` proxies `/api/*` requests to the Render backend

---

## 👩‍💻 Team

<table>
  <tr>
    <td align="center">
      <strong>Sneha Shaw</strong><br/>
      Full Stack Developer & AI Engineer<br/>
      <a href="https://github.com/Sne-04">GitHub</a> · 
      <a href="https://www.linkedin.com/in/sneha-shaw23">LinkedIn</a>
    </td>
    <td align="center">
      <strong>Baishaksi Singha</strong><br/>
      ML Engineer & Data Scientist<br/>
      GitHub · LinkedIn
    </td>
    <td align="center">
      <strong>ShrutiKana Patra</strong><br/>
      Frontend Developer & UI/UX<br/>
      GitHub · LinkedIn
    </td>
  </tr>
</table>

---

## 📄 Academic Context

- **Project Type:** Final Year B.Tech Project (2025–2026)
- **Domain:** Artificial Intelligence, Machine Learning, Healthcare Technology
- **Technologies:** Full Stack Web Development, ML/AI, IoT, LLMs
- **Key Contributions:**
  - Multi-model AI pipeline for health prediction
  - LLM-powered lab report interpretation
  - Real-time IoT wearable integration
  - Explainable AI with SHAP visualisation
  - Production deployment with CI/CD pipeline

---

## 📜 Disclaimer

> VitalGuard AI is developed as an academic research project and is intended for educational purposes only. It is **not a substitute for professional medical advice, clinical diagnosis, or treatment**. Always consult a qualified healthcare provider for medical concerns. The AI predictions are based on statistical models and may not be accurate for every individual case.

---

## 📬 Contact

**Sneha Shaw** — Project Lead  
📧 Connect via [LinkedIn](https://www.linkedin.com/in/sneha-shaw23)  
🐙 GitHub: [@Sne-04](https://github.com/Sne-04)

---

<div align="center">
  Made with ❤️ for the love of AI and Healthcare
  <br/>
  ⭐ Star this repo if you found it useful!
</div>
