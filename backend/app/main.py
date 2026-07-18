"""FastAPI application initialization and setup."""

from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.project import router as project_router
from app.api.v1.user import router as user_router
from app.db import Base, engine

# Setup paths
ROOT_DIR = Path(__file__).resolve().parents[2]
FRONTEND_DIR = ROOT_DIR / "frontend"
STATIC_DIR = FRONTEND_DIR / "static"
TEMPLATES_DIR = FRONTEND_DIR / "templates"

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Setup templates
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# Include routers
app.include_router(user_router, prefix="/api/v1", tags=["users", "voice-profiles", "conversations"])
app.include_router(project_router, prefix="/api/v1", tags=["projects"])


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Serve the frontend index.html."""
    if TEMPLATES_DIR.exists():
        return templates.TemplateResponse("index.html", {"request": request})
    return "<h1>🎤 Waffle Berry - Voice Cloning AI Platform</h1>"


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
        "message": "API is operational",
        "features": [
            "User authentication",
            "Voice profile creation",
            "Voice sample upload",
            "Conversation management",
            "Message handling"
        ]
    }



