import os
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use PostgreSQL on Render, SQLite locally
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./alumai.db")

# Fix for Render PostgreSQL URL format
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

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

class AssetKPIModel(Base):
    __tablename__ = "asset_kpis"
    id = Column(Integer, primary_key=True, index=True)
    asset_name = Column(String, index=True)
    asset_type = Column(String, nullable=True)
    complex = Column(String, nullable=True)
    code = Column(String, nullable=True)
    status = Column(String, nullable=True)
    bath_temp = Column(Float, nullable=True)
    flue_temp = Column(Float, nullable=True)
    charge_weight = Column(Float, nullable=True)
    charge_no = Column(Integer, nullable=True)
    sample_grade = Column(String, nullable=True)
    cycle_time = Column(Float, nullable=True)
    std_cycle_time = Column(Float, nullable=True)
    cycle_step = Column(Integer, nullable=True)
    taps_taken = Column(Integer, nullable=True)
    last_tap = Column(String, nullable=True)
    cast_no = Column(String, nullable=True)
    cast_alloy = Column(String, nullable=True)
    cast_speed = Column(Float, nullable=True)
    cast_length = Column(Float, nullable=True)
    time_remaining = Column(Float, nullable=True)
    bct = Column(Float, nullable=True)

def init_db():
    Base.metadata.create_all(bind=engine)