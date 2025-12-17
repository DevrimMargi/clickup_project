from db.connection import engine, Base

# MODELLERİ IMPORT ET (ÇOK ÖNEMLİ)
from models.user import User
from models.workspace import Workspace
from models.project import Project
from models.task import Task
from models.invite import Invite

Base.metadata.create_all(bind=engine)
print("✅ Tüm tablolar oluşturuldu")
