from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: str

    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_TLS: bool
    MAIL_SSL: bool

    class Config:
        env_file = ".env"

settings = Settings()
