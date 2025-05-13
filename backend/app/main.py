from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import tasks, auth, websocket
from app.database.database import engine, Base
from app.config import CORS_ORIGINS

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TrackMasterPro API",
    description="Backend API for TrackMasterPro task management application",
    version="1.0.0"
)

# Configure CORS
origins = CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["Authentication"])
app.include_router(tasks.router, tags=["Tasks"])
app.include_router(websocket.router, tags=["WebSocket"])

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to TrackMasterPro API"}
