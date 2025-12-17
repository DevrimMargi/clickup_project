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

    # Workspace üyelikleri
    user_workspaces = relationship(
        "UserWorkspace",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # Atandığı tasklar
    assigned_tasks = relationship("Task", back_populates="assignee")
