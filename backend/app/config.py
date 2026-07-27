from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings and configuration."""
    
    # App settings
    app_name: str = "Waffle Berry Backend"
    debug: bool = True
    
    # Database settings
    database_url: str = "postgresql://user:password@localhost/waffle_berry"
    
    # API settings
    api_v1_prefix: str = "/api/v1"

    # JWT settings
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
