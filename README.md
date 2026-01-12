# Videoclub Monorepo

A full-stack application for tracking and managing personal series watchlists with metadata enrichment from external APIs and AI-powered recommendations.

> **Note:** This is a personal project for learning and experimentation purposes. Not intended for production deployment at scale.

## Architecture Overview

```
videoclub-monorepo/
├── frontend/          # React SPA
├── backend/           # FastAPI REST API
└── README.md
```

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI library with TypeScript |
| Vite | 7 | Build tooling and dev server |
| TanStack Router | - | Type-safe file-based routing |
| TanStack Query | - | Server state management and caching |
| TailwindCSS | 4 | Utility-first styling |
| Lucide React | - | Icon system |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | - | Async Python web framework |
| SQLAlchemy | - | ORM and database toolkit |
| MySQL | - | Relational database (via PyMySQL driver) |
| Pydantic | - | Request/response validation |
| Python-Jose | - | JWT token handling |
| Uvicorn | - | ASGI server |

### External Integrations

- **OMDb API** - Series metadata enrichment
- **Google Gemini API** - AI-powered recommendations (development only)

## Environment Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/videoclub

# Authentication
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256

# External APIs
OMDB_API_KEY=your-omdb-api-key
OPENAPI_URL=/openapi.json

# AI Features (optional - local development only)
GEMINI_API_KEY=your-gemini-api-key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `SECRET_KEY` | Yes | JWT signing key (use a strong random value) |
| `ALGORITHM` | Yes | JWT algorithm (recommended: `HS256`) |
| `OMDB_API_KEY` | Yes | API key from [omdbapi.com](http://www.omdbapi.com/apikey.aspx) |
| `OPENAPI_URL` | No | OpenAPI schema endpoint path |
| `GEMINI_API_KEY` | No | Google Gemini API key for AI features |
| `FRONTEND_URL` | Yes | Frontend allowed origin |
!

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- MySQL 8.0+

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000
```

API documentation available at `http://localhost:8000/docs` (Swagger UI)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Application available at `http://localhost:3000`

## AI Recommendations Feature

The AI-powered series recommendation system (`backend/app/routes/assistant.py`) uses the Google Gemini API.

**Important:** This feature is intended for **local development only** and requires a valid `GEMINI_API_KEY` environment variable. The feature will be disabled if the API key is not configured.
