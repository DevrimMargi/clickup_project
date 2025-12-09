from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.connection import get_db
from models.invite import Invite
from schemas.invite_schema import InviteRequest
import uuid

router = APIRouter(prefix="/invite", tags=["Invite"])

# --- 📩 1) Davet Gönder ---
@router.post("/send")
def send_invite(request: InviteRequest, db: Session = Depends(get_db)):
    token = str(uuid.uuid4())

    invite = Invite(
        email=request.email,
        token=token,
        workspace_id=request.workspace_id,
        accepted=False
    )

    db.add(invite)
    db.commit()
    db.refresh(invite)

    return {
        "message": "Invite sent!",
        "invite_url": f"http://localhost:5173/accept-invite/{token}"
    }


# --- ✔ 2) Daveti Kabul Et ---
@router.get("/accept/{token}")
def accept_invite(token: str, db: Session = Depends(get_db)):
    invite = db.query(Invite).filter(Invite.token == token).first()

    if not invite:
        raise HTTPException(status_code=400, detail="Geçersiz veya süresi dolmuş davet.")

    return {"message": "Bu davet daha önce kabul edilmiş.", "workspace_id": invite.workspace_id}
