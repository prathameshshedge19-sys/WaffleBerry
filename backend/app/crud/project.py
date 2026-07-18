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
