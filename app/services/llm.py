from langchain_nvidia_ai_endpoints import ChatNVIDIA
from app.core.config import NVIDIA_API_KEY, MODEL_NAME

llm = ChatNVIDIA(
    model=MODEL_NAME,
    api_key=NVIDIA_API_KEY,
    temperature=0.2,
)
