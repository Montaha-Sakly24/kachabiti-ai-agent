from fastapi import APIRouter, HTTPException

from app.schemas.inbox import PendingQuestionResponse, ReplyRequest, SenderReplyRequest, DismissSenderRequest
from app.services.inbox_service import (
    list_pending_questions,
    reply_to_question,
    reply_to_sender,
    dismiss_sender
)

router = APIRouter(prefix="/api/inbox", tags=["Inbox"])


@router.get("/", response_model=list[PendingQuestionResponse])
async def get_pending():
    return list_pending_questions()


@router.post("/reply-sender")
async def send_reply_to_sender(payload: SenderReplyRequest):
    count = await reply_to_sender(payload.channel, payload.sender_id, payload.reply)

    if count == 0:
        raise HTTPException(status_code=404, detail="Aucune question en attente pour ce client.")

    return {"message": "Réponse envoyée.", "resolved": count}


@router.post("/{question_id}/reply")
async def send_reply(question_id: int, payload: ReplyRequest):
    result = await reply_to_question(question_id, payload.reply)

    if not result:
        raise HTTPException(status_code=404, detail="Question introuvable.")

    return {"message": "Réponse envoyée."}


@router.post("/dismiss-sender")
async def dismiss_sender_endpoint(payload: DismissSenderRequest):
    count = dismiss_sender(payload.channel, payload.sender_id)
    return {"message": "Notifications fermées.", "dismissed": count}