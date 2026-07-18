from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None


class ProjectResponse(ProjectCreate):
    id: int


@router.get("/projects", response_model=list[ProjectResponse])
async def list_projects():
    """Return an empty list for frontend integration."""
    return []


@router.post("/projects", response_model=ProjectResponse, status_code=201)
async def create_project(payload: ProjectCreate):
    """Create placeholder project data; connect to DB later."""
    return {"id": 1, **payload.dict()}
