from sqlmodel import SQLModel, Field

class BotSettings(SQLModel, table=True):
    id: int = Field(default=1, primary_key=True)
    bot_enabled: bool = True

