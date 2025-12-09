from fastapi import APIRouter
from routers.invite_router import router as invite_router

api_routers = APIRouter()

# Invite router ekliyoruz
api_routers.include_router(invite_router)
