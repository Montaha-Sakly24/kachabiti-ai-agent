from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class PendingQuestionResponse(BaseModel):
    id: int
    channel: str
    sender_id: str
    sender_name: Optional[str] = None
    message: str
    created_at: datetime


class ReplyRequest(BaseModel):
    reply: str


class SenderReplyRequest(BaseModel):
    channel: str
    sender_id: str
    reply: str

class DismissSenderRequest(BaseModel):
    channel: str
    sender_id: str