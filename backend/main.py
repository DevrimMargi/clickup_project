from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from db.connection import engine, SessionLocal, Base

# 🔥 MODELLERİ BURADA IMPORT ET (ÇOK ÖNEMLİ)
from models.user import User
from models.workspace import Workspace
from models.project import Project
from models.task import Task
from models.invite import Invite

# Routers
from auth.auth_router import router as auth_router
from workspace.workspace_router import router as workspace_router
from routers.project_router import router as project_router
from routers.task_router import router as task_router
from routers.invite_router import router as invite_router
from routers.invite_signup_router import router as invite_signup_router

app = FastAPI(title="ClickUp Clone API")

# -------------------------------------------------
# ✅ CORS (EN ÜSTE)
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# ✅ STARTUP EVENT (TEK VE DOĞRU create_all)
# -------------------------------------------------

# -------------------------------------------------
app.include_router(auth_router)
app.include_router(workspace_router)
app.include_router(project_router)
app.include_router(task_router)
app.include_router(invite_router)
app.include_router(invite_signup_router)

# -------------------------------------------------
# ROOT
# -------------------------------------------------
@app.get("/")
def home():
    return {"message": "API çalışıyor 🚀"}

# -------------------------------------------------
# DB TEST
# -------------------------------------------------
@app.get("/db-test")
def db_test():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "connected"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}
