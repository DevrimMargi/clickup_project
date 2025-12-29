from sqlalchemy.orm import Session

from models.user import User
from models.user_workspace import UserWorkspace

from auth.hashing import verify_password, hash_password
from auth.jwt_handler import create_access_token


# -------------------------------------------------
# 🔐 LOGIN SERVICE
# -------------------------------------------------
def login_user(db: Session, email: str, password: str):
    """
    Kullanıcı giriş işlemi (service katmanı)
    """

    if not email or not password:
        raise ValueError("Email ve şifre boş olamaz")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise ValueError("Kullanıcı bulunamadı")

    if not verify_password(password, user.password_hash):
        raise ValueError("Hatalı e-posta veya parola")

    token = create_access_token({"user_id": user.id})

    membership = db.query(UserWorkspace).filter(
        UserWorkspace.user_id == user.id
    ).first()

    return {
        "token": token,
        "user_id": user.id,
        "workspace_id": membership.workspace_id if membership else None
    }


# -------------------------------------------------
# ✅ SIGNUP SERVICE (ileride test yazacağız)
# -------------------------------------------------
def signup_user(db: Session, full_name: str, email: str, password: str):
    """
    Kullanıcı kayıt işlemi (service katmanı)
    """

    if not full_name or not email or not password:
        raise ValueError("Tüm alanlar zorunludur")

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise ValueError("Bu e-posta zaten kayıtlı")

    new_user = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"user_id": new_user.id})

    return {
        "token": token,
        "user_id": new_user.id
    }
