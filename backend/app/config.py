from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    OPENAI_API_KEY: str
    ANTHROPIC_API_KEY: str  
    # GEMINI_API_KEY: str  
    GROQ_API_KEY: str
    XAI_API_KEY: str  
    MISTRAL_API_KEY: str

    # RESEND_API_KEY: str  
    # ADMIN_EMAIL: str 
    
    # Email Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    ADMIN_EMAIL: str
    FRONTEND_URL: str = "http://localhost:3000"
    class Config:
        env_file = ".env"

settings = Settings()