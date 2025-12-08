# auth/jwt_handler.py

from datetime import datetime, timedelta
from jose import jwt, JWTError # 👈 JWTError'u ekleyin
from fastapi import HTTPException, status # Hata yönetimi için ekleyin

# Token oluşturmak için gizli anahtar
SECRET_KEY = "supersecretkey" 
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=12)):
    # (Mevcut create_access_token fonksiyonunuz burada kalacak)
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str):
    """
    Verilen token'ı çözer ve içindeki payload'u (user_id) döndürür.
    """
    try:
        # Token'ı çöz ve geçerliliğini kontrol et
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # 'user_id'nin payload içinde olduğundan emin ol
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise JWTError("Token'da user_id bilgisi eksik.")

        return user_id

    except JWTError:
        # Token geçersiz, süresi dolmuş veya hatalı imzalanmışsa
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz kimlik doğrulama token'ı.",
            headers={"WWW-Authenticate": "Bearer"},
        )