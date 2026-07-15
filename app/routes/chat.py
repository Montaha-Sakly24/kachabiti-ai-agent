from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse, Intent , IntentResponse
from app.services.chat_service import get_chat_response, get_intent

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        flag = await get_intent(request.message)
        if flag == Intent.NON_BUSINESS:
            return ChatResponse(
                response="مرحبًا، أنا المساعد الذكي الرسمي لشركة قشابيتي. أستطيع الإجابة عن جميع الاستفسارات المتعلقة بخدمات الشركة ومنتجاتها. أما إذا كان سؤالك لا يتعلق بقشابيتي، فسأعتذر عن عدم القدرة على الإجابة عنه."
            )
        
        response = await get_chat_response(request.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ChatResponse(response=response)