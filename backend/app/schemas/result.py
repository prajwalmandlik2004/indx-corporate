from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class ResultAnalysis(BaseModel):
    overall_score: float
    detailed_analysis: str
    question_feedback: List[Dict[str, Any]]
    strengths: List[str]
    improvements: List[str]
    recommendations: List[str]

class ResultResponse(BaseModel):
    test_id: int
    test_name: str
    category: str
    level: str
    score: float
    analysis: ResultAnalysis
    completed_at: str