from app.rag.retriever import retrieve
from app.agents.chatbot import business_agent
from app.services.inbox_service import create_pending_question

FAQ_SCORE_THRESHOLD = 0.30
PRODUCT_SCORE_THRESHOLD = 0.20

FALLBACK_MESSAGE = (
    "لحظة، نثبت ونرجعلك 🙏 "
    "أو تنجم تتصل بينا توا على الرقم 📞 55558648."
)


def _threshold_for(collection_name: str) -> float:
    return PRODUCT_SCORE_THRESHOLD if "product" in collection_name.lower() else FAQ_SCORE_THRESHOLD


async def rag_answer(
    collection_names: list[str],
    query: str,
    history: list | None = None,
    channel: str | None = None,
    sender_id: str | None = None,
    sender_name: str | None = None,
) -> str:

    all_relevant = []

    for collection_name in collection_names:
        try:
            results = retrieve(collection_name=collection_name, query=query)
        except Exception as e:
            print(f"⚠️ Erreur Qdrant pour la collection '{collection_name}': {e}")
            continue

        threshold = _threshold_for(collection_name)
        all_relevant.extend(p for p in results if p.score >= threshold)

    if not all_relevant:
        if channel and sender_id:
            create_pending_question(
                channel=channel,
                sender_id=sender_id,
                message=query,
                sender_name=sender_name,
            )
        return FALLBACK_MESSAGE

    context = "\n\n".join(point.payload["text"] for point in all_relevant)
    history_text = "\n".join(f"{m.role}: {m.content}" for m in (history or [])[-10:])

    prompt = f"""
*HISTORIQUE DE LA CONVERSATION (informations déjà données par le client — ne jamais les redemander) :
{history_text if history_text else "(aucun historique)"}

*CONTEXTE (infos produits / FAQ) :
{context}

*DERNIER MESSAGE DU CLIENT :
{query}

*INSTRUCTIONS:
- Réponds uniquement à partir du CONTEXTE pour les infos produits/FAQ.
- Utilise l'HISTORIQUE pour savoir quelles informations de commande le client a DÉJÀ données (nom, taille, poids, téléphone, adresse, quantité) — ne les redemande JAMAIS si elles apparaissent déjà dans l'historique.
- Réponds directement au client, comme le ferait une vraie personne du magasin.
- Réponds en dialecte tunisien (تونسي), jamais en arabe classique/formel.
- Réponds uniquement avec la réponse finale, sans montrer ton raisonnement.
- Ne mentionne jamais les mots "CONTEXTE" ou "HISTORIQUE" dans ta réponse.
- N'invente aucune information.
"""

    try:
        response = await business_agent.ainvoke(
            {"messages": [{"role": "user", "content": prompt}]}
        )
    except Exception as e:
        print(f"⚠️ Erreur LLM business_agent: {e}")
        if channel and sender_id:
            create_pending_question(
                channel=channel,
                sender_id=sender_id,
                message=query,
                sender_name=sender_name,
            )
        return FALLBACK_MESSAGE

    raw_reply = response["messages"][-1].content

    if "[NEEDS_ADMIN]" in raw_reply:
        clean_reply = raw_reply.replace("[NEEDS_ADMIN]", "").strip()
        if channel and sender_id:
            create_pending_question(
                channel=channel,
                sender_id=sender_id,
                message=query,
                sender_name=sender_name,
            )
        return clean_reply

    return raw_reply