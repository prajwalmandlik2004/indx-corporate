from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base


class SeriesType(str, enum.Enum):
    MONO = "mono"     
    BI = "bi"          
    TRI = "tri"        
    MT = "mt"
    BT = "bt"
    TT = "tt"      


class ModuleStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class SeriesTestAttempt(Base):
    __tablename__ = "series_test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    series_type = Column(String(20), nullable=False)
    test_name = Column(String, nullable=False)

    module_1_questions = Column(JSON, nullable=False)
    module_1_answers = Column(JSON, default=[])
    module_1_status = Column(String(20), default="not_started")
    module_1_started_at = Column(DateTime, nullable=True)
    module_1_completed_at = Column(DateTime, nullable=True)
    module_1_time_taken_seconds = Column(Integer, nullable=True)  

    module_2_questions = Column(JSON, nullable=True)
    module_2_answers = Column(JSON, default=[])
    module_2_status = Column(String(20), default="not_started")
    module_2_started_at = Column(DateTime, nullable=True)
    module_2_completed_at = Column(DateTime, nullable=True)
    module_2_time_taken_seconds = Column(Integer, nullable=True)

    module_3_questions = Column(JSON, nullable=True)
    module_3_answers = Column(JSON, default=[])
    module_3_status = Column(String(20), default="not_started")
    module_3_started_at = Column(DateTime, nullable=True)
    module_3_completed_at = Column(DateTime, nullable=True)
    module_3_time_taken_seconds = Column(Integer, nullable=True)

    total_questions = Column(Integer, nullable=False)
    total_modules = Column(Integer, nullable=False)
    current_module = Column(Integer, default=1)

    timer_per_module = Column(Integer, nullable=False)  
    break_duration = Column(Integer, default=15) 

    score = Column(Float, nullable=True)
    analysis = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)
    feedback = Column(Text, nullable=True)

    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    email_sent = Column(Boolean, default=False)
    email_sent_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="series_test_attempts")
