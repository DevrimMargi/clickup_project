from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.connection import Base


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 🔗 İlişkiler
    owner = relationship("User", back_populates="owned_workspaces")

    workspace_users = relationship(
        "UserWorkspace",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )

    projects = relationship(
        "Project",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )
