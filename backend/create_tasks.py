from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Task
from datetime import datetime, timezone

# Create a database session
db = SessionLocal()

def create_tasks():
    # Find the test user
    user = db.query(User).filter(User.email == 'test@example.com').first()
    
    if not user:
        print("User test@example.com not found")
        return
    
    # Create some sample tasks for the test user
    tasks = [
        Task(
            title="Complete Project",
            detail="Finish the TrackMasterPro application",
            date="2023-12-25",
            time="14:30",
            completed=False,
            priority="high",
            user_id=user.id
        ),
        Task(
            title="Team Meeting",
            detail="Weekly team sync to discuss progress",
            date="2023-12-26",
            time="10:00",
            completed=True,
            priority="medium",
            user_id=user.id
        ),
        Task(
            title="Buy Groceries",
            detail="Get milk, eggs, and bread",
            date="2023-12-27",
            time="18:00",
            completed=False,
            priority="low",
            user_id=user.id
        ),
        Task(
            title="Read Documentation",
            detail="Study React hooks documentation",
            date="2023-12-28",
            time="20:00",
            completed=False,
            priority="medium",
            user_id=user.id
        ),
        Task(
            title="Exercise",
            detail="30 minutes of cardio",
            date="2023-12-29",
            time="07:00",
            completed=False,
            priority="high",
            user_id=user.id
        )
    ]
    
    # Add tasks to database
    for task in tasks:
        db.add(task)
    
    db.commit()
    print(f"Created {len(tasks)} tasks for user {user.email}")

if __name__ == "__main__":
    create_tasks()
    db.close()
