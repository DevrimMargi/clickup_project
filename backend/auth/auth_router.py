from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session

from db.connection import SessionLocal
from models.user import User
from models.workspace import Workspace
from models.user_workspace import UserWorkspace
from schemas.user_schema import UserCreate, UserLogin
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
# ✅ SIGNUP
# -------------------------------------------------
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Kullanıcı var mı?
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı!")

    # Kullanıcı oluştur
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # İlk workspace oluştur (admin)
    workspace = Workspace(
        name=f"{new_user.full_name}'s Workspace",
        owner_id=new_user.id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    # Admin membership
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
    if not user:
        raise HTTPException(status_code=401, detail="Hatalı e-posta veya parola")

    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Hatalı e-posta veya parola")

    token = create_access_token({"user_id": user.id})

    workspace = db.query(Workspace).filter(
        Workspace.owner_id == user.id
    ).first()

    return {
        "message": "Giriş başarılı!",
        "token": token,
        "user_id": user.id,
        "workspace_id": workspace.id if workspace else None
    }


# -------------------------------------------------
# ✅ KULLANICININ TÜM WORKSPACE'LERİ
# -------------------------------------------------
@router.get("/me/workspaces")
def get_my_workspaces(
    authorization: str = Header(..., alias="Authorization"),
    db: Session = Depends(get_db),
):
    # Bearer token al
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
# 🔐 ORTAK AUTH FONKSİYONU (ÇOK ÖNEMLİ)
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
