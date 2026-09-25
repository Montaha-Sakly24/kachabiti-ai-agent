from uuid import uuid4

from qdrant_client.models import PointStruct

from app.services.embedding import embeddings
from app.services.qdrant import client
# from app.rag.loader import load_documents
# from app.rag.splitter import split_documents

def ingest(collection_name: str, documents):

    points = []
    for doc in documents :
        vector = embeddings.embed_query(doc.page_content)

        point = PointStruct(
            id=str(uuid4()),
            vector=vector,
            payload={
                "text": doc.page_content,
                **doc.metadata
            }
        )
        points.append(point)

    client.upsert(
        collection_name=collection_name,
        points=points,
    )

    print(f"{len(points)} documents inserted successfully")