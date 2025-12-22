from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.connection import get_db
from models.user import User
from models.workspace import Workspace
from models.user_workspace import UserWorkspace

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])

@router.get("/{workspace_id}", status_code=status.HTTP_200_OK)
def get_workspace(
    workspace_id: int,
    db: Session = Depends(get_db)
):
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace bulunamadı"
        )

    return {
        "id": workspace.id,
        "name": workspace.name
    }



@router.get("/{workspace_id}/members", status_code=status.HTTP_200_OK)
def get_workspace_members(
    workspace_id: int,
    db: Session = Depends(get_db)
):
    # 🔎 Workspace var mı kontrolü (ÇOK ÖNEMLİ)
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace bulunamadı"
        )

    members = (
        db.query(User, UserWorkspace.role)
        .join(UserWorkspace, User.id == UserWorkspace.user_id)
        .filter(UserWorkspace.workspace_id == workspace_id)
        .order_by(UserWorkspace.role.desc())  # admin üstte gelsin
        .all()
    )

    return [
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": role
        }
        for user, role in members
    ]
