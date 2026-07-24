from langchain_community.document_loaders import CSVLoader, TextLoader

def load_documents():
    # loader = TextLoader("knowledge/faq.txt", encoding="utf-8")
    loader = CSVLoader("knowledge/kachabiti-fb.csv", encoding="utf-8")
    
    documents = loader.load()
    return documents

