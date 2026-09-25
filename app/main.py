from fastapi import FastAPI

from app.routes.chat import router as chat_router
from app.routes.faq import router as faq_router

app = FastAPI( title="Qachabiti AI Chatbot")
app.include_router(chat_router)
app.include_router(faq_router)