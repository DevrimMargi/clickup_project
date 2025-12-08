from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.connection import SessionLocal
from models.workspace import Workspace
from models.invite import Invite
from schemas.invite_schema import InviteSchema

router = APIRouter(prefix="/workspace", tags=["Workspace"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create")
def create_workspace(name: str, owner_id: int, db: Session = Depends(get_db)):
    workspace = Workspace(name=name, owner_id=owner_id)
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    return {
        "message": "Workspace oluşturuldu!",
        "workspace_id": workspace.id
    }


# ✅ ÜYE DAVET ETME ENDPOINTİ
@router.post("/invite")
def invite_user(invite: InviteSchema, db: Session = Depends(get_db)):

    # Workspace var mı?
    workspace = db.query(Workspace).filter(Workspace.id == invite.workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace bulunamadı!")

    # Aynı mail daha önce davet edilmiş mi?
    existing = db.query(Invite).filter(
        Invite.workspace_id == invite.workspace_id,
        Invite.email == invite.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Bu kişi zaten davet edilmiş!")

    # Yeni davet oluştur
    new_invite = Invite(
        workspace_id=invite.workspace_id,
        email=invite.email,
        status="pending"
    )

    db.add(new_invite)
    db.commit()
    db.refresh(new_invite)

    return {"message": "Davet başarıyla gönderildi.", "invite_id": new_invite.id}
