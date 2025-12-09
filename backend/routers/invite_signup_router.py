from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.connection import get_db
from models.user import User
from models.invite import Invite
from models.user_workspace import UserWorkspace
from schemas.invite_signup_schema import InviteSignupSchema
from auth.hashing import hash_password

router = APIRouter(prefix="/invite", tags=["Invite Signup"])


# -------------------------------------------------------------------
# 📌 DAVET ÜZERİNDEN SIGNUP → WORKSPACE'E KATIL
# -------------------------------------------------------------------
@router.post("/signup")
def invite_signup(data: InviteSignupSchema, db: Session = Depends(get_db)):

    # 1) Email zaten var mı?
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı!")

    # 2) Yeni kullanıcı oluştur
    new_user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3) Davet kaydını bul
    invite = db.query(Invite).filter(Invite.token == data.token).first()
    if not invite:
        raise HTTPException(status_code=400, detail="Davet bulunamadı.")

    # 4) Daveti kabul edildi olarak işaretle
    invite.accepted = True
    db.commit()

    # 5) Kullanıcıyı workspace'e ekle
    membership = UserWorkspace(
        user_id=new_user.id,
        workspace_id=invite.workspace_id
    )
    db.add(membership)
    db.commit()

    # 6) Sonuç
    return {
        "message": "Workspace'e başarıyla katıldınız!",
        "workspace_id": invite.workspace_id,
        "user_id": new_user.id
    }
