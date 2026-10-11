from fastapi import APIRouter

from app.schemas.settings import BotStatus
from app.services.settings_service import is_bot_enabled, set_bot_enabled

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("/bot", response_model=BotStatus)
async def get_bot_status():
    return BotStatus(enabled=is_bot_enabled())


@router.put("/bot", response_model=BotStatus)
async def update_bot_status(payload: BotStatus):
    return BotStatus(enabled=set_bot_enabled(payload.enabled))