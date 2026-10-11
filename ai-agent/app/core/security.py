from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.services.auth import decode_access_token
from app.core.config import ADMIN_USERNAME

security = HTTPBearer()


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        username = decode_access_token(credentials.credentials)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session invalide, merci de te reconnecter.",
        )

    if username != ADMIN_USERNAME:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Accès non autorisé.",
        )

    return username