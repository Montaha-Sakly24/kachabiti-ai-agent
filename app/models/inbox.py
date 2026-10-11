from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class UnansweredQuestion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    channel: str
    sender_id: str
    sender_name: Optional[str] = None
    message: str
    status: str = Field(default="pending")
    admin_reply: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    answered_at: Optional[datetime] = None