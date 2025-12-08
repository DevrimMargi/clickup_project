from pydantic import BaseModel

class InviteSchema(BaseModel):
    workspace_id: int
    email: str
