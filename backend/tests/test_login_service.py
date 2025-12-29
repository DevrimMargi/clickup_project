import unittest
import warnings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Test çıktısını temiz tutmak için
warnings.filterwarnings("ignore", category=DeprecationWarning)

from db.connection import Base

# 🔥 User ile ilişkili TÜM modeller (mapper sorunlarını önlemek için)
from models.user import User
from models.workspace import Workspace
from models.user_workspace import UserWorkspace
from models.project import Project
from models.task import Task
from models.invite import Invite

from auth.auth_service import login_user
from auth.hashing import hash_password


# -----------------------------
# Test DB (SQLite – RAM)
# -----------------------------
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


class TestLoginService(unittest.TestCase):

    @classmethod
    def tearDownClass(cls):
        """Tüm testler bittikten sonra DB engine'i temizle"""
        engine.dispose()

    def setUp(self):
        # Tabloları oluştur
        Base.metadata.create_all(bind=engine)
        self.db = SessionLocal()

        # Test kullanıcısı
        user = User(
            full_name="Test User",
            email="test@example.com",
            password_hash=hash_password("123456")
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        # Workspace
        workspace = Workspace(
            name="Test Workspace",
            owner_id=user.id
        )
        self.db.add(workspace)
        self.db.commit()
        self.db.refresh(workspace)

        # Membership
        membership = UserWorkspace(
            user_id=user.id,
            workspace_id=workspace.id,
            role="admin"
        )
        self.db.add(membership)
        self.db.commit()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=engine)

    # ----------------------------------
    # ✅ Başarılı login
    # ----------------------------------
    def test_login_success(self):
        result = login_user(
            db=self.db,
            email="test@example.com",
            password="123456"
        )
        self.assertIn("token", result)
        self.assertIsNotNone(result["user_id"])
        self.assertIsNotNone(result["workspace_id"])

    # ----------------------------------
    # ❌ Yanlış şifre
    # ----------------------------------
    def test_login_wrong_password(self):
        with self.assertRaises(ValueError):
            login_user(
                db=self.db,
                email="test@example.com",
                password="wrong"
            )

    # ----------------------------------
    # ❌ Kullanıcı yok
    # ----------------------------------
    def test_login_user_not_found(self):
        with self.assertRaises(ValueError):
            login_user(
                db=self.db,
                email="nouser@example.com",
                password="123456"
            )

    # ----------------------------------
    # ❌ Boş alanlar
    # ----------------------------------
    def test_login_empty_fields(self):
        with self.assertRaises(ValueError):
            login_user(
                db=self.db,
                email="",
                password=""
            )


if __name__ == "__main__":
    unittest.main()
