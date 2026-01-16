from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import json
from ..database import get_db
from ..models.user import User
from ..models.test import TestAttempt
from ..utils.auth import get_current_user, is_admin_user
from ..utils.email_service import send_result_email

router = APIRouter(prefix="/api/email", tags=["Email"])

@router.post("/send-result/{test_id}")
async def send_test_result_email(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send test result email (accessible by test owner or admin)"""
    
    # Get test
    test = db.query(TestAttempt).filter(TestAttempt.id == test_id).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # Check permissions (owner or admin)
    if test.user_id != current_user.id and not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if not test.completed or test.score is None:
        raise HTTPException(status_code=400, detail="Test not completed or no score available")
    
    if test.email_sent:
        raise HTTPException(status_code=400, detail="Email already sent")
    
    # Get user info
    user_name = test.user.full_name if test.user else "Guest User"
    user_email = test.user.email if test.user else None
    
    if not user_email:
        raise HTTPException(status_code=400, detail="No email address available")
    
    # Parse analysis (use GPT-4o as primary)
    analysis_data = json.loads(test.analysis)
    if "analyses" in analysis_data:
        gpt4o_analysis = json.loads(analysis_data["analyses"]["gpt4o"])
    else:
        gpt4o_analysis = analysis_data
    
    # Send email
    result = await send_result_email(
        user_email=user_email,
        user_name=user_name,
        test_name=test.test_name,
        test_id=test.id,
        score=test.score,
        analysis=gpt4o_analysis,
        completed_at=test.completed.isoformat()
    )
    
    if result["success"]:
        # Mark email as sent
        test.email_sent = True
        test.email_sent_at = datetime.utcnow()
        db.commit()
        
        return {
            "message": "Email sent successfully",
            "email_id": result.get("email_id")
        }
    else:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {result.get('error')}"
        )

@router.post("/resend-result/{test_id}")
async def resend_test_result_email(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Resend test result email (admin only)"""
    
    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    test = db.query(TestAttempt).filter(TestAttempt.id == test_id).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    if not test.completed or test.score is None:
        raise HTTPException(status_code=400, detail="Test not completed")
    
    user_name = test.user.full_name if test.user else "Guest User"
    user_email = test.user.email if test.user else None
    
    if not user_email:
        raise HTTPException(status_code=400, detail="No email address available")
    
    analysis_data = json.loads(test.analysis)
    if "analyses" in analysis_data:
        gpt4o_analysis = json.loads(analysis_data["analyses"]["gpt4o"])
    else:
        gpt4o_analysis = analysis_data
    
    result = await send_result_email(
        user_email=user_email,
        user_name=user_name,
        test_name=test.test_name,
        test_id=test.id,
        score=test.score,
        analysis=gpt4o_analysis,
        completed_at=test.completed.isoformat()
    )
    
    if result["success"]:
        test.email_sent = True
        test.email_sent_at = datetime.utcnow()
        db.commit()
        
        return {
            "message": "Email resent successfully",
            "email_id": result.get("email_id")
        }
    else:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to resend email: {result.get('error')}"
        )