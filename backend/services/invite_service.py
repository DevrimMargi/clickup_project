import uuid
from sqlalchemy.orm import Session

from models.invite import Invite
from models.user_workspace import UserWorkspace


def create_invite(
    db: Session,
    email: str,
    workspace_id: int,
    role: str,
    invited_by: int
):
    """
    Workspace için davet oluşturur
    """

    # 1️⃣ Yetki kontrolü (admin mi?)
    membership = db.query(UserWorkspace).filter(
        UserWorkspace.user_id == invited_by,
        UserWorkspace.workspace_id == workspace_id,
        UserWorkspace.role == "admin"
    ).first()

    if not membership:
        raise ValueError("Bu işlem için yetkiniz yok")

    # 2️⃣ Aynı mail + workspace için invite var mı?
    existing_invite = db.query(Invite).filter(
        Invite.email == email,
        Invite.workspace_id == workspace_id,
        Invite.accepted == False
    ).first()

    if existing_invite:
        raise ValueError("Bu kullanıcı zaten davet edilmiş")

    # 3️⃣ Invite oluştur
    invite = Invite(
        email=email,
        workspace_id=workspace_id,
        role=role,
        token=str(uuid.uuid4())
    )

    db.add(invite)
    db.commit()
    db.refresh(invite)

    return invite
