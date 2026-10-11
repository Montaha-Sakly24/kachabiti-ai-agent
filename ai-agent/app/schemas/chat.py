from pydantic import BaseModel
from enum import Enum


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


class Intent(str, Enum):
    SOCIAL = "SOCIAL"
    BUSINESS = "BUSINESS"
    NON_BUSINESS = "NON_BUSINESS"

    
class IntentResponse(BaseModel):
    flag: Intent