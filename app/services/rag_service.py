from app.rag.retriever import retrieve
from app.agents.chatbot import business_agent 

async def rag_answer(collection_name: str, query: str) ->str:

    results = retrieve(
        collection_name = collection_name, 
        query = query
    )

    context= "\n\n".join(
        point.payload["text"] 
        for point in results    
    )

    prompt = f"""
*CONTEXTE :
{context}

*QUESTION DU CLIENT:
{query}

*INSTRUCTIONS:
- Réponds uniquement à partir du CONTEXTE.
- Réponds directement au client.
- Réponds uniquement avec la réponse finale.
- Ne montre pas ton raisonnement ni tes étapes d'analyse.
- Ne mentionne pas le CONTEXTE.
- N'invente aucune information.
- Réponds toujours en arabe.
- Si la réponse n'existe pas dans le CONTEXTE, réponds exactement :

لا أملك هذه المعلومة.

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

    print(response)
    return response["messages"][-1].content
    