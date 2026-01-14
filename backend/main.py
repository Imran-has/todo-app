"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from routers import health_router, tasks_router

settings = get_settings()

app = FastAPI(
    title="Todo API",
    description="RESTful API for Todo application",
    version="1.0.0",
)

# Configure CORS - Production-ready configuration
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add production frontend URL(s)
if settings.FRONTEND_URL and settings.FRONTEND_URL not in allowed_origins:
    allowed_origins.append(settings.FRONTEND_URL)
    # Also handle with/without trailing slash
    allowed_origins.append(settings.FRONTEND_URL.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
    expose_headers=["set-auth-token"],
    max_age=600,
)

# Include routers
app.include_router(health_router)
app.include_router(tasks_router)
