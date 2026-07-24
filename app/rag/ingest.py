from uuid import uuid4

from qdrant_client.models import PointStruct

from app.services.embedding import embeddings
from app.services.qdrant import client
from app.rag.loader import load_documents
# from app.rag.splitter import split_documents

def ingest():

    documents = load_documents()

    # chunks = split_documents(documents)

    points = []
    # for chunk in chunks :
    for doc in documents :
        vector = embeddings.embed_query(doc.page_content)

        point = PointStruct(
            id=str(uuid4()),
            vector=vector,
            payload={
                "text": doc.page_content,
                "source": doc.metadata.get("source"), 
            }
        )
        points.append(point)

    client.upsert(
        collection_name="knowledge_base",
        points=points,
    )

    print(f"{len(points)} chunks inserted successfully")