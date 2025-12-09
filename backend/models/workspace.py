from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.connection import Base

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Workspace'in sahibi
    owner = relationship("User", back_populates="owned_workspaces")

    # Workspace'in üyeleri (UserWorkspace tablosu ile bağlantı)
    members = relationship("UserWorkspace", back_populates="workspace")
