from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.connection import get_db
from models.project import Project
from schemas.project_schema import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])

# 🟢 PROJE OLUŞTUR
@router.post("/", response_model=ProjectResponse)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(
        name=data.name,
        description=data.description,
        workspace_id=data.workspace_id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

# 🟢 WORKSPACE’E AİT PROJELER
@router.get("/workspace/{workspace_id}", response_model=list[ProjectResponse])
def get_projects_by_workspace(workspace_id: int, db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.workspace_id == workspace_id).all()
