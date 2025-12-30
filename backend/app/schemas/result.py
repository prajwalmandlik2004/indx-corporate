from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class ResultAnalysis(BaseModel):
    overall_score: float
    detailed_analysis: str
    question_feedback: List[Dict[str, Any]]
    strengths: List[str]
    improvements: List[str]
    recommendations: List[str]

class MultiAIAnalysis(BaseModel):
    gpt4o: ResultAnalysis
    claude: ResultAnalysis
    grok: ResultAnalysis
    mistral: ResultAnalysis

class ResultResponse(BaseModel):
    test_id: int
    test_name: str
    category: str
    level: str
    score: float
    analyses: Dict[str, Any]
    completed_at: str
    answers: Optional[List[Dict[str, Any]]] = None