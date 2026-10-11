import json
from app.agents.chatbot import detection_agent, router_agent, social_agent, rewrite_agent, order_agent
from app.schemas.chat import Intent

from app.services.rag_service import rag_answer
from app.services.conversation_service import get_recent_history, save_message
from app.services.order_service import create_order, has_pending_order

NON_BUSINESS_MESSAGE = (
    "مرحبًا، أنا المساعد الذكي الرسمي لشركة قشابيتي. "
    "أستطيع الإجابة فقط عن الأسئلة المتعلقة بخدمات ومنتجات قشابيتي 🙏"
)

VALID_COLLECTIONS = {"knowledge_base", "products"}

REAL_CHANNELS = {"messenger", "whatsapp"}

async def process_message(
    message: str,
    channel: str | None = None,
    sender_id: str | None = None,
    sender_name: str | None = None,
) -> str:
    # Playground admin : session dédiée, pour profiter aussi de la mémoire
    channel = channel or "playground"
    sender_id = sender_id or "admin-session"

    history = get_recent_history(channel, sender_id)
    standalone_query = await rewrite_with_history(message, history)

    save_message(channel, sender_id, "user", message)

    result = await detection_agent.ainvoke(
        {"messages": [{"role": "user", "content": standalone_query}]}
    )
    intent = result["messages"][-1].content.strip()

    if intent == Intent.SOCIAL.value:
        reply = await get_social_reply(message)
        save_message(channel, sender_id, "assistant", reply)
        return reply

    if intent == Intent.NON_BUSINESS.value:
        save_message(channel, sender_id, "assistant", NON_BUSINESS_MESSAGE)
        return NON_BUSINESS_MESSAGE

    collections = await get_collections(standalone_query)

    reply = await rag_answer(
        collection_names=collections,
        query=standalone_query,
        history=history,
        channel=channel,
        sender_id=sender_id,
        sender_name=sender_name,
    )

    save_message(channel, sender_id, "assistant", reply)

    if channel in REAL_CHANNELS:
        await try_detect_order(channel, sender_id, sender_name, history, message, reply)
    
    return reply


async def rewrite_with_history(message: str, history: list) -> str:
    if not history:
        return message

    history_text = "\n".join(f"{m.role}: {m.content}" for m in history)

    prompt = f"""Historique de la conversation :
{history_text}

Dernier message du client :
{message}
"""
    try:
        result = await rewrite_agent.ainvoke(
            {"messages": [{"role": "user", "content": prompt}]}
        )
        rewritten = result["messages"][-1].content.strip()
        return rewritten or message
    except Exception as e:
        print(f"⚠️ Erreur rewrite_agent: {e}")
        return message


async def get_social_reply(message: str) -> str:
    result = await social_agent.ainvoke(
        {"messages": [{"role": "user", "content": message}]}
    )
    return result["messages"][-1].content.strip()


async def get_collections(message: str) -> list[str]:
    result = await router_agent.ainvoke(
        {"messages": [{"role": "user", "content": message}]}
    )
    raw = result["messages"][-1].content.strip()

    candidates = [c.strip() for c in raw.split(",")]
    valid = [c for c in candidates if c in VALID_COLLECTIONS]

    seen = set()
    valid = [c for c in valid if not (c in seen or seen.add(c))]

    if not valid:
        print(f"⚠️ Router a renvoyé une valeur invalide: {raw!r} — repli sur 'knowledge_base'")
        return ["knowledge_base"]

    return valid


async def try_detect_order(
    channel: str,
    sender_id: str,
    sender_name: str | None,
    history: list,
    message: str,
    reply: str,
):
    if has_pending_order(channel, sender_id):
        return  # déjà une commande non traitée pour ce client, on ne duplique pas

    history_text = "\n".join(f"{m.role}: {m.content}" for m in history[-8:])
    conversation_text = f"{history_text}\nuser: {message}\nassistant: {reply}"

    try:
        result = await order_agent.ainvoke(
            {"messages": [{"role": "user", "content": conversation_text}]}
        )
        raw = result["messages"][-1].content.strip()

        if raw == "NO_ORDER" or not raw:
            return

        data = json.loads(raw)

        required = ["customer_name", "phone", "address", "height", "weight", "quantity"]
        if any(not data.get(field) for field in required):
            return

        create_order(
            channel=channel,
            sender_id=sender_id,
            sender_name=sender_name,
            customer_name=data.get("customer_name", ""),
            phone=data.get("phone", ""),
            address=data.get("address", ""),
            height=data.get("height", ""),
            weight=data.get("weight", ""),
            product_hint=data.get("product_hint", ""),
            quantity=data.get("quantity", ""),
        )
    except Exception as e:
        print(f"⚠️ Erreur détection commande: {e}")