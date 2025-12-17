from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.connection import Base


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User")
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
