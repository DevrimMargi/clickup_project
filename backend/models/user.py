from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from db.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)

    # Kullanıcının sahibi olduğu workspace'ler
    owned_workspaces = relationship("Workspace", back_populates="owner")

    # Kullanıcının üye olduğu workspace'ler
    memberships = relationship("UserWorkspace", back_populates="user")
