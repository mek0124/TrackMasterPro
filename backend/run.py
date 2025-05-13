import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get configuration from environment variables
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
RELOAD = os.getenv("ENVIRONMENT", "development").lower() == "development"

if __name__ == "__main__":
    # Run the application
    print(f"Starting server on {HOST}:{PORT} (reload={RELOAD})")
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=RELOAD,
        log_level=os.getenv("LOG_LEVEL", "info").lower()
    )
