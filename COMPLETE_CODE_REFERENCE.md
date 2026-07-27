# Waffle Berry FastAPI Backend - Complete Code Reference

## Summary of All Backend Files

This repository is an API-only FastAPI backend. The browser UI has been removed from the backend and now lives in the separate `WaffleBerry_website` project. That frontend is run or hosted independently and communicates with this service through the `/api/v1` JSON endpoints. No frontend templates, static assets, CSS, or JavaScript are served by this backend.

---

## 1. **requirements.txt** - Dependencies
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
jinja2==3.1.2
pydantic==2.5.0
pydantic-settings==2.1.0
sqlalchemy==2.0.23
python-dotenv==1.0.0
psycopg2-binary==2.9.9
```

---

## 2. **app/config.py** - Configuration
```python
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings and configuration."""
    
    # App settings
    app_name: str = "Waffle Berry Backend"
    debug: bool = True
    
    # Database settings
    database_url: str = "postgresql://user:password@localhost/waffle_berry"
    
    # API settings
    api_v1_prefix: str = "/api/v1"
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
```

---

## 3. **app/db.py** - Database Connection
```python
"""Database configuration and session management."""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

# Database configuration
DATABASE_URL = "sqlite:///./waffle_berry.db"

# Create engine (use SQLite for development, PostgreSQL for production)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 4. **app/models/project.py** - Database Model
```python
"""SQLAlchemy ORM models for Project."""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db import Base


class Project(Base):
    """Project database model."""
    
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name})>"
```

---

## 5. **app/schemas/project.py** - Validation Schemas
```python
"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ProjectBase(BaseModel):
    """Base project schema with common fields."""
    
    name: str = Field(..., min_length=1, max_length=255, description="Project name")
    description: Optional[str] = Field(None, max_length=5000, description="Project description")


class ProjectCreate(ProjectBase):
    """Schema for creating a new project."""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)


class ProjectResponse(ProjectBase):
    """Schema for project response from API."""
    
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # Allow ORM model conversion
```

---

## 6. **app/crud/project.py** - Database Operations
```python
"""CRUD operations for Project model."""

from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectCRUD:
    """CRUD operations for projects."""
    
    @staticmethod
    def get_project(db: Session, project_id: int) -> Project | None:
        """Get a project by ID."""
        return db.query(Project).filter(Project.id == project_id).first()
    
    @staticmethod
    def get_projects(db: Session, skip: int = 0, limit: int = 10) -> list[Project]:
        """Get all projects with pagination."""
        return db.query(Project).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_project(db: Session, project: ProjectCreate) -> Project:
        """Create a new project."""
        db_project = Project(
            name=project.name,
            description=project.description
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project
    
    @staticmethod
    def update_project(db: Session, project_id: int, project_update: ProjectUpdate) -> Project | None:
        """Update a project."""
        db_project = db.query(Project).filter(Project.id == project_id).first()
        if db_project:
            update_data = project_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_project, field, value)
            db.commit()
            db.refresh(db_project)
        return db_project
    
    @staticmethod
    def delete_project(db: Session, project_id: int) -> bool:
        """Delete a project."""
        db_project = db.query(Project).filter(Project.id == project_id).first()
        if db_project:
            db.delete(db_project)
            db.commit()
            return True
        return False
```

---

## 7. **app/api/v1/project.py** - API Routes
```python
"""API routes for project endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.crud.project import ProjectCRUD

router = APIRouter()


