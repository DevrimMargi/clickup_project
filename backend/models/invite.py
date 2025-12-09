from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db.connection import Base

class Invite(Base):
    __tablename__ = "invites"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    token = Column(String, unique=True, nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    accepted = Column(Boolean, default=False)

    workspace = relationship("Workspace")
