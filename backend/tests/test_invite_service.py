import unittest
import warnings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

warnings.filterwarnings("ignore", category=DeprecationWarning)

from db.connection import Base

# 🔥 İlişkili tüm modeller
from models.user import User
from models.workspace import Workspace
from models.user_workspace import UserWorkspace
from models.invite import Invite
from models.project import Project
from models.task import Task

from auth.hashing import hash_password
from services.invite_service import create_invite   # 👈 invite service


DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


class TestInviteService(unittest.TestCase):

    @classmethod
    def tearDownClass(cls):
        engine.dispose()

    def setUp(self):
        Base.metadata.create_all(bind=engine)
        self.db = SessionLocal()

        # Admin kullanıcı
        self.admin = User(
            full_name="Admin User",
            email="admin@test.com",
            password_hash=hash_password("123456")
        )
        self.db.add(self.admin)
        self.db.commit()
        self.db.refresh(self.admin)

        # Workspace
        self.workspace = Workspace(
            name="Test Workspace",
            owner_id=self.admin.id
        )
        self.db.add(self.workspace)
        self.db.commit()
        self.db.refresh(self.workspace)

        # Admin membership
        membership = UserWorkspace(
            user_id=self.admin.id,
            workspace_id=self.workspace.id,
            role="admin"
        )
        self.db.add(membership)
        self.db.commit()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=engine)

    # ----------------------------------
    # ✅ Invite oluşturma
    # ----------------------------------
    def test_create_invite_success(self):
        invite = create_invite(
            db=self.db,
            email="member@test.com",
            workspace_id=self.workspace.id,
            role="member",
            invited_by=self.admin.id
        )

        self.assertIsNotNone(invite.token)
        self.assertEqual(invite.email, "member@test.com")
        self.assertEqual(invite.workspace_id, self.workspace.id)

    # ----------------------------------
    # ❌ Aynı email + workspace için tekrar invite
    # ----------------------------------
    def test_duplicate_invite(self):
        create_invite(
            db=self.db,
            email="member@test.com",
            workspace_id=self.workspace.id,
            role="member",
            invited_by=self.admin.id
        )

        with self.assertRaises(ValueError):
            create_invite(
                db=self.db,
                email="member@test.com",
                workspace_id=self.workspace.id,
                role="member",
                invited_by=self.admin.id
            )

    # ----------------------------------
    # ❌ Yetkisiz kullanıcı invite atamaz
    # ----------------------------------
    def test_invite_without_permission(self):
        user = User(
            full_name="Normal User",
            email="user@test.com",
            password_hash=hash_password("123456")
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        with self.assertRaises(ValueError):
            create_invite(
                db=self.db,
                email="member@test.com",
                workspace_id=self.workspace.id,
                role="member",
                invited_by=user.id
            )


if __name__ == "__main__":
    unittest.main()
