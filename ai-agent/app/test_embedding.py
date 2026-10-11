from app.services.embedding import embeddings

vector = embeddings.embed_query("quels sont vos horaires?")

print(type(vector))
print(len(vector))
print(vector[:10])