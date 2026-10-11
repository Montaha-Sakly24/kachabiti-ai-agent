from app.rag.product_loader import load_products

docs= load_products()
print(docs[0])