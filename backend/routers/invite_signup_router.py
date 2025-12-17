from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.connection import get_db
from models.user import User
from models.invite import Invite
from models.user_workspace import UserWorkspace
from schemas.invite_signup_schema import InviteSignupSchema
from auth.hashing import hash_password
from auth.jwt_handler import create_access_token  # ✅ EKLENDİ

router = APIRouter(prefix="/invite", tags=["Invite Signup"])


@router.post("/signup")
def invite_signup(data: InviteSignupSchema, db: Session = Depends(get_db)):
    # 1️⃣ Invite var mı?
    invite = db.query(Invite).filter_by(
        token=data.token,
        accepted=False
    ).first()

    if not invite:
        raise HTTPException(status_code=400, detail="Invite not found or already used")

    # 2️⃣ Email zaten kayıtlı mı?
    existing_user = db.query(User).filter_by(email=data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 3️⃣ User oluştur
    user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password)
    )
    db.add(user)
    db.flush()  # user.id almak için

    # 4️⃣ Workspace'e MEMBER ekle
    membership = UserWorkspace(
        user_id=user.id,
        workspace_id=invite.workspace_id,
        role="member"
    )
    db.add(membership)

    # 5️⃣ Invite kapat
    invite.accepted = True

    # 6️⃣ JWT TOKEN OLUŞTUR (🔥 EN KRİTİK SATIR)
    token = create_access_token({"user_id": user.id})

    # 7️⃣ Commit
    db.commit()

    return {
        "message": "Signup + workspace join successful",
        "token": token,                 # ✅ EKLENDİ
        "user_id": user.id,
        "workspace_id": invite.workspace_id
    }
