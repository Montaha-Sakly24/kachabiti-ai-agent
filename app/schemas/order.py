from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class OrderResponse(BaseModel):
    id: int
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
    created_at: datetime