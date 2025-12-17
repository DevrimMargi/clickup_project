from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from db.connection import get_db
from models.invite import Invite
from models.user_workspace import UserWorkspace
from models.user import User
from schemas.invite_schema import InviteRequest
from auth.auth_router import get_current_user

router = APIRouter(prefix="/invite", tags=["Invite"])


# -------------------------------------------------------------------
# 📩 1) DAVET GÖNDER (SADECE ADMIN)
# -------------------------------------------------------------------
@router.post("/send")
def send_invite(
    request: InviteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1️⃣ Admin kontrolü
    uw = db.query(UserWorkspace).filter_by(
        user_id=current_user.id,
        workspace_id=request.workspace_id
    ).first()

    if not uw or uw.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can invite")

    # 2️⃣ Aynı invite var mı?
    existing = db.query(Invite).filter_by(
        email=request.email,
        workspace_id=request.workspace_id,
        accepted=False
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Invite already sent")

    # 3️⃣ Invite oluştur
    invite = Invite(
        email=request.email,
        token=str(uuid.uuid4()),
        workspace_id=request.workspace_id,
        accepted=False
    )

    db.add(invite)
    db.commit()
    db.refresh(invite)

    return {
        "message": "Invite sent successfully",
        "invite_url": f"http://localhost:5173/accept-invite/{invite.token}"
    }


# -------------------------------------------------------------------
# ✔ 2) DAVET KABUL (KAYITLI KULLANICI → MEMBER OLUR)
# -------------------------------------------------------------------
@router.post("/accept/{token}")
def accept_invite(
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1️⃣ Invite geçerli mi?
    invite = db.query(Invite).filter_by(
        token=token,
        accepted=False
    ).first()

    if not invite:
        raise HTTPException(status_code=400, detail="Invalid or expired invite")

    # 2️⃣ Kullanıcı zaten workspace'te mi?
    existing = db.query(UserWorkspace).filter_by(
        user_id=current_user.id,
        workspace_id=invite.workspace_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already in workspace")

    # 3️⃣ Workspace'e MEMBER olarak ekle
    membership = UserWorkspace(
        user_id=current_user.id,
        workspace_id=invite.workspace_id,
        role="member"
    )

    db.add(membership)

    # 4️⃣ Invite'ı kapat
    invite.accepted = True
    db.commit()

    return {
        "message": "Joined workspace successfully",
        "workspace_id": invite.workspace_id
    }
