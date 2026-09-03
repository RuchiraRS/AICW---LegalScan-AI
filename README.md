# LegalScan AI

AI-POWERED LEGAL METROLOGY COMPLIANCE AND ENFORCEMENT SYSTEM

LegalScan AI is an AI-powered field-level enforcement assistant designed to assist authorized enforcement officials in inspecting packaged commodities under the Legal Metrology (Packaged Commodities) Rules, 2011.

## Legal Disclaimer
"LegalScan AI is an AI-assisted inspection and evidence management prototype. AI-generated findings are recommendations and require verification by an authorized enforcement officer. The prototype's rule configuration must be validated against the current applicable legal and regulatory framework before operational deployment."

## Technology Stack
- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **AI Service:** Python, FastAPI, TensorFlow (CNN), EasyOCR, spaCy (NLP)
- **Reporting:** reportlab

## Running Locally

### Prerequisites
- Node.js
- Python 3.9+
- MongoDB

### Installation
See `docs/deployment.md` for full instructions.

#### Frontend
```
cd frontend
npm install
npm run dev
```

#### Backend
```
cd backend
npm install
npm run dev
```

#### AI Service
```
cd ai-service
python -m venv venv
.\venv\Scripts\Activate.ps1 (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
