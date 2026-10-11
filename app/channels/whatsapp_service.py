import httpx

from app.core.config import WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID


def parse_incoming(payload: dict):
    """Extrait (user_id, texte, nom_affiché) d'un event WhatsApp, ou None."""
    try:
        entry = payload["entry"][0]
        change = entry["changes"][0]
        value = change["value"]
        message = value["messages"][0]
        sender_id = message["from"]
        text = message["text"]["body"]

        display_name = sender_id
        contacts = value.get("contacts", [])
        if contacts:
            display_name = contacts[0].get("profile", {}).get("name", sender_id)

        return sender_id, text, display_name
    except (KeyError, IndexError):
        return None


async def send_message(user_id: str, text: str):
    url = f"https://graph.facebook.com/v21.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            headers={"Authorization": f"Bearer {WHATSAPP_ACCESS_TOKEN}"},
            json={
                "messaging_product": "whatsapp",
                "to": user_id,
                "text": {"body": text},
            },
        )
        if response.status_code != 200:
            print("Erreur envoi WhatsApp:", response.status_code, response.text)