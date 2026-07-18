# Waffle Berry Backend - FastAPI Implementation Guide

## Backend Architecture Overview

### Folder Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── config.py            # Configuration & settings
│   ├── db.py                # Database connection & session
│   ├── api/
│   │   ├── v1/
│   │   │   └── project.py   # API routes/endpoints
│   ├── models/
│   │   └── project.py       # SQLAlchemy ORM models
│   ├── schemas/
│   │   └── project.py       # Pydantic validation schemas
│   ├── crud/
│   │   └── project.py       # Database operations
│   └── service/             # Business logic layer
├── tests/
├── requirements.txt         # Python dependencies
├── run.py                   # Application entry point
└── .env.example             # Environment variables template
```

---

## File-by-File Breakdown

### 1. **requirements.txt** - Dependencies
```
Defines all Python packages needed:
- fastapi: Web framework
- uvicorn: ASGI server
- sqlalchemy: ORM for database
- pydantic: Data validation
- python-dotenv: Environment variable management
```

### 2. **config.py** - Configuration Management
```
Settings class with:
- Environment variables loading
- Database URL configuration
- App name and debug mode
- Reusable across the application
```

### 3. **db.py** - Database Setup
```
Provides:
- Database engine (SQLite for dev, PostgreSQL for prod)
- Session factory for DB connections
- Base class for ORM models
- get_db() dependency function for API routes
```

### 4. **models/project.py** - Database Schema (ORM)
```
Project model defines:
- id: Primary key
- name: Project name (indexed)
- description: Project details
- created_at: Timestamp (auto)
- updated_at: Timestamp (auto-updated)
- Represents actual database table structure
```

### 5. **schemas/project.py** - Request/Response Validation
```
Pydantic models for:
- ProjectCreate: Validates POST request data
- ProjectUpdate: Validates PUT request data
- ProjectResponse: Serializes database models to JSON

Config: from_attributes=True allows ORM → Pydantic conversion
```

### 6. **crud/project.py** - Database Operations
```
ProjectCRUD class with methods:
- get_project(id)              # Fetch single project
- get_projects(skip, limit)    # Fetch all with pagination
- create_project(data)         # Insert new project
- update_project(id, data)     # Update existing project
- delete_project(id)           # Remove project

Direct SQLAlchemy queries against database
```

### 7. **api/v1/project.py** - API Endpoints
```
RESTful API routes:
- GET    /api/v1/projects              → List all projects
- GET    /api/v1/projects/{id}         → Get single project
- POST   /api/v1/projects              → Create project
- PUT    /api/v1/projects/{id}         → Update project
- DELETE /api/v1/projects/{id}         → Delete project

Uses dependency injection for database session
```

### 8. **main.py** - Application Entry Point
```
Initializes FastAPI with:
- Database table creation
- CORS middleware configuration
- Static file mounting
- Template rendering setup
- Router registration
- Health check endpoints
```

### 9. **run.py** - Server Launcher
```
Starts the application:
python run.py
- Runs on http://localhost:8000
- Auto-reload on code changes
- Uvicorn ASGI server
```

---

## Request Flow Diagram

```
User Request (e.g., POST /api/v1/projects)
        ↓
main.py: FastAPI app receives request
        ↓
api/v1/project.py: Route handler (@router.post)
        ↓
schemas/project.py: Pydantic validates request body
        ↓
crud/project.py: ProjectCRUD.create_project() called
        ↓
db.py: get_db() provides SQLAlchemy session
        ↓
models/project.py: Project ORM model instance created
        ↓
Database: SQL INSERT executed
        ↓
schemas/project.py: Response serialized with ProjectResponse
        ↓
Client: JSON response returned (201 Created)
```

---

## How to Use

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Application
```bash
python run.py
```

The server will start at `http://localhost:8000`

### 3. Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### 4. API Endpoints Example

**Create a Project:**
```bash
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "My Project", "description": "Project details"}'
```

**Get All Projects:**
```bash
curl http://localhost:8000/api/v1/projects
```

**Get Single Project:**
```bash
curl http://localhost:8000/api/v1/projects/1
```

**Update Project:**
```bash
curl -X PUT http://localhost:8000/api/v1/projects/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'
```

**Delete Project:**
```bash
curl -X DELETE http://localhost:8000/api/v1/projects/1
```

---

## Key Concepts

### 1. **Dependency Injection**
- FastAPI uses `Depends()` to inject dependencies
- `get_db()` automatically provides database sessions
- Routes automatically close sessions after completion

### 2. **Pydantic Validation**
- Automatic request data validation
- Type checking and error messages
- Automatic OpenAPI documentation generation

### 3. **SQLAlchemy ORM**
- Object-Relational Mapping
- Models represent database tables
- Automatic SQL generation
- Connection pooling

### 4. **REST Conventions**
- GET: Retrieve data
- POST: Create data (201 status)
- PUT: Update entire resource
- PATCH: Partial update
- DELETE: Remove data (204 status)

---

## Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful delete |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Unexpected error |

---

## Database Notes

**Current Setup:** SQLite (development)
- File-based database: `waffle_berry.db`
- Auto-creates on first run
- Perfect for development

**For Production:** PostgreSQL
- Update `DATABASE_URL` in `.env`
- Install: `pip install psycopg2-binary`
- More robust and scalable

---

## Next Steps

1. Update `.env` with your configuration
2. Run `python run.py` to start the server
3. Test endpoints via Swagger UI (/docs)
4. Add authentication/authorization as needed
5. Deploy to production with PostgreSQL
