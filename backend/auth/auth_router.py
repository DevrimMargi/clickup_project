from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid

from db.connection import SessionLocal
from models.user import User
from models.workspace import Workspace
from models.user_workspace import UserWorkspace
from core.send_reset_password_email import send_reset_password_email


from schemas.user_schema import (
    UserCreate,
    UserLogin,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
)

from auth.hashing import hash_password, verify_password
from auth.jwt_handler import create_access_token, decode_token


router = APIRouter(prefix="/auth", tags=["Auth"])


# -------------------------------------------------
# 🔹 DB SESSION
# -------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------------------------------
# 🔐 ORTAK AUTH FONKSİYONU
# -------------------------------------------------
def get_current_user(
    authorization: str = Header(..., alias="Authorization"),
    db: Session = Depends(get_db),
):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz Authorization header"
        )

    user_id = decode_token(token)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı bulunamadı"
        )

    return user


# -------------------------------------------------
# ✅ SIGNUP
# -------------------------------------------------
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı!")

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 🔥 İlk workspace (admin)
    workspace = Workspace(
        name=f"{new_user.full_name}'s Workspace",
        owner_id=new_user.id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    membership = UserWorkspace(
        user_id=new_user.id,
        workspace_id=workspace.id,
        role="admin"
    )
    db.add(membership)
    db.commit()

    token = create_access_token({"user_id": new_user.id})

    return {
        "message": "Kayıt başarılı!",
        "token": token,
        "user_id": new_user.id,
        "workspace_id": workspace.id
    }


# -------------------------------------------------
# ✅ LOGIN
# -------------------------------------------------
@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Hatalı e-posta veya parola")

    token = create_access_token({"user_id": user.id})

    membership = db.query(UserWorkspace).filter(
        UserWorkspace.user_id == user.id
    ).first()

    return {
        "message": "Giriş başarılı!",
        "token": token,
        "user_id": user.id,
        "workspace_id": membership.workspace_id if membership else None
    }


# -------------------------------------------------
# ✅ KULLANICININ WORKSPACE'LERİ
# -------------------------------------------------
@router.get("/me/workspaces")
def get_my_workspaces(
    authorization: str = Header(..., alias="Authorization"),
    db: Session = Depends(get_db),
):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz Authorization header formatı"
        )

    user_id = decode_token(token)

    memberships = (
        db.query(UserWorkspace, Workspace)
        .join(Workspace, UserWorkspace.workspace_id == Workspace.id)
        .filter(UserWorkspace.user_id == user_id)
        .all()
    )

    return {
        "items": [
            {
                "workspace_id": ws.id,
                "workspace_name": ws.name,
                "role": uw.role,
                "is_owner": ws.owner_id == user_id
            }
            for uw, ws in memberships
        ]
    }


# -------------------------------------------------
# 🔑 CHANGE PASSWORD
# -------------------------------------------------
@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Mevcut şifre yanlış")

    current_user.password_hash = hash_password(data.new_password)
    db.commit()

    return {"message": "Şifre başarıyla güncellendi"}


# -------------------------------------------------
# 🔑 FORGOT PASSWORD
# -------------------------------------------------
@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()

    # 🔒 Güvenlik (mail var mı yok mu söyleme)
    if not user:
        return {
            "message": "Şifre sıfırlama bağlantısı e-posta adresine gönderildi"
        }

    token = str(uuid.uuid4())
    user.password_reset_token = token
    user.password_reset_expires = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    reset_link = f"http://localhost:5173/reset-password?token={token}"

    # 🔥 ASIL KRİTİK SATIR
    send_reset_password_email(user.email, reset_link)

    return {
        "message": "Şifre sıfırlama bağlantısı e-posta adresine gönderildi"
    }

# -------------------------------------------------
# 🔑 RESET PASSWORD
# -------------------------------------------------
@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.password_reset_token == data.token
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Geçersiz veya kullanılmış token")

    if user.password_reset_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token süresi dolmuş")

    user.password_hash = hash_password(data.new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.commit()

    return {"message": "Şifre başarıyla sıfırlandı"}
