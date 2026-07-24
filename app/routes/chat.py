from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse, Intent , IntentResponse
from app.services.chat_service import process_message
from app.services.rag_service import rag_answer 

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        
        response = await process_message(request.message)
        return ChatResponse(response=response)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

