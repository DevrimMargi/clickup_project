from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.connection import get_db
from models.user import User
from models.user_workspace import UserWorkspace

router = APIRouter(prefix="/workspace", tags=["Workspace"])


@router.get("/{workspace_id}/members")
def get_workspace_members(
    workspace_id: int,
    db: Session = Depends(get_db)
):
    members = (
        db.query(User, UserWorkspace.role)
        .join(UserWorkspace, User.id == UserWorkspace.user_id)
        .filter(UserWorkspace.workspace_id == workspace_id)
        .all()
    )

    if not members:
        return []

    return [
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": role,
        }
        for user, role in members
    ]
