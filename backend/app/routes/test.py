from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import json
from ..database import get_db
from ..models.user import User
from ..models.test import TestAttempt
from ..schemas.test import (
    TestStartRequest, TestSubmitRequest, TestAttemptResponse, TestDashboardItem
)
from ..utils.auth import get_current_user
from ..utils.ai_analyzer import generate_test_questions, analyze_test_results

router = APIRouter(prefix="/api/test", tags=["Test"])

@router.post("/start", response_model=TestAttemptResponse)
async def start_test(
    test_request: TestStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a new test and generate questions"""
    
    # Generate questions using AI
    questions = await generate_test_questions(
        category=test_request.category.value,
        level=test_request.level.value,
        num_questions=5
    )
    
    test_name = f"{test_request.category.value.title()} - {test_request.level.value.replace('_', ' ').title()}"
    
    # Create test attempt
    test_attempt = TestAttempt(
        user_id=current_user.id,
        category=test_request.category,
        level=test_request.level,
        test_name=test_name,
        questions=questions,
        answers=[]
    )
    
    db.add(test_attempt)
    db.commit()
    db.refresh(test_attempt)
    
    return test_attempt

@router.post("/submit")
async def submit_test(
    submit_request: TestSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit test answers and get analysis"""
    
    test = db.query(TestAttempt).filter(
        TestAttempt.id == submit_request.test_id,
        TestAttempt.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    if test.completed:
        raise HTTPException(status_code=400, detail="Test already completed")
    
    # Store answers
    answers = [answer.dict() for answer in submit_request.answers]
    test.answers = answers
    
    # Analyze results using AI
    analysis = await analyze_test_results(
        questions=test.questions,
        answers=answers,
        category=test.category.value,
        level=test.level.value
    )
    
    # Update test with results
    test.score = analysis["overall_score"]
    test.analysis = json.dumps(analysis)
    test.completed = datetime.utcnow()
    
    db.commit()
    db.refresh(test)
    
    return {
        "message": "Test submitted successfully",
        "test_id": test.id,
        "score": test.score
    }

@router.get("/dashboard", response_model=List[TestDashboardItem])
async def get_test_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all tests taken by the user"""
    
    tests = db.query(TestAttempt).filter(
        TestAttempt.user_id == current_user.id
    ).order_by(TestAttempt.created_at.desc()).all()
    
    return tests

@router.get("/categories")
async def get_categories():
    """Get available test categories"""
    return {
        "categories": [
            {"value": "school", "label": "School", "description": "Academic assessments for students"},
            {"value": "professional", "label": "Professional", "description": "Career development tests"},
            {"value": "technical", "label": "Technical", "description": "Technical skill assessments"},
            {"value": "company", "label": "Company", "description": "Corporate assessments"},
            {"value": "general", "label": "General Knowledge", "description": "General knowledge tests"}
        ]
    }