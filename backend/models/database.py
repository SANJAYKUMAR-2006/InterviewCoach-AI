import os
import json
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Setup SQLite database location in the backend folder
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "interviewcoach.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    question_id = Column(Integer, nullable=False)
    question_text = Column(String, nullable=False)
    mode = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    transcript = Column(Text, nullable=False)
    duration_seconds = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    fluency_score = Column(Float, nullable=False)
    vocabulary_score = Column(Float, nullable=False)
    grammar_score = Column(Float, nullable=True) # Nullable in case LanguageTool fails
    relevance_score = Column(Float, nullable=False)
    filler_control_score = Column(Float, nullable=False)
    filler_count = Column(Integer, nullable=False)
    words_per_minute = Column(Float, nullable=False)
    
    # Store list of suggestions and formula breakdown as JSON-serialized strings
    _suggestions = Column("suggestions", Text, default="[]")
    _formula_breakdown = Column("formula_breakdown", Text, default="{}")

    @property
    def suggestions(self):
        try:
            return json.loads(self._suggestions)
        except Exception:
            return []

    @suggestions.setter
    def suggestions(self, value):
        self._suggestions = json.dumps(value)

    @property
    def formula_breakdown(self):
        try:
            return json.loads(self._formula_breakdown)
        except Exception:
            return {}

    @formula_breakdown.setter
    def formula_breakdown(self, value):
        self._formula_breakdown = json.dumps(value)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
