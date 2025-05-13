from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Task, User
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskResponse, TasksResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/tasks")

@router.post("/{user_id}/all", response_model=TasksResponse)
def get_all_tasks(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all tasks for a user."""
    # Check if the requested user_id matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these tasks"
        )

    # Get tasks for the user
    tasks = db.query(Task).filter(Task.user_id == user_id).all()

    return {"tasks": tasks}

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new task."""
    # Check if the user_id in the task matches the authenticated user
    if current_user.id != task.userId:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create task for this user"
        )

    # Create new task
    db_task = Task(
        title=task.title,
        detail=task.detail,
        date=task.date,
        time=task.time,
        completed=task.completed,
        priority=task.priority,
        user_id=task.userId
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return {"task": db_task, "message": "Task created successfully"}

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a task."""
    print(f"Updating task {task_id} with data: {task_update.model_dump()}")

    # Get the task
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        print(f"Task not found: {task_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    print(f"Found task: {db_task.id}, {db_task.title}, completed: {db_task.completed}")

    # Check if the task belongs to the authenticated user
    if db_task.user_id != current_user.id:
        print(f"Authorization failed: Task user_id {db_task.user_id} != current user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update task fields
    update_data = task_update.model_dump(exclude_unset=True)
    print(f"Update data after exclude_unset: {update_data}")

    for key, value in update_data.items():
        if key == "userId":
            # Skip userId as we don't want to change the owner
            continue
        print(f"Setting {key} = {value}")
        setattr(db_task, key if key != "userId" else "user_id", value)

    db.commit()
    db.refresh(db_task)

    return {"task": db_task, "message": "Task updated successfully"}

@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a task."""
    # Get the task
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check if the task belongs to the authenticated user
    if db_task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    # Delete the task
    db.delete(db_task)
    db.commit()

    return {"message": "Task deleted successfully"}
