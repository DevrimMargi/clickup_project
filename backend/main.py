from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.connection import Base, engine
from auth.auth_router import router as auth_router
from workspace.workspace_router import router as workspace_router

app = FastAPI()

# ---------------------------------
# 🔥 CORS AYARLARI (GÜNCEL VE TAM)
# ---------------------------------
origins = [
    "http://localhost:5173",   # Vite frontend
    "http://localhost:5174",   # Vite bazen farklı portta çalışır
    "http://localhost:3000",   # React fallback
    "http://127.0.0.1:5173",   # local IP
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # izin verilen originler
    allow_credentials=True,
    allow_methods=["*"],           # GET POST PUT DELETE hepsini aç
    allow_headers=["*"],           # tüm headerlara izin
)
# ---------------------------------


# ---------------------------------
# 🔥 DATABASE
# ---------------------------------
Base.metadata.create_all(bind=engine)


# ---------------------------------
# 🔥 ROUTERLAR
# ---------------------------------
app.include_router(auth_router)
app.include_router(workspace_router)


# ---------------------------------
# 🔥 TEST ENDPOINT
# ---------------------------------
@app.get("/")
def home():
    return {"message": "API çalışıyor!"}
