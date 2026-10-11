from qdrant_client.models import VectorParams, Distance

from app.services.qdrant import client
from app.services.embedding import embeddings

def create_collection(collection_name: str):

    dimension = len(embeddings.embed_query("test"))
    collections = client.get_collections().collections
    collection_names = [c.name for c in collections]

    if collection_name in collection_names:
        print(f"Collection '{collection_name}' already exists.")
        return

    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(
            size= dimension,
            distance=Distance.COSINE,
        )
    )

    print(f"Collection '{collection_name}' created successfully with dimension = {dimension}")
    

if __name__ == "__main__":
    create_collection("products")