from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Dict, Any
import json

from ..database import get_db
from ..models.user import User
from ..models.series_test import SeriesTestAttempt
from ..models.test import TestAttempt
from ..utils.auth import get_current_user, is_admin_user

router = APIRouter(prefix="/api/stats", tags=["Statistics"])


@router.get("/overview")
async def get_stats_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get overview statistics for admin dashboard"""

    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")

    # Total series tests completed
    series_tests_count = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.is_completed == True
    ).count()

    # Total demo/old tests completed
    demo_tests_count = db.query(TestAttempt).filter(
        TestAttempt.completed.isnot(None)
    ).count()

    total_tests = series_tests_count + demo_tests_count

    # Tests by series type (only series tests)
    tests_by_type = db.query(
        SeriesTestAttempt.series_type,
        func.count(SeriesTestAttempt.id)
    ).filter(
        SeriesTestAttempt.is_completed == True
    ).group_by(SeriesTestAttempt.series_type).all()

    # Average score from series tests
    series_avg = db.query(func.avg(SeriesTestAttempt.score)).filter(
        SeriesTestAttempt.is_completed == True,
        SeriesTestAttempt.score.isnot(None)
    ).scalar() or 0

    # Average score from demo tests
    demo_avg = db.query(func.avg(TestAttempt.score)).filter(
        TestAttempt.completed.isnot(None),
        TestAttempt.score.isnot(None)
    ).scalar() or 0

    # Combined average (weighted by count)
    if series_tests_count + demo_tests_count > 0:
        avg_score = (series_avg * series_tests_count + demo_avg * demo_tests_count) / (series_tests_count + demo_tests_count)
    else:
        avg_score = 0

    # Total users who took tests
    series_users = db.query(func.count(func.distinct(SeriesTestAttempt.user_id))).filter(
        SeriesTestAttempt.is_completed == True,
        SeriesTestAttempt.user_id.isnot(None)
    ).scalar() or 0

    demo_users = db.query(func.count(func.distinct(TestAttempt.user_id))).filter(
        TestAttempt.completed.isnot(None),
        TestAttempt.user_id.isnot(None)
    ).scalar() or 0

    # Get unique users from both tables
    total_users = db.query(User).count()

    # Emails sent
    series_emails = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.email_sent == True
    ).count()

    demo_emails = db.query(TestAttempt).filter(
        TestAttempt.email_sent == True
    ).count()

    emails_sent = series_emails + demo_emails

    return {
        "total_tests": total_tests,
        "series_tests": series_tests_count,
        "demo_tests": demo_tests_count,
        "tests_by_type": {t[0]: t[1] for t in tests_by_type},
        "average_score": round(avg_score, 2),
        "total_users": total_users,
        "emails_sent": emails_sent
    }


@router.get("/score-distribution")
async def get_score_distribution(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get score distribution data for charts"""

    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")

    # Get all completed series tests with scores
    series_tests = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.is_completed == True,
        SeriesTestAttempt.score.isnot(None)
    ).order_by(SeriesTestAttempt.completed_at).all()

    # Get all completed demo tests with scores
    demo_tests = db.query(TestAttempt).filter(
        TestAttempt.completed.isnot(None),
        TestAttempt.score.isnot(None)
    ).order_by(TestAttempt.completed).all()

    # Score distribution buckets (0-100, 100-200, ..., 900-1000)
    buckets = {f"{i*100}-{(i+1)*100}": 0 for i in range(10)}

    # Timeline data
    scores_over_time = []

    # Process series tests
    for test in series_tests:
        if test.score is not None:
            bucket_index = min(int(test.score // 100), 9)
            bucket_key = f"{bucket_index*100}-{(bucket_index+1)*100}"
            buckets[bucket_key] += 1

            if test.completed_at:
                scores_over_time.append({
                    "date": test.completed_at.strftime("%Y-%m-%d"),
                    "score": round(test.score, 2),
                    "series_type": test.series_type,
                    "test_id": test.id,
                    "type": "series"
                })

    # Process demo tests
    for test in demo_tests:
        if test.score is not None:
            bucket_index = min(int(test.score // 100), 9)
            bucket_key = f"{bucket_index*100}-{(bucket_index+1)*100}"
            buckets[bucket_key] += 1

            if test.completed:
                scores_over_time.append({
                    "date": test.completed.strftime("%Y-%m-%d"),
                    "score": round(test.score, 2),
                    "series_type": "demo",
                    "test_id": test.id,
                    "type": "demo"
                })

    # Aggregate by date for timeline
    date_scores: Dict[str, List[float]] = {}
    for item in scores_over_time:
        date = item["date"]
        if date not in date_scores:
            date_scores[date] = []
        date_scores[date].append(item["score"])

    timeline = [
        {
            "date": date,
            "avgScore": round(sum(scores) / len(scores), 2),
            "count": len(scores),
            "minScore": round(min(scores), 2),
            "maxScore": round(max(scores), 2)
        }
        for date, scores in sorted(date_scores.items())
    ]

    return {
        "distribution": [
            {"range": k, "count": v} for k, v in buckets.items()
        ],
        "timeline": timeline,
        "scores": scores_over_time[-100:]  # Last 100 individual scores
    }


@router.get("/ai-model-accuracy")
async def get_ai_model_accuracy(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI model accuracy and agreement statistics"""

    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")

    # Get all completed series tests with analysis
    series_tests = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.is_completed == True,
        SeriesTestAttempt.analysis.isnot(None)
    ).all()

    # Get all completed demo tests with analysis
    demo_tests = db.query(TestAttempt).filter(
        TestAttempt.completed.isnot(None),
        TestAttempt.analysis.isnot(None)
    ).all()

    # AI models we track
    ai_models = ["gpt4o", "claude", "grok", "groq", "mistral"]

    # Track scores by model
    model_scores: Dict[str, List[float]] = {model: [] for model in ai_models}

    # Track agreement (how close models are to each other)
    score_variances = []

    def process_analysis(analysis_str):
        """Process analysis string and extract model scores"""
        try:
            if not analysis_str:
                return {}

            analysis_data = json.loads(analysis_str) if isinstance(analysis_str, str) else analysis_str

            # Handle different analysis formats
            if isinstance(analysis_data, dict):
                if "analyses" in analysis_data:
                    return analysis_data["analyses"]
                elif "gpt4o" in analysis_data or "claude" in analysis_data:
                    return analysis_data
            return {}
        except Exception as e:
            print(f"Error parsing analysis: {e}")
            return {}

    def extract_score(model_analysis):
        """Extract score from model analysis"""
        try:
            if isinstance(model_analysis, str):
                model_analysis = json.loads(model_analysis)

            if isinstance(model_analysis, dict):
                # Try different score field names
                for field in ["overall_score", "score", "total_score", "final_score"]:
                    if field in model_analysis:
                        score = model_analysis[field]
                        if isinstance(score, (int, float)):
                            return float(score)
            return None
        except:
            return None

    # Process series tests
    for test in series_tests:
        analyses = process_analysis(test.analysis)
        test_model_scores = []

        for model in ai_models:
            if model in analyses:
                score = extract_score(analyses[model])
                if score is not None:
                    model_scores[model].append(score)
                    test_model_scores.append(score)

        # Calculate variance for this test (model agreement)
        if len(test_model_scores) >= 2:
            avg = sum(test_model_scores) / len(test_model_scores)
            variance = sum((s - avg) ** 2 for s in test_model_scores) / len(test_model_scores)
            score_variances.append(variance)

    # Process demo tests
    for test in demo_tests:
        analyses = process_analysis(test.analysis)
        test_model_scores = []

        for model in ai_models:
            if model in analyses:
                score = extract_score(analyses[model])
                if score is not None:
                    model_scores[model].append(score)
                    test_model_scores.append(score)

        if len(test_model_scores) >= 2:
            avg = sum(test_model_scores) / len(test_model_scores)
            variance = sum((s - avg) ** 2 for s in test_model_scores) / len(test_model_scores)
            score_variances.append(variance)

    # Calculate statistics per model
    model_stats = []
    for model in ai_models:
        scores = model_scores[model]
        if scores:
            model_stats.append({
                "model": model,
                "displayName": get_model_display_name(model),
                "avgScore": round(sum(scores) / len(scores), 2),
                "minScore": round(min(scores), 2),
                "maxScore": round(max(scores), 2),
                "totalAnalyses": len(scores),
                "consistency": round(calculate_consistency(scores), 2)
            })
        else:
            # Include models with no data
            model_stats.append({
                "model": model,
                "displayName": get_model_display_name(model),
                "avgScore": 0,
                "minScore": 0,
                "maxScore": 0,
                "totalAnalyses": 0,
                "consistency": 0
            })

    # Overall model agreement score (lower variance = higher agreement)
    avg_variance = sum(score_variances) / len(score_variances) if score_variances else 0
    agreement_score = max(0, 100 - (avg_variance / 10))  # Convert to 0-100 scale

    return {
        "models": model_stats,
        "agreement_score": round(agreement_score, 2),
        "total_analyses": sum(len(scores) for scores in model_scores.values())
    }


@router.get("/series-breakdown")
async def get_series_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get breakdown statistics by series type"""

    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")

    series_types = ["mono", "bi", "tri", "mt", "bt", "tt"]
    series_display_names = {
        "mono": "M1 Series",
        "bi": "M2 Series",
        "tri": "M3 Series",
        "mt": "M1-T Series",
        "bt": "M2-T Series",
        "tt": "M3-T Series"
    }

    breakdown = []

    for series_type in series_types:
        tests = db.query(SeriesTestAttempt).filter(
            SeriesTestAttempt.series_type == series_type,
            SeriesTestAttempt.is_completed == True
        ).all()

        scores = [t.score for t in tests if t.score is not None]
        times = []

        for t in tests:
            total_time = 0
            if t.module_1_time_taken_seconds:
                total_time += t.module_1_time_taken_seconds
            if t.module_2_time_taken_seconds:
                total_time += t.module_2_time_taken_seconds
            if t.module_3_time_taken_seconds:
                total_time += t.module_3_time_taken_seconds
            if total_time > 0:
                times.append(total_time)

        breakdown.append({
            "type": series_type,
            "displayName": series_display_names.get(series_type, series_type),
            "totalTests": len(tests),
            "avgScore": round(sum(scores) / len(scores), 2) if scores else 0,
            "minScore": round(min(scores), 2) if scores else 0,
            "maxScore": round(max(scores), 2) if scores else 0,
            "avgTimeMinutes": round((sum(times) / len(times)) / 60, 1) if times else 0
        })

    return {"breakdown": breakdown}


def get_model_display_name(model_id: str) -> str:
    """Get display name for AI model"""
    names = {
        "gpt4o": "GPT-4o",
        "claude": "Claude",
        "grok": "Grok",
        "groq": "Gemini",
        "mistral": "Mistral"
    }
    return names.get(model_id, model_id.upper())


def calculate_consistency(scores: List[float]) -> float:
    """Calculate consistency score (inverse of coefficient of variation)"""
    if len(scores) < 2:
        return 100

    avg = sum(scores) / len(scores)
    if avg == 0:
        return 100

    variance = sum((s - avg) ** 2 for s in scores) / len(scores)
    std_dev = variance ** 0.5
    cv = (std_dev / avg) * 100

    # Convert to consistency (100 = perfectly consistent)
    return max(0, 100 - cv)
