"""Bearer token authentication middleware."""
from typing import Optional
import httpx
from fastapi import HTTPException, Depends, Header, Path

from config import get_settings

settings = get_settings()


class AuthenticatedUser:
    """Represents an authenticated user."""

    def __init__(self, user_id: str, email: str, name: str):
        self.user_id = user_id
        self.email = email
        self.name = name


async def get_current_user(
    authorization: Optional[str] = Header(None, alias="Authorization")
) -> AuthenticatedUser:
    """
    Validate bearer token by calling Better Auth's session endpoint.

    Returns the authenticated user or raises 401 if invalid.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Extract token from "Bearer <token>" format
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = parts[1]

    try:
        # Call Better Auth to validate the token and get session
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.BETTER_AUTH_URL}/api/auth/get-session",
                headers={"Authorization": f"Bearer {token}"},
            )

            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Not authenticated")

            data = response.json()

            if not data or "user" not in data:
                raise HTTPException(status_code=401, detail="Not authenticated")

            user = data["user"]
            return AuthenticatedUser(
                user_id=user.get("id", ""),
                email=user.get("email", ""),
                name=user.get("name", ""),
            )

    except httpx.RequestError:
        raise HTTPException(status_code=401, detail="Not authenticated")


async def verify_user_access(
    user_id: str = Path(..., description="User ID from URL"),
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> AuthenticatedUser:
    """
    Verify that the authenticated user matches the user_id in the URL path.

    Returns the authenticated user or raises 403 if mismatch.
    """
    if current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return current_user
