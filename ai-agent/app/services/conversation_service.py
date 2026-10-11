from sqlmodel import Session, select

from app.core.db import engine
from app.models.conversation import ConversationMessage

HISTORY_LIMIT = 10  # derniers messages (client + bot confondus)


def get_recent_history(channel: str, sender_id: str, limit: int = HISTORY_LIMIT):
    with Session(engine) as session:
        statement = (
            select(ConversationMessage)
            .where(
                ConversationMessage.channel == channel,
                ConversationMessage.sender_id == sender_id,
            )
            .order_by(ConversationMessage.created_at.desc())
            .limit(limit)
        )
        messages = session.exec(statement).all()
        return list(reversed(messages))  # remet dans l'ordre chronologique


def save_message(channel: str, sender_id: str, role: str, content: str):
    with Session(engine) as session:
        session.add(ConversationMessage(
            channel=channel, sender_id=sender_id, role=role, content=content
        ))
        session.commit()