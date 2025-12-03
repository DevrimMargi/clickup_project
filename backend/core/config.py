from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_NAME: str = "clickup"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "123456"
    DB_HOST: str = "localhost"
    DB_PORT: str = "5432"

    class Config:
        env_file = ".env"

settings = Settings()
