from app.agents.chatbot import business_agent, detection_agent

async def get_chat_response(message: str) -> str:
    result = await business_agent.ainvoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ]
        }
    )
    return result["messages"][-1].content

async def get_intent(message: str) -> str:
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
    return result["messages"][-1].content