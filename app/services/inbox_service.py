from datetime import datetime, timezone
from sqlmodel import Session, select

from app.core.db import engine
from app.models.inbox import UnansweredQuestion
from app.channels import messenger_service, whatsapp_service


def create_pending_question(
    channel: str,
    sender_id: str,
    message: str,
    sender_name: str | None = None,
):
    with Session(engine) as session:
        question = UnansweredQuestion(
            channel=channel,
            sender_id=sender_id,
            sender_name=sender_name or sender_id,
            message=message,
        )
        session.add(question)
        session.commit()


def list_pending_questions():
    with Session(engine) as session:
        statement = (
            select(UnansweredQuestion)
            .where(UnansweredQuestion.status == "pending")
            .order_by(UnansweredQuestion.created_at.desc())
        )
        return session.exec(statement).all()


async def reply_to_question(question_id: int, reply_text: str):
    with Session(engine) as session:
        question = session.get(UnansweredQuestion, question_id)

        if not question:
            return None

        if question.channel == "messenger":
            await messenger_service.send_message(question.sender_id, reply_text)
        elif question.channel == "whatsapp":
            await whatsapp_service.send_message(question.sender_id, reply_text)

        question.status = "answered"
        question.admin_reply = reply_text
        question.answered_at = datetime.now(timezone.utc)

        session.add(question)
        session.commit()
        session.refresh(question)
        return question


def resolve_pending_for_sender(channel: str, sender_id: str):
    """Marque toutes les questions en attente d'un client comme répondues,
    sans renvoyer de message (l'admin a déjà répondu manuellement)."""
    with Session(engine) as session:
        statement = select(UnansweredQuestion).where(
            UnansweredQuestion.channel == channel,
            UnansweredQuestion.sender_id == sender_id,
            UnansweredQuestion.status == "pending",
        )
        for question in session.exec(statement).all():
            question.status = "answered"
            question.answered_at = datetime.now(timezone.utc)
            question.admin_reply = "(répondu directement depuis Messenger)"
            session.add(question)
        session.commit()


async def reply_to_sender(channel: str, sender_id: str, reply_text: str) -> int:
    """Envoie UNE réponse au client et marque toutes ses questions en attente comme répondues."""
    with Session(engine) as session:
        statement = select(UnansweredQuestion).where(
            UnansweredQuestion.channel == channel,
            UnansweredQuestion.sender_id == sender_id,
            UnansweredQuestion.status == "pending",
        )
        questions = session.exec(statement).all()

        if not questions:
            return 0

        if channel == "messenger":
            await messenger_service.send_message(sender_id, reply_text)
        elif channel == "whatsapp":
            await whatsapp_service.send_message(sender_id, reply_text)

        now = datetime.now(timezone.utc)
        for question in questions:
            question.status = "answered"
            question.admin_reply = reply_text
            question.answered_at = now
            session.add(question)
        session.commit()

        return len(questions)


def dismiss_sender(channel: str, sender_id: str) -> int:
    """Ferme toutes les questions en attente d'un client, sans envoyer de message."""
    with Session(engine) as session:
        statement = select(UnansweredQuestion).where(
            UnansweredQuestion.channel == channel,
            UnansweredQuestion.sender_id == sender_id,
            UnansweredQuestion.status == "pending",
        )
        questions = session.exec(statement).all()

        now = datetime.now(timezone.utc)
        for question in questions:
            question.status = "dismissed"
            question.answered_at = now
            session.add(question)
        session.commit()

        return len(questions)