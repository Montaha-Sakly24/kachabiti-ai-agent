from app.services.qdrant import client

collections = client.get_collections()
print(collections)