from app.agents.chatbot import agent

response = agent.invoke(
    {
        "messages": [
            {
                "role": "user", 
                "content": "Bonjour, qui est-tu ?"
            }
        ]
    }
)

print(response)