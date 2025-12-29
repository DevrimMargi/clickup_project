import unittest
import warnings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Test çıktısını temiz tut
warnings.filterwarnings("ignore", category=DeprecationWarning)

from db.connection import Base

# 🔥 İlişkili tüm modeller (mapper sorunlarını önlemek için)
from models.user import User
from models.workspace import Workspace
from models.user_workspace import UserWorkspace
from models.project import Project
from models.task import Task
from models.invite import Invite

from auth.auth_service import signup_user


# -----------------------------
# Test DB (SQLite – RAM)
# -----------------------------
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


class TestSignupService(unittest.TestCase):

    @classmethod
    def tearDownClass(cls):
        engine.dispose()

    def setUp(self):
        Base.metadata.create_all(bind=engine)
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=engine)

    # ----------------------------------
    # ✅ Başarılı signup
    # ----------------------------------
    def test_signup_success(self):
        result = signup_user(
            db=self.db,
            full_name="Test User",
            email="test@example.com",
            password="123456"
        )

        self.assertIn("token", result)
        self.assertIsNotNone(result["user_id"])

        # DB'de kullanıcı oluştu mu?
        user = self.db.query(User).filter(
            User.email == "test@example.com"
        ).first()
        self.assertIsNotNone(user)

    # ----------------------------------
    # ❌ Aynı e-posta ile signup
    # ----------------------------------
    def test_signup_duplicate_email(self):
        signup_user(
            db=self.db,
            full_name="Test User",
            email="test@example.com",
            password="123456"
        )

        with self.assertRaises(ValueError):
            signup_user(
                db=self.db,
                full_name="Another User",
                email="test@example.com",
                password="abcdef"
            )

    # ----------------------------------
    # ❌ Boş alanlar
    # ----------------------------------
    def test_signup_empty_fields(self):
        with self.assertRaises(ValueError):
            signup_user(
                db=self.db,
                full_name="",
                email="",
                password=""
            )


if __name__ == "__main__":
    unittest.main()
