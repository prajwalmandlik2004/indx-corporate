from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.user import User
from ..models.sequence_analysis import SequenceAnalysis
from ..schemas.sequence_analysis import SequenceAnalysisCreate, SequenceAnalysisResponse
from ..utils.auth import get_current_user, is_admin_user

router = APIRouter(prefix="/api/sequence-analysis", tags=["Sequence Analysis"])

@router.get("/{test_id}/{model_name}")
async def get_sequence_analyses(
    test_id: int,
    model_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[SequenceAnalysisResponse]:
    """Get all sequence analyses for a test and model"""
    
    analyses = db.query(SequenceAnalysis).filter(
        SequenceAnalysis.test_id == test_id,
        SequenceAnalysis.model_name == model_name
    ).order_by(SequenceAnalysis.sequence_number).all()
    
    return analyses

@router.post("/save")
async def save_sequence_analysis(
    data: SequenceAnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save or update sequence analysis (admin only)"""
    
    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check if exists
    existing = db.query(SequenceAnalysis).filter(
        SequenceAnalysis.test_id == data.test_id,
        SequenceAnalysis.model_name == data.model_name,
        SequenceAnalysis.sequence_number == data.sequence_number
    ).first()
    
    if existing:
        # Update
        existing.field_1 = data.field_1
        existing.field_2 = data.field_2
        existing.field_3 = data.field_3
        existing.field_4 = data.field_4
        existing.field_5 = data.field_5
        existing.field_6 = data.field_6
        existing.detailed_analysis = data.detailed_analysis
    else:
        # Create new
        new_analysis = SequenceAnalysis(**data.dict())
        db.add(new_analysis)
    
    db.commit()
    
    return {"message": "Sequence analysis saved successfully"}