from app.rag.loader import load_documents
from app.rag.splitter import split_documents

docs = load_documents()
chunks = split_documents(docs)
print(len(chunks))

for chunk in chunks :
    print("--------------------")
    print(chunk.page_content)