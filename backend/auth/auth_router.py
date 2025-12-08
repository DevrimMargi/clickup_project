from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.connection import SessionLocal 
from models.user import User
from models.workspace import Workspace
from schemas.user_schema import UserCreate, UserLogin
from auth.hashing import hash_password, verify_password
from auth.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

# ✅ DB bağlantısı
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ SIGNUP
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):

    # Kullanıcı var mı kontrol
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

    # ✅ KULLANICI ADINA GÖRE WORKSPACE OLUŞTUR
    workspace = Workspace(
        name=f"{new_user.full_name}'s Workspace",
        owner_id=new_user.id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    # Token üret
    token = create_access_token({"user_id": new_user.id})

    return {
        "message": "Kayıt başarılı!",
        "token": token,
        "user_id": new_user.id,
        "workspace_id": workspace.id
    }


# ✅ LOGIN
@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Hatalı e-posta veya parola")

    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Hatalı e-posta veya parola")

    token = create_access_token({"user_id": user.id})

    # ✅ Workspace'i çek
    workspace = db.query(Workspace).filter(Workspace.owner_id == user.id).first()

    return {
        "message": "Giriş başarılı!",
        "token": token,
        "user_id": user.id,
        "workspace_id": workspace.id if workspace else None
    }
