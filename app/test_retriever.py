from app.rag.retriever import retrieve

results = retrieve("quels sont les Horaires de travail de kachabiti?")

for point in results:
    print("----------------")
    print(point.score)
    print(point.payload["text"])