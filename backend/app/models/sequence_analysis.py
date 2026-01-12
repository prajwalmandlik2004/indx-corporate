from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from datetime import datetime
from ..database import Base

class SequenceAnalysis(Base):
    __tablename__ = "sequence_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("test_attempts.id", ondelete="CASCADE"), nullable=False)
    model_name = Column(String(50), nullable=False)
    sequence_number = Column(Integer, nullable=False)
    
    # 6 small fields
    field_1 = Column(String(200))
    field_2 = Column(String(200))
    field_3 = Column(String(200))
    field_4 = Column(String(200))
    field_5 = Column(String(200))
    field_6 = Column(String(200))
    
    # 1 large field
    detailed_analysis = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        UniqueConstraint('test_id', 'model_name', 'sequence_number', name='uix_test_model_seq'),
    )