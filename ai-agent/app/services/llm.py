from langchain_openai  import ChatOpenAI
from app.core.config import OPENAI_API_KEY, MODEL_NAME

llm = ChatOpenAI(
    model=MODEL_NAME,
    api_key=OPENAI_API_KEY,
    temperature=0.2,
    max_tokens=2000,
)
