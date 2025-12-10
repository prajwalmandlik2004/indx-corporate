from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from ..database import get_db
from ..models.user import User
from ..models.test import TestAttempt
from ..schemas.result import ResultResponse, ResultAnalysis
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/result", tags=["Result"])

@router.get("/{test_id}", response_model=ResultResponse)
async def get_test_result(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed results for a specific test"""
    
    test = db.query(TestAttempt).filter(
        TestAttempt.id == test_id,
        TestAttempt.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    if not test.completed:
        raise HTTPException(status_code=400, detail="Test not completed yet")
    
    analysis_data = json.loads(test.analysis)
    
    return {
        "test_id": test.id,
        "test_name": test.test_name,
        "category": test.category.value,
        "level": test.level.value,
        "score": test.score,
        "analysis": analysis_data,
        "completed_at": test.completed.isoformat()
    }