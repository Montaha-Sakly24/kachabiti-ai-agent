from qdrant_client.models import VectorParams, Distance

from app.services.qdrant import client
from app.services.embedding import embeddings

def create_collection():

    dimension = len(embeddings.embed_query("test"))
    collections = client.get_collections().collections
    collection_names = [c.name for c in collections]

    if "knowledge_base" in collection_names:
        print("Collection already exists.")
        return

    client.create_collection(
        collection_name="knowledge_base",
        vectors_config=VectorParams(
            size= dimension,
            distance=Distance.COSINE,
        )
    )

    print(f"Collection created successfully with dimension = {dimension}")