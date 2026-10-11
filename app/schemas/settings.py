from pydantic import BaseModel


class BotStatus(BaseModel):
    enabled: bool