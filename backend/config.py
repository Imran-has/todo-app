"""Configuration module for environment variables."""
import os
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    BETTER_AUTH_SECRET: str = os.getenv("BETTER_AUTH_SECRET", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    BETTER_AUTH_URL: str = os.getenv("BETTER_AUTH_URL", "http://localhost:3000")

    def __init__(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL environment variable is required")
        if not self.BETTER_AUTH_SECRET:
            raise ValueError("BETTER_AUTH_SECRET environment variable is required")
        if len(self.BETTER_AUTH_SECRET) < 32:
            raise ValueError("BETTER_AUTH_SECRET must be at least 32 characters")


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
