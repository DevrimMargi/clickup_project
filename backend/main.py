from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from db.connection import Base, engine, SessionLocal
from sqlalchemy import text
from sqlalchemy.orm import Session

# Router Imports
from auth.auth_router import router as auth_router
from workspace.workspace_router import router as workspace_router
from routers.api_routers import api_routers
from routers.invite_router import router as invite_router
from routers.invite_signup_router import router as invite_signup_router

app = FastAPI()

# ---------------------------------
# 🔥 CORS AYARLARI
# ---------------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"  # ⭐ GEÇİCİ OLARAK TÜM ORIGIN'LERE İZİN VER
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------
# 🔥 DATABASE
# ---------------------------------
Base.metadata.create_all(bind=engine)


# ---------------------------------
# 🔥 DB SESSION
# ---------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------
# 🔥 ROUTERLAR
# ---------------------------------
app.include_router(auth_router)
app.include_router(workspace_router)
app.include_router(api_routers)
app.include_router(invite_router)
app.include_router(invite_signup_router)


# ---------------------------------
# 🔥 ROOT
# ---------------------------------
@app.get("/")
def home():
    return {"message": "API çalışıyor!"}


# ---------------------------------
# 🔥 DB TEST
# ---------------------------------
@app.get("/db-test")
def db_test():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "connected", "message": "PostgreSQL bağlantısı başarılı!"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


# ---------------------------------
# 🔥 AKTİF DATABASE ÖĞRENME
# ---------------------------------
@app.get("/db-current")
def db_current(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT current_database(), current_schema();")).fetchone()
    return {"database": result[0], "schema": result[1]}
