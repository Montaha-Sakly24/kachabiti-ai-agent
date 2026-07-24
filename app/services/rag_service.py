from app.rag.retriever import retrieve
from app.agents.chatbot import business_agent 

async def rag_answer(query: str):
    results = retrieve(query)
    context= "\n\n".join(
        point.payload["text"] 
        for point in results    
    )

    prompt = f"""
Utilise uniquement les informations du CONTEXTE pour répondre.

Si le contexte ne contient pas la réponse, répond exactement :

"لا أملك هذه المعلومة."

CONTEXTE :
{context}

QUESTION :
{query}

"""
    
    response = await business_agent.ainvoke(
         {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
    )

    return response["messages"][-1].content
    