from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base

class TestCategory(str, enum.Enum):
    SCHOOL = "school"
    PROFESSIONAL = "professional"
    TECHNICAL = "technical"
    COMPANY = "company"
    GENERAL = "general"

class TestLevel(str, enum.Enum):
    LEVEL_1 = "level_1"
    LEVEL_2 = "level_2"
    LEVEL_3 = "level_3"
    LEVEL_4 = "level_4"
    LEVEL_5 = "level_5"

class TestAttempt(Base):
    __tablename__ = "test_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(Enum(TestCategory), nullable=False)
    level = Column(Enum(TestLevel), nullable=False)
    test_name = Column(String, nullable=False)
    questions = Column(JSON, nullable=False)  # Store questions as JSON
    answers = Column(JSON, nullable=False)    # Store user answers as JSON
    score = Column(Float)
    analysis = Column(Text)
    completed = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="test_attempts")