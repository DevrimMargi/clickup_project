from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from db.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)

    # 🔐 Şifre sıfırlama alanları
    password_reset_token = Column(String, nullable=True)
    password_reset_expires = Column(DateTime, nullable=True)

    # 🔗 Workspace üyelikleri (member / admin rolü)
    user_workspaces = relationship(
        "UserWorkspace",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # 🔥 Sahibi olduğu workspace'ler
    owned_workspaces = relationship(
        "Workspace",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    # 📌 Atandığı task'lar
    assigned_tasks = relationship(
        "Task",
        back_populates="assignee"
    )
