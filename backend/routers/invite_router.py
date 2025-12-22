from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from db.connection import get_db
from models.invite import Invite
from schemas.invite_schema import InviteRequest

router = APIRouter(prefix="/invite", tags=["Invite"])


# 📩 DAVET GÖNDER
@router.post("/send")
def send_invite(request: InviteRequest, db: Session = Depends(get_db)):

    # DEBUG (istersen sonra sil)
    print("INVITE REQUEST:", request)

    token = str(uuid.uuid4())

    invite = Invite(
        email=request.email,
        token=token,
        workspace_id=request.workspace_id,
        role=request.role
    )

    db.add(invite)
    db.commit()
    db.refresh(invite)

    # 👉 Mail burada tetiklenir (şimdilik log)
    print(f"📧 Mail gönderildi → {request.email}")
    print(f"🔗 Invite link: http://localhost:5173/accept-invite/{token}")

    return {
        "message": "Invite sent successfully",
        "invite_link": f"http://localhost:5173/accept-invite/{token}"
    }
