from app.services.embedding import embeddings
from app.services.qdrant import client


def retrieve(collection_name: str, query: str, limit: int = 5):

    query_vector = embeddings.embed_query(query)

    results = client.query_points(
        collection_name=collection_name,
        query=query_vector,
        limit=limit
    )

    return results.points