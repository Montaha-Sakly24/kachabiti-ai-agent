from fastapi import APIRouter, HTTPException

from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth import verify_password, create_access_token
from app.core.config import ADMIN_USERNAME, ADMIN_PASSWORD_HASH

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    valid_username = payload.username == ADMIN_USERNAME
    valid_password = valid_username and verify_password(payload.password, ADMIN_PASSWORD_HASH)

    if not valid_password:
        raise HTTPException(status_code=401, detail="Nom d'utilisateur ou mot de passe incorrect.")

    token = create_access_token(ADMIN_USERNAME)
    return LoginResponse(access_token=token)