from app.rag.retriever import retrieve


faq_questions = [
    "Win l'emplacement mta3 kachabiti?",
    "B9adech le prix de livraison?",
    "Est-ce que vous livrez en Algérie?",
    "Kifech n3adi une commande?",
]

product_questions = [
    "B9adech l'kachabiya zmeniya?",
    "3andkom kachabiya l'enfants?",
    "B9adech l'kachabiya marocaine?",
]


print("\n" + "#" * 80)
print("TEST FAQ - knowledge_base")
print("#" * 80)

for question in faq_questions:

    print("\n" + "=" * 80)
    print(f"QUESTION : {question}")
    print("=" * 80)

    results = retrieve(
        collection_name="knowledge_base",
        query=question,
        limit=5
    )

    for i, point in enumerate(results, start=1):
        print(f"\n--- RESULTAT {i} ---")
        print(f"Score    : {point.score}")
        print(f"Question : {point.payload.get('question')}")
        print(f"Answer   : {point.payload.get('answer')}")


print("\n" + "#" * 80)
print("TEST PRODUITS - products")
print("#" * 80)

for question in product_questions:

    print("\n" + "=" * 80)
    print(f"QUESTION : {question}")
    print("=" * 80)

    results = retrieve(
        collection_name="products",
        query=question,
        limit=5
    )

    for i, point in enumerate(results, start=1):
        print(f"\n--- RESULTAT {i} ---")
        print(f"Score : {point.score}")
        print(f"Nom   : {point.payload.get('name')}")
        print(f"Catégorie : {point.payload.get('category')}")
        print(f"Stock : {point.payload.get('stock')}")
        print(f"Statut : {point.payload.get('status')}")
        print(f"Lien : {point.payload.get('link')}")