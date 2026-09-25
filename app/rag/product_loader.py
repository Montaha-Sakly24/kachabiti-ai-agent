import csv

from langchain_core.documents import Document

def load_products():
    docs = []
    with open("knowledge/produits_kachabiti.csv", encoding="utf-8-sig") as file : 
        reader = csv.DictReader(file)
        for row in reader:
            text = f"""
Nom du produit : {row['Nom du produit']}
Catégorie : {row['Categorie']}
Prix : {row['Prix (TND)']}
Disponibilité : {row['Statut']}
Quantité en stock : {row['Quantite en stock']}
Lien : {row['Lien produit']}
"""
            docs.append(
                Document(
                    page_content=text,
                    metadata={
                        "name": row['Nom du produit'],
                        "category": row['Categorie'],
                        "status": row["Statut"],
                        "stock": row["Quantite en stock"],
                        "link": row["Lien produit"],
                    },
                )
            )

    return docs