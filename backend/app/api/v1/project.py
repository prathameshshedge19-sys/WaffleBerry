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
