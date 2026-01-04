# videoclub-monorepo

Keep an updated list with information about the series you have been finishing.  
Personal project to use the stack below.

*It is not an application for mass use in production.*

## Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite 7** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **TailwindCSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **MySQL** (PyMySQL) - Database
- **Python-Jose** - JWT authentication
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### External API
- **[OMDb API](http://www.omdbapi.com/)** - Movie and series data

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`

##### 2026
