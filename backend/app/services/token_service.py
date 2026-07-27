"""JWT access-token creation and validation utilities."""

from datetime import datetime, timedelta, timezone

import jwt

from app.config import get_settings


class TokenValidationError(Exception):
    """Raised when an access token cannot be safely validated."""


def create_access_token(user_id: int) -> str:
    """Create a signed access token for a user ID."""
    if not isinstance(user_id, int) or isinstance(user_id, bool) or user_id <= 0:
        raise ValueError("user_id must be a positive integer")

    settings = get_settings()
    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload = {
        "sub": str(user_id),
        "iat": issued_at,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> int:
    """Validate an access token and return its user ID."""
    if not isinstance(token, str) or not token:
        raise TokenValidationError("Invalid access token")

    settings = get_settings()

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
            options={"require": ["sub", "iat", "exp"]},
        )
        subject = payload["sub"]

        if not isinstance(subject, str) or not subject:
            raise TokenValidationError("Invalid access token subject")

        user_id = int(subject)
        if user_id <= 0:
            raise TokenValidationError("Invalid access token subject")

        return user_id
    except TokenValidationError:
        raise
    except (jwt.PyJWTError, TypeError, ValueError, KeyError) as exc:
        raise TokenValidationError("Invalid or expired access token") from exc
