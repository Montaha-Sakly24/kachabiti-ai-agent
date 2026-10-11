from uuid import uuid4

from qdrant_client.models import PointStruct

from app.services.embedding import embeddings
from app.services.qdrant import client


COLLECTION_NAME = "knowledge_base"

def create_faq(question: str, answer: str):

    text = f"Question: {question}\nAnswer: {answer}"

    vector = embeddings.embed_query(text)

    faq_id = str(uuid4())

    point = PointStruct(
        id=faq_id,
        vector=vector,
        payload={
            "text": text,
            "question": question,
            "answer": answer,
            "type": "faq"
        }
    )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[point]
    )

    return {
        "id": faq_id,
        "question": question,
        "answer": answer
    }


def get_all_faqs():
    results = client.scroll(
        collection_name=COLLECTION_NAME,
        limit=100,
        with_payload=True,
        with_vectors=False,
    )

    points = results[0]

    faqs = []

    for point in points:
        payload = point.payload

        faqs.append({
            "id": str(point.id),
            "question": payload.get("question", ""),
            "answer": payload.get("answer", "")
        })

    return faqs


def get_faq_by_id(faq_id: str):
    points = client.retrieve(
        collection_name=COLLECTION_NAME,
        ids=[faq_id],
        with_payload=True,
        with_vectors=False,
    )

    if not points:
        return None

    point = points[0]
    payload = point.payload

    return {
        "id": str(point.id),
        "question": payload.get("question", ""),
        "answer": payload.get("answer", "")
    }


def update_faq(faq_id: str, question: str, answer: str):
    existing = get_faq_by_id(faq_id)

    if not existing:
        return None

    text = f"Question: {question}\nAnswer: {answer}"
    vector = embeddings.embed_query(text)

    point = PointStruct(
        id=faq_id,
        vector=vector,
        payload={
            "text": text,
            "question": question,
            "answer": answer,
            "type": "faq"
        }
    )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[point]
    )

    return {
        "id": faq_id,
        "question": question,
        "answer": answer
    }


def delete_faq(faq_id: str):
    existing = get_faq_by_id(faq_id)

    if not existing:
        return False

    client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=[faq_id]
    )

    return True