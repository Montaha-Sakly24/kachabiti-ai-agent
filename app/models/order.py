from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    channel: str
    sender_id: str
    sender_name: Optional[str] = None
    customer_name: str
    phone: str
    address: str
    height: Optional[str] = None
    weight: Optional[str] = None
    product_hint: Optional[str] = None
    quantity: Optional[str] = None
    status: str = Field(default="new")  # new | handled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    handled_at: Optional[datetime] = None