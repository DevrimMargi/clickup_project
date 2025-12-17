from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from db.connection import Base


class UserWorkspace(Base):
    __tablename__ = "user_workspaces"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    role = Column(String, default="member", nullable=False)

    user = relationship("User", back_populates="user_workspaces")
    workspace = relationship("Workspace", back_populates="workspace_users")
