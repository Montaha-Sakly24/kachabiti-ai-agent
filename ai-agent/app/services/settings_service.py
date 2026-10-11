from sqlmodel import Session

from app.core.db import engine
from app.models.settings import BotSettings


def is_bot_enabled() -> bool:
    with Session(engine) as session:
        settings = session.get(BotSettings, 1)
        return settings.bot_enabled if settings else True


def set_bot_enabled(enabled: bool) -> bool:
    with Session(engine) as session:
        settings = session.get(BotSettings, 1)

        if settings:
            settings.bot_enabled = enabled
        else:
            settings = BotSettings(id=1, bot_enabled=enabled)

        session.add(settings)
        session.commit()
        return enabled