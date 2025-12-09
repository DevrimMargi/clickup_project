from pydantic import BaseModel

class InviteSignupSchema(BaseModel):
    full_name: str
    email: str
    password: str
    token: str
