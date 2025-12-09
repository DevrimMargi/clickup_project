from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from db.connection import Base

class UserWorkspace(Base):
    __tablename__ = "user_workspaces"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))

    # İlişkiler
    user = relationship("User", back_populates="workspaces")
    workspace = relationship("Workspace", back_populates="members")
