from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./kachabiti.db"
engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    from app.models import inbox, settings, conversation, order   # noqa: F401  (enregistre les tables)
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

