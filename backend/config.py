# from pathlib import Path
# from typing import List
# from dotenv import load_dotenv
# from pydantic import Field
# from pydantic_settings import BaseSettings

# BASE_DIR = Path(__file__).resolve().parent
# ENV_PATH = BASE_DIR / ".env"

# if ENV_PATH.exists():
#     load_dotenv(ENV_PATH)

# class Settings(BaseSettings):
#     app_name: str = "AlumAI Backend"
#     debug: bool = True
#     GROQ_API_KEY: str = Field(default="", alias="GROQ_API_KEY")
    
#     allowed_origins: List[str] = [
#         "http://localhost:5173",
#         "http://127.0.0.1:5173",
#         "http://localhost:3000"
#     ]

#     class Config:
#         env_file = str(ENV_PATH)
#         env_file_encoding = "utf-8"
#         extra = "ignore"

# settings = Settings()

from pathlib import Path
from typing import List
from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

if ENV_PATH.exists():
    load_dotenv(ENV_PATH)

class Settings(BaseSettings):
    app_name: str = "AlumAI Backend"
    debug: bool = True
    GROQ_API_KEY: str = Field(default="", alias="GROQ_API_KEY")
    
    # JWT Settings
    SECRET_KEY: str = Field(default="alumai-super-secret-key-change-this-in-production-2025", alias="SECRET_KEY")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 24
    
    # Admin credentials (change these)
    ADMIN_USERNAME: str = Field(default="admin", alias="ADMIN_USERNAME")
    ADMIN_PASSWORD: str = Field(default="Sai", alias="ADMIN_PASSWORD")
    
    allowed_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]

    class Config:
        env_file = str(ENV_PATH)
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()