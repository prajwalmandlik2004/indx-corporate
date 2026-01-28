from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from ..database import get_db
from ..models.user import User
from ..models.test import TestAttempt
from ..schemas.result import ResultResponse, ResultAnalysis
from ..utils.auth import get_current_user
from fastapi.responses import StreamingResponse
from ..utils.certificate_generator import generate_certificate

router = APIRouter(prefix="/api/result", tags=["Result"])

# @router.get("/{test_id}", response_model=ResultResponse)
# async def get_test_result(
#     test_id: int,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Get detailed results for a specific test"""
    
#     test = db.query(TestAttempt).filter(
#         TestAttempt.id == test_id,
#         TestAttempt.user_id == current_user.id
#     ).first()
    
#     if not test:
#         raise HTTPException(status_code=404, detail="Test not found")
    
#     if not test.completed:
#         raise HTTPException(status_code=400, detail="Test not completed yet")
    
#     analysis_data = json.loads(test.analysis)
    
#     return {
#         "test_id": test.id,
#         "test_name": test.test_name,
#         "category": test.category.value,
#         "level": test.level.value,
#         "score": test.score,
#         "analysis": analysis_data,
#         "completed_at": test.completed.isoformat()
#     }

@router.get("/{test_id}")
async def get_test_result(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed results for a specific test with all AI analyses"""
    
    # test = db.query(TestAttempt).filter(
    #     TestAttempt.id == test_id,
    #     TestAttempt.user_id == current_user.id
    # ).first()

    test = db.query(TestAttempt).filter(
        TestAttempt.id == test_id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # if not test.completed:
    #     raise HTTPException(status_code=400, detail="Test not completed yet")

    if not test.completed:
        if test.answers:  # Answers saved but analysis pending
            return {
                "test_id": test.id,
                "test_name": test.test_name,
                "score": 0,
                "analyses": {
                    "gpt4o": {"error": "Analysis in progress, please refresh"}
                },
                "completed_at": test.created_at.isoformat(),
                "answers": test.answers
            }
        raise HTTPException(status_code=400, detail="No answers submitted")

    # Normal completed flow continues here
    analysis_data = json.loads(test.analysis)
    
    # Handle backward compatibility - old tests don't have "analyses" key
    if "analyses" in analysis_data:
        # New multi-AI format
        parsed_analyses = {}
        for engine, analysis_str in analysis_data["analyses"].items():
            try:
                parsed_analyses[engine] = json.loads(analysis_str) if isinstance(analysis_str, str) else analysis_str
            except:
                parsed_analyses[engine] = {"error": "Failed to parse analysis"}
    else:
        # Old single-AI format - treat as GPT-4o only
        parsed_analyses = {
            "gpt4o": analysis_data,
            "claude": {"error": "Not available for this test"},
            # "grok": {"error": "Not available for this test"},
            "mistral": {"error": "Not available for this test"}
        }
    
    return {
        "test_id": test.id,
        "test_name": test.test_name,
        "category": test.category.value,
        "level": test.level.value,
        "score": test.score,
        "analyses": parsed_analyses,
        "completed_at": test.completed.isoformat(),
        "answers": test.answers  
    }

@router.patch("/feedback/{test_id}")
async def submit_feedback(
    test_id: int,
    feedback: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit user feedback for a test"""
    
    test = db.query(TestAttempt).filter(
        TestAttempt.id == test_id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    test.feedback = feedback
    db.commit()
    
    return {"message": "Feedback submitted successfully"}


@router.get("/{test_id}/certificate")
async def download_certificate(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate and download certificate for a test"""
    
    test = db.query(TestAttempt).filter(
        TestAttempt.id == test_id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    if not test.completed or not test.score:
        raise HTTPException(status_code=400, detail="Test not completed or score unavailable")
    
    # Get user info
    user_name = test.user.full_name if test.user else "Guest User"
    user_email = test.user.email if test.user else "N/A"
    
    # Generate certificate
    pdf_buffer = generate_certificate(
        user_name=user_name,
        email=user_email,
        test_name=test.test_name,
        score=test.score,
        completed_at=test.completed.isoformat()
    )
    
    # Return PDF as download
    filename = f"INDX1000_Certificate_{user_name.replace(' ', '_')}_{test_id}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

@router.get("/{test_id}/qa-pdf")
async def download_qa_pdf(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate and download Q&A PDF"""
    
    test = db.query(TestAttempt).filter(
        TestAttempt.id == test_id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    if not test.completed or not test.answers:
        raise HTTPException(status_code=400, detail="Test not completed")
    
    # Import the generator
    from ..utils.qa_pdf_generator import generate_qa_pdf
    
    # Get user info
    user_name = test.user.full_name if test.user else "Guest User"
    
    # Generate PDF
    pdf_buffer = generate_qa_pdf(
        test_name=test.test_name,
        user_name=user_name,
        completed_at=test.completed.isoformat(),
        questions=test.questions,
        answers=test.answers
    )
    
    # Return PDF as download
    filename = f"INDX1000_QA_{user_name.replace(' ', '_')}_{test_id}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


@router.get("/{test_id}/qaa-pdf/{model_name}")
async def download_qaa_pdf(
    test_id: int,
    model_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate and download Q&A with Analysis PDF for specific AI model"""
    
    test = db.query(TestAttempt).filter(
        TestAttempt.id == test_id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    if not test.completed or not test.answers:
        raise HTTPException(status_code=400, detail="Test not completed")
    
    # Parse analysis
    analysis_data = json.loads(test.analysis)
    
    if "analyses" not in analysis_data:
        raise HTTPException(status_code=400, detail="Analysis not available")
    
    model_analysis_str = analysis_data["analyses"].get(model_name)
    if not model_analysis_str:
        raise HTTPException(status_code=404, detail=f"Analysis for {model_name} not found")
    
    model_analysis = json.loads(model_analysis_str) if isinstance(model_analysis_str, str) else model_analysis_str
    
    # Import the generator
    from ..utils.qaa_pdf_generator import generate_qaa_pdf
    
    # Get user info
    user_name = test.user.full_name if test.user else "Guest User"
    
    # Generate PDF
    pdf_buffer = generate_qaa_pdf(
        test_name=test.test_name,
        user_name=user_name,
        completed_at=test.completed.isoformat(),
        questions=test.questions,
        answers=test.answers,
        analysis=model_analysis,
        model_name=model_name.upper(),
        # score=test.score
        score=model_analysis.get("overall_score", test.score)
    )
    
    # Return PDF as download
    filename = f"INDX1000_QAA_{model_name.upper()}_{user_name.replace(' ', '_')}_{test_id}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )