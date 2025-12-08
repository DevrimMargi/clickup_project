from sqlalchemy import Column, Integer, String, ForeignKey
from db.connection import Base

class Invite(Base):
    __tablename__ = "invites"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
