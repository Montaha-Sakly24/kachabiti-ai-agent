from app.services.llm import llm

response = llm.invoke("Hello, how are you doing today?")
print(response.content)