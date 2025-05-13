import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# JWT Settings
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Database Settings
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////home/kastien/Documents/github/TrackMasterPro/backend/trackmaster.db")

# CORS Settings
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    # Add production domains here
    # "https://trackmaster.example.com",
]
