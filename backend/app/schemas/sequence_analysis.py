from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class SequenceAnalysisCreate(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    test_id: int
    model_name: str
    sequence_number: int
    field_1: Optional[str] = None
    field_2: Optional[str] = None
    field_3: Optional[str] = None
    field_4: Optional[str] = None
    field_5: Optional[str] = None
    field_6: Optional[str] = None
    detailed_analysis: Optional[str] = None

class SequenceAnalysisResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=(), from_attributes=True)

    id: int
    test_id: int
    model_name: str
    sequence_number: int
    field_1: Optional[str]
    field_2: Optional[str]
    field_3: Optional[str]
    field_4: Optional[str]
    field_5: Optional[str]
    field_6: Optional[str]
    detailed_analysis: Optional[str]
    
    # class Config:
    #     from_attributes = True