from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.connection import get_db
from models.task import Task
from models.project import Project
from schemas.task_schema import TaskCreate

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# -------------------------------------------------
# 🟢 TASK OLUŞTUR
# -------------------------------------------------
@router.post("/")
def create_task(data: TaskCreate, db: Session = Depends(get_db)):

    task = Task(
        title=data.title,
        due_date=data.due_date,
        priority=data.priority,
        status=data.status,
        project_id=data.project_id,
        assignee_id=data.assignee_id,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return {
        "id": task.id,
        "title": task.title,
        "status": task.status,
        "priority": task.priority,
        "due": task.due_date,
        "project_id": task.project_id,
        "assignee_id": task.assignee_id,
    }


# -------------------------------------------------
# 🟢 WORKSPACE TASK'LARI
# -------------------------------------------------
@router.get("/workspace/{workspace_id}")
def get_tasks(workspace_id: int, db: Session = Depends(get_db)):

    tasks = (
        db.query(Task)
        .join(Project, Task.project_id == Project.id)
        .filter(Project.workspace_id == workspace_id)
        .all()
    )

    response = []

    for t in tasks:
        response.append({
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "priority": t.priority,
            "due": t.due_date,
            "project_id": t.project_id,
            "assignee_id": t.assignee_id,
            # 🔥 NULL SAFE
            "assignee": {
                "id": t.assignee.id,
                "full_name": t.assignee.full_name,
            } if getattr(t, "assignee", None) else None,
        })

    return response
