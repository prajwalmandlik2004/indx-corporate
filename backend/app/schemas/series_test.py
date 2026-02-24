from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from ..models.series_test import SeriesType, ModuleStatus


class SeriesStartRequest(BaseModel):
    series_type: SeriesType


class SeriesModuleSubmitRequest(BaseModel):
    test_id: int
    module_number: int
    answers: List[Dict]  # [{"question_id": 1, "answer_text": "..."}]
    time_taken_seconds: int  # How long user took to submit


class SeriesTestResponse(BaseModel):
    id: int
    user_id: Optional[int]
    series_type: SeriesType
    test_name: str
    total_questions: int
    total_modules: int
    current_module: int
    timer_per_module: int
    break_duration: int

    # Module 1
    module_1_questions: List[Dict]
    module_1_status: ModuleStatus

    # Module 2 (if applicable)
    module_2_questions: Optional[List[Dict]] = None
    module_2_status: Optional[ModuleStatus] = None

    # Module 3 (if applicable)
    module_3_questions: Optional[List[Dict]] = None
    module_3_status: Optional[ModuleStatus] = None

    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SeriesModuleResponse(BaseModel):
    test_id: int
    module_number: int
    questions: List[Dict]
    timer_minutes: int
    status: ModuleStatus
    started_at: Optional[datetime] = None


class SeriesBreakResponse(BaseModel):
    test_id: int
    current_module_completed: int
    next_module: int
    break_duration_minutes: int
    break_started_at: datetime


class SeriesResultResponse(BaseModel):
    test_id: int
    test_name: str
    series_type: str
    total_questions: int
    total_modules: int
    score: Optional[float]
    analyses: Dict
    completed_at: Optional[datetime]

    # Time tracking
    module_1_time_taken: Optional[int] = None
    module_2_time_taken: Optional[int] = None
    module_3_time_taken: Optional[int] = None
    total_time_taken: Optional[int] = None

    # All answers for reference
    all_answers: Optional[List[Dict]] = None


class SeriesDashboardItem(BaseModel):
    id: int
    test_name: str
    series_type: SeriesType
    total_questions: int
    total_modules: int
    current_module: int
    score: Optional[float]
    is_completed: bool
    completed_at: Optional[datetime]
    created_at: datetime

    # Time tracking
    module_1_time_taken: Optional[int] = None
    module_2_time_taken: Optional[int] = None
    module_3_time_taken: Optional[int] = None

    user: Optional[Dict[str, str]] = None

    class Config:
        from_attributes = True
