# EnergyGuard AI – Installation & Deployment Guide

This guide details how to install and execute EnergyGuard AI in development mode or via Docker Compose.

---

## 1. Quick Development Startup

### Frontend Setup
```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server on port 3000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Backend Setup (FastAPI)
```bash
# 1. Create a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run FastAPI server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
Swagger API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 2. Docker Compose Production Deployment

The entire multi-container architecture (Frontend, Backend, PostgreSQL, Mosquitto MQTT) can be launched with a single command:
```bash
docker compose up --build -d
```

### Checking Services
```bash
docker compose ps
docker compose logs -f backend
```

---

## 3. Running Automated Tests
```bash
# Run backend electrical formulas and API tests
pytest backend/tests/ -v

# Run frontend build verification
npm run build
```
