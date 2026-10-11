from app.services.qdrant import client

#client.delete_collection("knowledge_base")
client.delete_collection("products")

print("Collection supprimée.")