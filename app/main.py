from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from app.routes.chat import router as chat_router
from app.routes.faq import router as faq_router
from app.routes.auth import router as auth_router
from app.routes.webhooks import router as webhooks_router
from app.routes.settings import router as settings_router
from app.routes.orders import router as orders_router

from app.routes.inbox import router as inbox_router
from app.core.security import get_current_admin
from app.core.db import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title="Qachabiti AI Chatbot", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/privacy-policy", response_class=HTMLResponse)
async def privacy_policy():
    return """
    <html>
    <head><title>Politique de confidentialité — Kachabiti</title></head>
    <body style="font-family: sans-serif; max-width: 700px; margin: 40px auto; line-height: 1.6;">
        <h1>Politique de confidentialité — Kachabiti</h1>
        <p>Cette politique explique comment Kachabiti collecte et utilise les informations
        lorsque vous interagissez avec notre assistant automatisé via Messenger ou WhatsApp.</p>

        <h2>Informations collectées</h2>
        <p>Nous collectons uniquement les informations que vous nous envoyez directement dans
        la conversation (nom, numéro de téléphone, adresse, contenu de vos messages), dans le
        but de répondre à vos questions et traiter vos commandes.</p>

        <h2>Utilisation des informations</h2>
        <p>Ces informations sont utilisées uniquement pour répondre à vos demandes, traiter vos
        commandes et améliorer notre service client. Nous ne vendons ni ne partageons vos
        données avec des tiers à des fins commerciales.</p>

        <h2>Conservation des données</h2>
        <p>Vos messages sont conservés le temps nécessaire au traitement de votre demande.</p>

        <h2>Contact</h2>
        <p>Pour toute question concernant vos données, contactez-nous à :
        saklymontaha@gmail.com</p>
    </body>
    </html>
    """


app.include_router(auth_router)
app.include_router(webhooks_router)
app.include_router(chat_router, dependencies=[Depends(get_current_admin)])
app.include_router(faq_router, dependencies=[Depends(get_current_admin)])
app.include_router(inbox_router, dependencies=[Depends(get_current_admin)])
app.include_router(settings_router, dependencies=[Depends(get_current_admin)])
app.include_router(orders_router, dependencies=[Depends(get_current_admin)])
