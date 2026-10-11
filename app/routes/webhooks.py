from fastapi import APIRouter, Request, BackgroundTasks, HTTPException, Response

from app.core.config import MESSENGER_VERIFY_TOKEN, WHATSAPP_VERIFY_TOKEN
from app.core.webhook_security import verify_signature
from app.channels import messenger_service, whatsapp_service
from app.services.chat_service import process_message
from app.services.inbox_service import resolve_pending_for_sender, create_pending_question
from app.services.settings_service import is_bot_enabled

router = APIRouter(prefix="/webhook", tags=["Webhooks"])


# ---------- MESSENGER ----------

@router.get("/messenger")
async def verify_messenger(request: Request):
    params = request.query_params
    if (
        params.get("hub.mode") == "subscribe"
        and params.get("hub.verify_token") == MESSENGER_VERIFY_TOKEN
    ):
        return Response(content=params.get("hub.challenge"), media_type="text/plain")
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/messenger")
async def receive_messenger(request: Request, background_tasks: BackgroundTasks):
    body = await request.body()
    signature = request.headers.get("X-Hub-Signature-256")

    if not verify_signature(body, signature):
        raise HTTPException(status_code=403, detail="Invalid signature")

    payload = await request.json()
    print("PAYLOAD REÇU:", payload)

    # Cas 1 : l'admin a répondu directement depuis Messenger
    echo_client_id = messenger_service.parse_echo(payload)
    if echo_client_id:
        background_tasks.add_task(resolve_pending_for_sender, "messenger", echo_client_id)
        return {"status": "ok"}

    # Cas 2 : vrai message d'un client
    parsed = messenger_service.parse_incoming(payload)
    if parsed:
        user_id, text = parsed
        background_tasks.add_task(handle_messenger_message, user_id, text)

    return {"status": "ok"}


async def handle_messenger_message(user_id: str, text: str):
    sender_name = await messenger_service.get_profile_name(user_id)

    if not is_bot_enabled():
        create_pending_question("messenger", user_id, text, sender_name)
        return

    reply = await process_message(text, channel="messenger", sender_id=user_id, sender_name=sender_name)
    await messenger_service.send_message(user_id, reply)

# ---------- WHATSAPP ----------

@router.get("/whatsapp")
async def verify_whatsapp(request: Request):
    params = request.query_params
    if (
        params.get("hub.mode") == "subscribe"
        and params.get("hub.verify_token") == WHATSAPP_VERIFY_TOKEN
    ):
        return Response(content=params.get("hub.challenge"), media_type="text/plain")
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/whatsapp")
async def receive_whatsapp(request: Request, background_tasks: BackgroundTasks):
    body = await request.body()
    signature = request.headers.get("X-Hub-Signature-256")

    if not verify_signature(body, signature):
        raise HTTPException(status_code=403, detail="Invalid signature")

    payload = await request.json()
    parsed = whatsapp_service.parse_incoming(payload)

    if parsed:
        user_id, text, sender_name = parsed
        background_tasks.add_task(handle_whatsapp_message, user_id, text, sender_name)

    return {"status": "ok"}


async def handle_whatsapp_message(user_id: str, text: str, sender_name: str):
    if not is_bot_enabled():
        create_pending_question("whatsapp", user_id, text, sender_name)
        return

    reply = await process_message(text, channel="whatsapp", sender_id=user_id, sender_name=sender_name)
    await whatsapp_service.send_message(user_id, reply)