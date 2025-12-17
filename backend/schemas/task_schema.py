from pydantic import BaseModel
from datetime import date

class TaskCreate(BaseModel):
    title: str
    status: str
    priority: str
    project_id: int
    assignee_id: int | None = None
    due_date: date | None = None
