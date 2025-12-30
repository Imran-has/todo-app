"""Database configuration and session management."""
from typing import AsyncGenerator
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from config import get_settings

settings = get_settings()

# Fix DATABASE_URL for asyncpg: convert sslmode to ssl
database_url = settings.DATABASE_URL
if "sslmode=" in database_url:
    database_url = database_url.replace("sslmode=", "ssl=")

# Create async engine for Neon PostgreSQL
# NullPool is recommended for serverless environments
engine = create_async_engine(
    database_url,
    echo=False,
    poolclass=NullPool,
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db() -> None:
    """Initialize the database by creating all tables."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get async database session."""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
