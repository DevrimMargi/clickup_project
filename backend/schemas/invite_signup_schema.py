from pydantic import BaseModel, EmailStr

class InviteSignupSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    token: str
