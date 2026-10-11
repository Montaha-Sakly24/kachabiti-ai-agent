import httpx

from app.core.config import MESSENGER_PAGE_ACCESS_TOKEN,META_APP_ID

GRAPH_URL = "https://graph.facebook.com/v21.0/me/messages"


def parse_incoming(payload: dict):
    """Extrait (user_id, texte) d'un vrai message client, ou None si non pertinent."""
    try:
        entry = payload["entry"][0]
        messaging = entry["messaging"][0]

        if messaging.get("message", {}).get("is_echo"):
            return None  # c'est une réponse de l'admin, pas un message client

        sender_id = messaging["sender"]["id"]
        text = messaging["message"]["text"]
        return sender_id, text
    except (KeyError, IndexError):
        return None


def parse_echo(payload: dict):
    """Si ce payload est une réponse MANUELLE envoyée par l'admin depuis
    l'interface Messenger native (pas par notre bot), retourne l'id du client.
    Sinon None."""
    try:
        entry = payload["entry"][0]
        messaging = entry["messaging"][0]
        message = messaging.get("message", {})

        if not message.get("is_echo"):
            return None

        # Si l'app_id correspond à notre propre App, c'est notre bot qui a parlé
        # (pas l'admin) → on ignore.
        if str(message.get("app_id")) == str(META_APP_ID):
            return None

        return messaging["recipient"]["id"]
    except (KeyError, IndexError):
        return None


async def get_profile_name(sender_id: str) -> str:
    async with httpx.AsyncClient() as client:

        # 1) User Profile API (marche seulement pour les comptes avec un rôle sur l'App)
        try:
            response = await client.get(
                f"https://graph.facebook.com/v21.0/{sender_id}",
                params={
                    "fields": "first_name,last_name",
                    "access_token": MESSENGER_PAGE_ACCESS_TOKEN,
                },
            )
            data = response.json()
            name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
            if name:
                return name
            print("Profile API sans nom:", data)
        except Exception as e:
            print("Erreur Profile API:", e)

        # 2) Conversations API : lit le nom dans la boîte de réception de la Page
        try:
            response = await client.get(
                "https://graph.facebook.com/v21.0/me/conversations",
                params={
                    "platform": "messenger",
                    "user_id": sender_id,
                    "fields": "participants",
                    "access_token": MESSENGER_PAGE_ACCESS_TOKEN,
                },
            )
            data = response.json()
            for conversation in data.get("data", []):
                for participant in conversation.get("participants", {}).get("data", []):
                    if participant.get("id") == sender_id and participant.get("name"):
                        return participant["name"]
            print("Conversations API sans nom:", data)
        except Exception as e:
            print("Erreur Conversations API:", e)

    return sender_id


async def send_message(user_id: str, text: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GRAPH_URL,
            params={"access_token": MESSENGER_PAGE_ACCESS_TOKEN},
            json={
                "recipient": {"id": user_id},
                "message": {"text": text},
            },
        )
        if response.status_code != 200:
            print("Erreur envoi Messenger:", response.status_code, response.text)