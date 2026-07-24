from app.agents.chatbot import detection_agent
from app.schemas.chat import Intent
from app.services.rag_service import rag_answer

# async def get_chat_response(message: str) -> str:
#     result = await business_agent.ainvoke(
#         {
#             "messages": [
#                 {
#                     "role": "user",
#                     "content": message
#                 }
#             ]
#         }
#     )
#     return result["messages"][-1].content

NON_BUSINESS_MESSAGE = (
    "مرحبًا، أنا المساعد الذكي الرسمي لشركة قشابيتي. "
    "أستطيع الإجابة فقط عن الأسئلة المتعلقة بخدمات ومنتجات قشابيتي."
)

async def process_message(message: str) -> str:
    result = await detection_agent.ainvoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ]
        }
    )
    intent = result["messages"][-1].content.strip()

    if intent == Intent.NON_BUSINESS.value:
        return NON_BUSINESS_MESSAGE
    
    return await rag_answer(message)
