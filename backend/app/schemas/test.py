from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from ..models.test import TestCategory, TestLevel

class QuestionSchema(BaseModel):
    question_id: int
    question_text: str

class AnswerSchema(BaseModel):
    question_id: int
    answer_text: str

class TestStartRequest(BaseModel):
    category: TestCategory
    level: TestLevel

class TestSubmitRequest(BaseModel):
    test_id: int
    answers: List[AnswerSchema]

class TestAttemptResponse(BaseModel):
    id: int
    user_id: int
    category: TestCategory
    level: TestLevel
    test_name: str
    questions: List[Dict]
    score: Optional[float] = None
    completed: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class TestDashboardItem(BaseModel):
    id: int
    test_name: str
    category: TestCategory
    level: TestLevel
    score: Optional[float]
    completed: Optional[datetime]
    created_at: datetime
    user: Optional[Dict[str, str]] = None
    
    class Config:
        from_attributes = True