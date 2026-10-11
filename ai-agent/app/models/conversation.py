from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class ConversationMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    channel: str
    sender_id: str
    role: str  # "user" ou "assistant"
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))