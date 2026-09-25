from app.rag.product_loader import load_products
from app.rag.ingest import ingest
from app.rag.loader import load_documents

# ingestion des FAQ
documents = load_documents()

ingest("knowledge_base", documents)

# ingestion des produits
# documents = load_products()
# ingest("products", documents)



    