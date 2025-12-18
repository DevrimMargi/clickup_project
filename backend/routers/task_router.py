from fastapi import APIRouter, Depends, HTTPException
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
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db)
):
    task = Task(
        title=data.title,
        status=data.status,
        priority=data.priority,
        due_date=data.due_date,
        project_id=data.project_id,
        assignee_id=data.assignee_id
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
        "assignee_fullname": task.assignee.full_name if task.assignee else None
    }


# -------------------------------------------------
# 🟢 WORKSPACE’E AİT TÜM TASK’LAR
# (PROJECT ÜZERİNDEN JOIN)
# -------------------------------------------------
@router.get("/workspace/{workspace_id}")
def get_tasks_by_workspace(
    workspace_id: int,
    db: Session = Depends(get_db)
):
    tasks = (
        db.query(Task)
        .join(Project, Task.project_id == Project.id)
        .filter(Project.workspace_id == workspace_id)
        .all()
    )

    return [
        {
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "priority": t.priority,
            "due": t.due_date,
            "project_id": t.project_id,
            "assignee_id": t.assignee_id,
            "assignee_fullname": t.assignee.full_name if t.assignee else None
        }
        for t in tasks
    ]


# -------------------------------------------------
# 🟢 PROJECT’E AİT TASK’LAR
# -------------------------------------------------
@router.get("/project/{project_id}")
def get_tasks_by_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    tasks = (
        db.query(Task)
        .filter(Task.project_id == project_id)
        .all()
    )

    return [
        {
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "priority": t.priority,
            "due": t.due_date,
            "project_id": t.project_id,
            "assignee_id": t.assignee_id,
            "assignee_fullname": t.assignee.full_name if t.assignee else None
        }
        for t in tasks
    ]


# -------------------------------------------------
# 🔴 TASK SİL
# -------------------------------------------------
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted"}
