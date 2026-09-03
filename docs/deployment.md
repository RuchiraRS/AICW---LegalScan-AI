# Deployment Guide

## Architecture
LegalScan AI uses a microservices architecture:
- React SPA (Vite)
- Node.js API (Express)
- Python ML Service (FastAPI)
- MongoDB Database

## Local Setup Without Docker

### 1. MongoDB
Ensure MongoDB is running locally on port `27017` or update the `.env` in the backend.

### 2. Python AI Service
```bash
cd ai-service
python -m venv venv
# Activate virtualenv
pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

### 3. Node Backend
```bash
cd backend
npm install
npm run dev
```

### 4. React Frontend
```bash
cd frontend
npm install
npm run dev
```

## Docker Compose
You can run the entire stack using Docker Compose:
```bash
docker-compose up --build
```
This will start MongoDB, Node Backend, Python AI Service, and the Frontend.
