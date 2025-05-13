from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    userId: int
    message: str = "Login successful"

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

# Task schemas
class TaskBase(BaseModel):
    title: str
    detail: str
    date: str  # Format: YYYY-MM-DD
    time: str  # Format: HH:MM
    priority: str = "medium"  # low, medium, high

class TaskCreate(TaskBase):
    userId: int
    completed: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    detail: Optional[str] = None
    date: Optional[str] = None  # Format: YYYY-MM-DD
    time: Optional[str] = None  # Format: HH:MM
    priority: Optional[str] = None  # low, medium, high
    userId: Optional[int] = None
    completed: Optional[bool] = None

class Task(TaskBase):
    id: int
    completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Response schemas
class TaskResponse(BaseModel):
    task: Task
    message: str = "Task operation successful"

class TasksResponse(BaseModel):
    tasks: List[Task]
    message: str = "Tasks retrieved successfully"
