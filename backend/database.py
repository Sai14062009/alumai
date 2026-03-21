from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./alumai.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TicketModel(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)
    description = Column(Text)
    priority = Column(String, nullable=True)
    asset_name = Column(String, nullable=True)
    location = Column(String, nullable=True)
    reported_by = Column(String, nullable=True)
    created_at = Column(String, nullable=True)
    asset = Column(String, nullable=True)
    system = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    clean_description = Column(Text, nullable=True)
    rca_analysis = Column(JSON, nullable=True)
    is_classified = Column(Boolean, default=False)
    status = Column(String, default="Pending")
    confidence_score = Column(Float, nullable=True)
    chat_history = Column(JSON, default=list)

def init_db():
    Base.metadata.create_all(bind=engine)