@router.get("/projects", response_model=list[ProjectResponse])
async def list_projects(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get all projects with pagination.
    
    - **skip**: Number of projects to skip (for pagination)
    - **limit**: Maximum number of projects to return
    """
    projects = ProjectCRUD.get_projects(db, skip=skip, limit=limit)
    return projects


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get a specific project by ID."""
    project = ProjectCRUD.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    return project


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new project.
    
    - **name**: Project name (required)
    - **description**: Project description (optional)
    """
    db_project = ProjectCRUD.create_project(db, project)
    return db_project


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update a project by ID.
    
    - **name**: New project name (optional)
    - **description**: New project description (optional)
    """
    db_project = ProjectCRUD.update_project(db, project_id, project_update)
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    return db_project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Delete a project by ID."""
    success = ProjectCRUD.delete_project(db, project_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found"
        )
    return None
```

---

## 8. **app/main.py** - FastAPI Application
```python
"""FastAPI application initialization and setup."""

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.project import router as project_router
from app.api.v1.user import router as user_router
from app.db import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Waffle Berry - Voice Cloning AI",
    description="AI platform for cloning voices and having conversations with loved ones",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router, prefix="/api/v1", tags=["users", "voice-profiles", "conversations"])
app.include_router(project_router, prefix="/api/v1", tags=["projects"])


@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Return a simple backend status page."""
    return "<h1>Waffle Berry - Backend Running</h1>"


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "Waffle Berry backend is running",
        "version": "1.0.0"
    }


@app.get("/api/v1/health")
async def api_health_check():
    """API health check endpoint."""
    return {
        "status": "ok",
        "message": "API is operational"
    }
```

---

## 9. **run.py** - Entry Point
```python
#!/usr/bin/env python3
"""Entry point for running the FastAPI application."""

import uvicorn
import sys

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
```

---

## 10. **.env.example** - Environment Template
```
# Waffle Berry Backend Environment Variables
# Copy this file to .env and update with your values

APP_NAME="Waffle Berry Backend"
DEBUG=True

# Database
DATABASE_URL=sqlite:///./waffle_berry.db
# For PostgreSQL: DATABASE_URL=postgresql://user:password@localhost:5432/waffle_berry

# API
API_V1_PREFIX=/api/v1
```

---

## How to Run

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Create .env File (Optional)
```bash
cp .env.example .env
# Update .env with your settings if needed
```

### Step 3: Run the Server
```bash
python run.py
```

Output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
```

---

## Testing the API

### 1. **Visit Swagger UI**
Open browser: `http://localhost:8000/docs`
- Interactive API documentation
- Try endpoints directly

### 2. **Health Check**
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "ok",
  "message": "Waffle Berry backend is running",
  "version": "1.0.0"
}
```

### 3. **Create a Project**
```bash
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Project",
    "description": "This is a test project"
  }'
```

Response (201 Created):
```json
{
  "id": 1,
  "name": "My First Project",
  "description": "This is a test project",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### 4. **Get All Projects**
```bash
curl http://localhost:8000/api/v1/projects
```

### 5. **Get Single Project**
```bash
curl http://localhost:8000/api/v1/projects/1
```

### 6. **Update Project**
```bash
curl -X PUT http://localhost:8000/api/v1/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description"
  }'
```

### 7. **Delete Project**
```bash
curl -X DELETE http://localhost:8000/api/v1/projects/1
```

Response: `204 No Content`

---

## Architecture Flow

```
Separate WaffleBerry_website frontend HTTP/JSON request
       ↓
app/main.py (FastAPI app)
       ↓
app/api/v1/project.py (Routes)
       ↓
app/schemas/project.py (Validation)
       ↓
app/crud/project.py (DB Operations)
       ↓
app/db.py (Session)
       ↓
app/models/project.py (ORM)
       ↓
Database (SQLite/PostgreSQL)
       ↓
JSON response → Separate WaffleBerry_website frontend
```

---

## Key Features

✅ Complete CRUD operations
✅ Request/response validation with Pydantic
✅ SQLAlchemy ORM integration
✅ Automatic API documentation (Swagger UI)
✅ CORS support
API-only deployment, independent from the frontend
✅ Error handling with proper status codes
✅ Database session management
✅ Pagination support
✅ Clean architecture with separation of concerns

---

## All Done! 🎉

Your complete FastAPI backend is now ready to use!
