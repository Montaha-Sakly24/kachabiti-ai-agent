import csv

from langchain_core.documents import Document


def load_documents():
    documents = []

    with open(
        "knowledge/kachabiti-fb.csv",
        encoding="utf-8-sig",
        newline=""
    ) as file:

        reader = csv.DictReader(file)

        for row in reader:

            question = row["Facebook Question"]
            answer = row["Answer"]

            text = f"Question: {question}\nAnswer: {answer}"

            documents.append(
                Document(
                    page_content=text,
                    metadata={
                        "question": question,
                        "answer": answer,
                        "type": "faq",
                        "row": row["#"]
                    }
                )
            )

    return documents