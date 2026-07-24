from app.services.embedding import embeddings
from app.services.qdrant import client

def retrieve(query: str, limit: int = 3):

    query_vector = embeddings.embed_query(query)
    results = client.query_points(
        collection_name="knowledge_base",
        query=query_vector,
        limit=limit
    )
    return results.points