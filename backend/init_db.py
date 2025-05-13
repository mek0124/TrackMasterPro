import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Task
from app.utils.auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

# Create a database session
db = SessionLocal()

def init_db():
    # Check if we already have users
    user_count = db.query(User).count()
    if user_count == 0:
        print("Creating production user...")
        # Create a production user
        prod_user = User(
            email="admin@trackmaster.com",
            hashed_password=get_password_hash("admin123")
        )
        db.add(prod_user)
        db.commit()
        db.refresh(prod_user)

        # Create some sample tasks for the production user
        tasks = [
            Task(
                title="Complete Project",
                detail="Finish the TrackMasterPro application",
                date="2023-12-25",
                time="14:30",
                completed=False,
                priority="high",
                user_id=prod_user.id
            ),
            Task(
                title="Team Meeting",
                detail="Weekly team sync to discuss progress",
                date="2023-12-26",
                time="10:00",
                completed=True,
                priority="medium",
                user_id=prod_user.id
            ),
            Task(
                title="Buy Groceries",
                detail="Get milk, eggs, and bread",
                date="2023-12-27",
                time="18:00",
                completed=False,
                priority="low",
                user_id=prod_user.id
            ),
            Task(
                title="Read Documentation",
                detail="Study React hooks documentation",
                date="2023-12-28",
                time="20:00",
                completed=False,
                priority="medium",
                user_id=prod_user.id
            ),
            Task(
                title="Exercise",
                detail="30 minutes of cardio",
                date="2023-12-29",
                time="07:00",
                completed=False,
                priority="high",
                user_id=prod_user.id
            )
        ]

        for task in tasks:
            db.add(task)

        db.commit()
        print(f"Created production user with email: {prod_user.email} and 5 sample tasks")
    else:
        print("Database already initialized with users")

if __name__ == "__main__":
    init_db()
    db.close()
