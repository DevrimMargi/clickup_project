from pydantic import BaseModel, EmailStr

class InviteRequest(BaseModel):
    email: EmailStr
    workspace_id: int
