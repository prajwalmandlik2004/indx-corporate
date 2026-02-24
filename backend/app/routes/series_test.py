from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import json

from ..database import get_db, SessionLocal
from ..models.user import User
from ..models.series_test import SeriesTestAttempt, SeriesType, ModuleStatus
from ..schemas.series_test import (
    SeriesStartRequest,
    SeriesModuleSubmitRequest,
    SeriesTestResponse,
    SeriesModuleResponse,
    SeriesDashboardItem,
)
from ..utils.auth import get_current_user
from ..utils.ai_orchestrator import orchestrate_analysis
from ..utils.series_questions import get_questions_for_series
from ..utils.email_service import send_result_email

router = APIRouter(prefix="/api/series-test", tags=["Series Test"])


async def run_analysis_and_send_email(test_id: int):
    """Background task to run analysis and auto-send email after completion"""
    db = SessionLocal()
    try:
        test = db.query(SeriesTestAttempt).filter(SeriesTestAttempt.id == test_id).first()
        if not test:
            print(f"Background analysis: Test {test_id} not found")
            return

        # Combine all questions and answers for analysis
        all_questions = []
        all_answers = []

        # Module 1
        for q in test.module_1_questions:
            all_questions.append(q)
        all_answers.extend(test.module_1_answers or [])

        # Module 2
        if test.module_2_questions:
            offset = len(test.module_1_questions)
            for q in test.module_2_questions:
                q_copy = q.copy()
                q_copy["question_id"] = q["question_id"] + offset
                all_questions.append(q_copy)
            for a in (test.module_2_answers or []):
                a_copy = a.copy()
                a_copy["question_id"] = a["question_id"] + offset
                all_answers.append(a_copy)

        # Module 3
        if test.module_3_questions:
            offset = len(test.module_1_questions) + len(test.module_2_questions or [])
            for q in test.module_3_questions:
                q_copy = q.copy()
                q_copy["question_id"] = q["question_id"] + offset
                all_questions.append(q_copy)
            for a in (test.module_3_answers or []):
                a_copy = a.copy()
                a_copy["question_id"] = a["question_id"] + offset
                all_answers.append(a_copy)

        # Run analysis
        now = datetime.utcnow()
        try:
            analysis_result = await orchestrate_analysis(
                questions=all_questions,
                answers=all_answers,
                category="series",
                level=test.series_type
            )

            # Calculate overall score from analyses
            scores = []
            for engine, analysis_str in analysis_result.get("analyses", {}).items():
                try:
                    analysis = json.loads(analysis_str) if isinstance(analysis_str, str) else analysis_str
                    if "overall_score" in analysis:
                        scores.append(analysis["overall_score"])
                except:
                    pass

            overall_score = sum(scores) / len(scores) if scores else 0

            test.score = overall_score
            test.analysis = json.dumps(analysis_result)
            test.is_completed = True
            test.completed_at = now

        except Exception as e:
            print(f"Background analysis failed for test {test_id}: {e}")
            test.score = 0
            test.analysis = json.dumps({"error": "Analysis failed", "message": str(e)})
            test.is_completed = True
            test.completed_at = now

        db.commit()
        db.refresh(test)

        # Auto-send email after analysis completion
        if test.is_completed and test.score is not None and not test.email_sent:
            user_name = test.user.full_name if test.user else "Guest User"
            user_email = test.user.email if test.user else None

            if user_email:
                # Parse analysis (use GPT-4o as primary)
                analysis_data = json.loads(test.analysis) if test.analysis else {}
                gpt4o_analysis = {}

                if "analyses" in analysis_data:
                    gpt4o_str = analysis_data["analyses"].get("gpt4o", "{}")
                    gpt4o_analysis = json.loads(gpt4o_str) if isinstance(gpt4o_str, str) else gpt4o_str

                try:
                    result = await send_result_email(
                        user_email=user_email,
                        user_name=user_name,
                        test_name=test.test_name,
                        test_id=test.id,
                        score=test.score,
                        analysis=gpt4o_analysis,
                        completed_at=test.completed_at.isoformat() if test.completed_at else ""
                    )

                    if result["success"]:
                        test.email_sent = True
                        test.email_sent_at = datetime.utcnow()
                        db.commit()
                        print(f"Background email sent successfully for test {test_id}")
                    else:
                        print(f"Background email failed for test {test_id}: {result.get('error')}")
                except Exception as email_error:
                    print(f"Background email exception for test {test_id}: {email_error}")

    except Exception as e:
        print(f"Background task error for test {test_id}: {e}")
    finally:
        db.close()


# Old random questions bank removed - now using fixed questions from series_questions.py
_DEPRECATED_QUESTIONS_BANK = [
    {"question_id": 1, "question_text": "Dans une situation où l'IA propose une solution qui semble correcte mais que vous ne comprenez pas entièrement, comment gérez-vous cette incertitude ?", "expected_criteria": "Capacité à maintenir un contrôle cognitif face à l'opacité"},
    {"question_id": 2, "question_text": "Décrivez une situation où vous avez dû reformuler plusieurs fois une demande à un système d'IA. Qu'avez-vous appris de ce processus ?", "expected_criteria": "Adaptabilité dans la formulation des intentions"},
    {"question_id": 3, "question_text": "Comment distinguez-vous une réponse d'IA qui répond véritablement à votre besoin d'une réponse qui semble correcte superficiellement ?", "expected_criteria": "Capacité d'évaluation critique"},
    {"question_id": 4, "question_text": "Quand vous travaillez sur un projet long avec l'IA, comment maintenez-vous la cohérence de votre vision initiale ?", "expected_criteria": "Gestion de la continuité cognitive"},
    {"question_id": 5, "question_text": "Décrivez votre processus de vérification des informations fournies par une IA.", "expected_criteria": "Rigueur méthodologique"},
    {"question_id": 6, "question_text": "Comment gérez-vous le cas où l'IA vous propose une approche différente de celle que vous aviez envisagée ?", "expected_criteria": "Flexibilité cognitive et maintien du contrôle"},
    {"question_id": 7, "question_text": "Quelle est votre stratégie pour éviter de devenir dépendant des suggestions de l'IA dans votre processus de réflexion ?", "expected_criteria": "Autonomie intellectuelle"},
    {"question_id": 8, "question_text": "Comment identifiez-vous les limites de ce qu'une IA peut accomplir dans un contexte donné ?", "expected_criteria": "Compréhension des capacités et limites"},
    {"question_id": 9, "question_text": "Décrivez comment vous intégrez les retours d'une IA dans votre processus décisionnel.", "expected_criteria": "Intégration cognitive"},
    {"question_id": 10, "question_text": "Comment ajustez-vous votre communication avec l'IA lorsque les résultats ne correspondent pas à vos attentes ?", "expected_criteria": "Capacité d'ajustement"},
    {"question_id": 11, "question_text": "Quelle importance accordez-vous à la compréhension du fonctionnement de l'IA que vous utilisez ?", "expected_criteria": "Conscience technique"},
    {"question_id": 12, "question_text": "Comment gérez-vous les contradictions entre différentes réponses d'IA sur un même sujet ?", "expected_criteria": "Gestion de l'ambiguïté"},
    {"question_id": 13, "question_text": "Décrivez une situation où vous avez choisi de ne pas suivre la recommandation d'une IA. Pourquoi ?", "expected_criteria": "Jugement autonome"},
    {"question_id": 14, "question_text": "Comment structurez-vous une tâche complexe avant de la soumettre à une IA ?", "expected_criteria": "Planification cognitive"},
    {"question_id": 15, "question_text": "Quelle est votre approche pour maintenir votre créativité tout en utilisant l'IA comme outil ?", "expected_criteria": "Préservation de l'originalité"},
    {"question_id": 16, "question_text": "Comment évaluez-vous la qualité d'une collaboration avec une IA sur un projet ?", "expected_criteria": "Capacité d'évaluation réflexive"},
    {"question_id": 17, "question_text": "Décrivez comment vous gérez la transition entre travail autonome et assistance par IA.", "expected_criteria": "Gestion des modes de travail"},
    {"question_id": 18, "question_text": "Comment assurez-vous que votre utilisation de l'IA reste alignée avec vos objectifs initiaux ?", "expected_criteria": "Alignement intentionnel"},
    {"question_id": 19, "question_text": "Quelle est votre stratégie pour améliorer progressivement vos interactions avec les systèmes d'IA ?", "expected_criteria": "Apprentissage continu"},
    {"question_id": 20, "question_text": "Comment gérez-vous le temps dans vos interactions avec l'IA pour rester efficace ?", "expected_criteria": "Gestion temporelle"},
    {"question_id": 21, "question_text": "Décrivez comment vous documentez ou retenez les apprentissages de vos interactions avec l'IA.", "expected_criteria": "Capitalisation des connaissances"},
    {"question_id": 22, "question_text": "Comment abordez-vous une tâche entièrement nouvelle avec l'aide de l'IA ?", "expected_criteria": "Approche exploratoire"},
    {"question_id": 23, "question_text": "Quelle est votre méthode pour valider que vous avez correctement compris une réponse complexe de l'IA ?", "expected_criteria": "Validation de la compréhension"},
    {"question_id": 24, "question_text": "Comment gérez-vous les situations où l'IA semble plus compétente que vous sur un sujet ?", "expected_criteria": "Gestion de l'asymétrie de compétence"},
    {"question_id": 25, "question_text": "Décrivez votre processus pour décomposer un problème complexe en sous-questions pour l'IA.", "expected_criteria": "Décomposition analytique"},
    {"question_id": 26, "question_text": "Comment maintenez-vous une vision critique face à des réponses d'IA particulièrement convaincantes ?", "expected_criteria": "Vigilance critique"},
    {"question_id": 27, "question_text": "Quelle est votre approche pour combiner plusieurs sources (IA et autres) dans votre travail ?", "expected_criteria": "Synthèse multi-sources"},
    {"question_id": 28, "question_text": "Comment définissez-vous le succès d'une session de travail avec l'IA ?", "expected_criteria": "Critères de réussite"},
    {"question_id": 29, "question_text": "Décrivez comment vous adaptez votre niveau de détail dans vos demandes à l'IA.", "expected_criteria": "Calibration communicationnelle"},
    {"question_id": 30, "question_text": "Comment gérez-vous la frustration lorsque l'IA ne comprend pas vos intentions ?", "expected_criteria": "Résilience cognitive"},
    {"question_id": 31, "question_text": "Quelle est votre stratégie pour exploiter les erreurs de l'IA comme opportunités d'apprentissage ?", "expected_criteria": "Apprentissage par l'erreur"},
    {"question_id": 32, "question_text": "Comment assurez-vous la traçabilité de vos décisions prises avec l'aide de l'IA ?", "expected_criteria": "Responsabilité décisionnelle"},
    {"question_id": 33, "question_text": "Décrivez comment vous établissez les limites de ce que vous déléguez à l'IA.", "expected_criteria": "Définition du périmètre"},
    {"question_id": 34, "question_text": "Comment évaluez-vous si une tâche est mieux adaptée à l'humain ou à l'IA ?", "expected_criteria": "Allocation cognitive"},
    {"question_id": 35, "question_text": "Quelle est votre approche pour maintenir votre expertise dans un domaine o�� vous utilisez fréquemment l'IA ?", "expected_criteria": "Préservation des compétences"},
    {"question_id": 36, "question_text": "Comment gérez-vous les attentes des autres concernant votre utilisation de l'IA ?", "expected_criteria": "Gestion sociale de l'IA"},
    {"question_id": 37, "question_text": "Décrivez votre processus de révision du travail produit avec l'assistance de l'IA.", "expected_criteria": "Contrôle qualité"},
    {"question_id": 38, "question_text": "Comment identifiez-vous le moment où vous devez arrêter d'itérer avec l'IA et finaliser votre travail ?", "expected_criteria": "Gestion de la clôture"},
    {"question_id": 39, "question_text": "Quelle est votre méthode pour transférer les connaissances acquises avec l'IA à d'autres contextes ?", "expected_criteria": "Transfert de connaissances"},
    {"question_id": 40, "question_text": "Comment anticipez-vous l'évolution de votre relation avec les outils d'IA ?", "expected_criteria": "Vision prospective"},
]


def get_series_config(series_type: SeriesType):
    """Get configuration based on series type"""
    if series_type == SeriesType.MONO:
        return {
            "total_modules": 1,
            "questions_per_module": 28,
            "timer_per_module": 65,  
            "total_questions": 28
        }
    elif series_type == SeriesType.BI:
        return {
            "total_modules": 2,
            "questions_per_module": 22,
            "timer_per_module": 50, 
            "total_questions": 44
        }
    elif series_type == SeriesType.TRI:  
        return {
            "total_modules": 3,
            "questions_per_module": 22,
            "timer_per_module": 50,
            "total_questions": 66
        }
    elif series_type == SeriesType.MT:  
        return {
            "total_modules": 1,
            "questions_per_module": 3,
            "timer_per_module": 10,  
            "total_questions": 3
        }
    elif series_type == SeriesType.BT: 
        return {
            "total_modules": 2,
            "questions_per_module": 2,
            "timer_per_module": 20, 
            "total_questions": 4
        }
    elif series_type == SeriesType.TT:  
        return {
            "total_modules": 3,
            "questions_per_module": 2,
            "timer_per_module": 30,  
            "total_questions": 6
        }


def get_module_questions(series_type: str, module_number: int):
    """Get fixed questions for a specific series type and module.

    Uses the canonical question banks from series_questions.py instead of random selection.
    """
    questions = get_questions_for_series(series_type, module_number)
    return questions


@router.get("/types")
async def get_series_types():
    """Get available series types with their configurations"""
    return {
        "series": [
            {
                "type": "mono",
                "name": "M1 Series",
                "description": "Single module intensive assessment",
                "modules": 1,
                "questions": 28,
                "timer_minutes": 65,
                "color": "from-[#050E3C] to-[#050E3C]"
            },
            {
                "type": "bi",
                "name": "M2 Series",
                "description": "Two-module progressive assessment",
                "modules": 2,
                "questions": 44,
                "questions_per_module": 22,
                "timer_minutes": 50,
                "break_minutes": 15,
                "color": "from-[#050E3C] to-[#050E3C]"
            },
            {
                "type": "tri",
                "name": "M3 Series",
                "description": "Three-module comprehensive assessment",
                "modules": 3,
                "questions": 66,
                "questions_per_module": 22,
                "timer_minutes": 50,
                "break_minutes": 15,
                "color": "from-[#050E3C] to-[#050E3C]"
            },
            {
                "type": "mt",
                "name": "M1 Test Series",
                "description": "Single module intensive assessment",
                "modules": 1,
                "questions": 3,
                "timer_minutes": 10,
                "color": "from-[#050E3C] to-[#050E3C]"
            },
            {
                "type": "bt",
                "name": "M2 Test Series",
                "description": "Two-module progressive assessment",
                "modules": 2,
                "questions": 4,
                "questions_per_module": 2,
                "timer_minutes": 20,
                "break_minutes": 2,
                "color": "from-[#050E3C] to-[#050E3C]"
            },
            {
                "type": "tt",
                "name": "M3 Test Series",
                "description": "Three-module comprehensive assessment",
                "modules": 3,
                "questions": 6,
                "questions_per_module": 3,
                "timer_minutes": 30,
                "break_minutes": 2,
                "color": "from-[#050E3C] to-[#050E3C]"
            },
        ]
    }


@router.post("/start", response_model=SeriesTestResponse)
async def start_series_test(
    request: SeriesStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a new series test"""

    config = get_series_config(request.series_type)
    series_type_str = request.series_type.value

    # Get fixed questions for all modules (no longer random)
    module_1_questions = get_module_questions(series_type_str, 1)

    module_2_questions = None
    module_3_questions = None

    if config["total_modules"] >= 2:
        module_2_questions = get_module_questions(series_type_str, 2)

    if config["total_modules"] >= 3:
        module_3_questions = get_module_questions(series_type_str, 3)

    # Create test attempt with simple name
    series_name_map = {
        "mono": "M1 Series",
        "bi": "M2 Series",
        "tri": "M3 Series",
        "mt": "M1-T Series",
        "bt": "M2-T Series",
        "tt": "M3-T Series"
    }
    test_name = series_name_map.get(request.series_type.value, f"Series {request.series_type.value.upper()}")

    test = SeriesTestAttempt(
        user_id=current_user.id,
        series_type=request.series_type.value,  # Use .value for string
        test_name=test_name,
        total_questions=config["total_questions"],
        total_modules=config["total_modules"],
        timer_per_module=config["timer_per_module"],
        module_1_questions=module_1_questions,
        module_1_status="not_started",  # Use string value
        module_2_questions=module_2_questions,
        module_2_status="not_started" if module_2_questions else None,
        module_3_questions=module_3_questions,
        module_3_status="not_started" if module_3_questions else None,
        current_module=1
    )

    db.add(test)
    db.commit()
    db.refresh(test)

    return test


@router.post("/start-module/{test_id}/{module_number}")
async def start_module(
    test_id: int,
    module_number: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a module as started and record start time"""

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id,
        SeriesTestAttempt.user_id == current_user.id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if module_number > test.total_modules:
        raise HTTPException(status_code=400, detail="Invalid module number")

    now = datetime.utcnow()

    if module_number == 1:
        test.module_1_status = "in_progress"
        test.module_1_started_at = now
    elif module_number == 2:
        test.module_2_status = "in_progress"
        test.module_2_started_at = now
    elif module_number == 3:
        test.module_3_status = "in_progress"
        test.module_3_started_at = now

    test.current_module = module_number
    db.commit()

    return {"message": f"Module {module_number} started", "started_at": now}


@router.post("/submit-module")
async def submit_module(
    request: SeriesModuleSubmitRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit answers for a module"""

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == request.test_id,
        SeriesTestAttempt.user_id == current_user.id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if request.module_number > test.total_modules:
        raise HTTPException(status_code=400, detail="Invalid module number")

    now = datetime.utcnow()

    # Save module answers and mark as completed
    if request.module_number == 1:
        test.module_1_answers = request.answers
        test.module_1_status = "completed"
        test.module_1_completed_at = now
        test.module_1_time_taken_seconds = request.time_taken_seconds
    elif request.module_number == 2:
        test.module_2_answers = request.answers
        test.module_2_status = "completed"
        test.module_2_completed_at = now
        test.module_2_time_taken_seconds = request.time_taken_seconds
    elif request.module_number == 3:
        test.module_3_answers = request.answers
        test.module_3_status = "completed"
        test.module_3_completed_at = now
        test.module_3_time_taken_seconds = request.time_taken_seconds

    # Commit answers immediately (don't lose data)
    db.commit()

    # Check if this is the last module
    is_final_module = request.module_number == test.total_modules

    if is_final_module:
        # Schedule background task for analysis and auto-email
        # This allows user to navigate away while analysis continues
        background_tasks.add_task(run_analysis_and_send_email, test.id)

        return {
            "message": "Test submitted - analysis in progress",
            "test_id": test.id,
            "is_final": True,
            "analysis_in_progress": True
        }
    else:
        # Not final module - return break info
        return {
            "message": f"Module {request.module_number} completed",
            "test_id": test.id,
            "is_final": False,
            "next_module": request.module_number + 1,
            "break_duration_minutes": test.break_duration
        }


@router.get("/analysis-status/{test_id}")
async def get_analysis_status(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if analysis is complete for a test (used for polling)"""

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    return {
        "test_id": test.id,
        "is_completed": test.is_completed,
        "score": test.score if test.is_completed else None,
        "email_sent": test.email_sent
    }


@router.get("/test/{test_id}", response_model=SeriesTestResponse)
async def get_series_test(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get series test details"""

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id,
        SeriesTestAttempt.user_id == current_user.id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    return test


@router.get("/result/{test_id}")
async def get_series_result(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get series test results"""

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if not test.is_completed:
        raise HTTPException(status_code=400, detail="Test not completed yet")

    # Parse analysis
    analysis_data = json.loads(test.analysis) if test.analysis else {}

    parsed_analyses = {}
    if "analyses" in analysis_data:
        for engine, analysis_str in analysis_data["analyses"].items():
            try:
                parsed_analyses[engine] = json.loads(analysis_str) if isinstance(analysis_str, str) else analysis_str
            except:
                parsed_analyses[engine] = {"error": "Failed to parse"}

    # Combine all answers
    all_answers = []
    all_answers.extend(test.module_1_answers or [])
    all_answers.extend(test.module_2_answers or [])
    all_answers.extend(test.module_3_answers or [])

    # Calculate total time
    total_time = 0
    if test.module_1_time_taken_seconds:
        total_time += test.module_1_time_taken_seconds
    if test.module_2_time_taken_seconds:
        total_time += test.module_2_time_taken_seconds
    if test.module_3_time_taken_seconds:
        total_time += test.module_3_time_taken_seconds

    return {
        "test_id": test.id,
        "test_name": test.test_name,
        "series_type": test.series_type,  # Already a string
        "total_questions": test.total_questions,
        "total_modules": test.total_modules,
        "score": test.score,
        "analyses": parsed_analyses,
        "completed_at": test.completed_at.isoformat() if test.completed_at else None,
        "module_1_time_taken": test.module_1_time_taken_seconds,
        "module_2_time_taken": test.module_2_time_taken_seconds,
        "module_3_time_taken": test.module_3_time_taken_seconds,
        "total_time_taken": total_time,
        "all_answers": all_answers,
        "email_sent": test.email_sent
    }


@router.get("/dashboard", response_model=List[SeriesDashboardItem])
async def get_series_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all series tests for dashboard"""

    tests = db.query(SeriesTestAttempt).order_by(
        SeriesTestAttempt.created_at.desc()
    ).all()

    result = []
    for test in tests:
        result.append({
            "id": test.id,
            "test_name": test.test_name,
            "series_type": test.series_type,
            "total_questions": test.total_questions,
            "total_modules": test.total_modules,
            "current_module": test.current_module,
            "score": test.score,
            "is_completed": test.is_completed,
            "completed_at": test.completed_at,
            "created_at": test.created_at,
            "module_1_time_taken": test.module_1_time_taken_seconds,
            "module_2_time_taken": test.module_2_time_taken_seconds,
            "module_3_time_taken": test.module_3_time_taken_seconds,
            "user": {
                "full_name": test.user.full_name if test.user else None,
                "email": test.user.email if test.user else None
            } if test.user else None
        })

    return result


@router.delete("/delete/{test_id}")
async def delete_series_test(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a series test"""

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    db.delete(test)
    db.commit()

    return {"message": "Series test deleted", "test_id": test_id}


@router.patch("/remarks/{test_id}")
async def update_series_remarks(
    test_id: int,
    remarks: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update remarks for a series test"""
    from ..utils.auth import is_admin_user

    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")

    test = db.query(SeriesTestAttempt).filter(SeriesTestAttempt.id == test_id).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    test.remarks = remarks
    db.commit()

    return {"message": "Remarks updated successfully", "test_id": test_id}


@router.post("/feedback/{test_id}")
async def submit_series_feedback(
    test_id: int,
    feedback: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit feedback for a series test"""

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    test.feedback = feedback.get("feedback", "")
    db.commit()

    return {"message": "Feedback submitted successfully", "test_id": test_id}


@router.get("/qaa-pdf/{test_id}/{model_name}")
async def download_series_qaa_pdf(
    test_id: int,
    model_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate and download Q&A with Analysis PDF for series test"""
    from fastapi.responses import StreamingResponse
    import io

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if not test.is_completed:
        raise HTTPException(status_code=400, detail="Test not completed")

    # Parse analysis
    analysis_data = json.loads(test.analysis) if test.analysis else {}

    if "analyses" not in analysis_data:
        raise HTTPException(status_code=400, detail="Analysis not available")

    model_analysis_str = analysis_data["analyses"].get(model_name)
    if not model_analysis_str:
        raise HTTPException(status_code=404, detail=f"Analysis for {model_name} not found")

    model_analysis = json.loads(model_analysis_str) if isinstance(model_analysis_str, str) else model_analysis_str

    # Combine all questions and answers
    all_questions = []
    all_answers = []

    all_questions.extend(test.module_1_questions or [])
    all_answers.extend(test.module_1_answers or [])

    if test.module_2_questions:
        all_questions.extend(test.module_2_questions)
        all_answers.extend(test.module_2_answers or [])

    if test.module_3_questions:
        all_questions.extend(test.module_3_questions)
        all_answers.extend(test.module_3_answers or [])

    # Import the generator
    from ..utils.qaa_pdf_generator import generate_qaa_pdf

    user_name = test.user.full_name if test.user else "Guest User"

    pdf_buffer = generate_qaa_pdf(
        test_name=test.test_name,
        user_name=user_name,
        completed_at=test.completed_at.isoformat() if test.completed_at else "",
        questions=all_questions,
        answers=all_answers,
        analysis=model_analysis,
        model_name=model_name,
        score=test.score or 0
    )

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=INDX1000_QAA_{model_name}_{test_id}.pdf"
        }
    )


@router.post("/send-email/{test_id}")
async def send_series_result_email(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send series test result email"""
    from ..utils.email_service import send_result_email

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if not test.is_completed or test.score is None:
        raise HTTPException(status_code=400, detail="Test not completed or no score available")

    if test.email_sent:
        raise HTTPException(status_code=400, detail="Email already sent")

    user_name = test.user.full_name if test.user else "Guest User"
    user_email = test.user.email if test.user else None

    if not user_email:
        raise HTTPException(status_code=400, detail="No email address available")

    # Parse analysis (use GPT-4o as primary)
    analysis_data = json.loads(test.analysis) if test.analysis else {}
    gpt4o_analysis = {}

    if "analyses" in analysis_data:
        gpt4o_str = analysis_data["analyses"].get("gpt4o", "{}")
        gpt4o_analysis = json.loads(gpt4o_str) if isinstance(gpt4o_str, str) else gpt4o_str

    result = await send_result_email(
        user_email=user_email,
        user_name=user_name,
        test_name=test.test_name,
        test_id=test.id,
        score=test.score,
        analysis=gpt4o_analysis,
        completed_at=test.completed_at.isoformat() if test.completed_at else ""
    )

    if result["success"]:
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


@router.get("/certificate/{test_id}")
async def download_series_certificate(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate and download certificate for a series test"""
    from fastapi.responses import StreamingResponse
    from ..utils.certificate_generator import generate_certificate

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if not test.is_completed or not test.score:
        raise HTTPException(status_code=400, detail="Test not completed or score unavailable")

    user_name = test.user.full_name if test.user else "Guest User"
    user_email = test.user.email if test.user else "N/A"

    pdf_buffer = generate_certificate(
        user_name=user_name,
        email=user_email,
        test_name=test.test_name,
        score=test.score,
        completed_at=test.completed_at.isoformat() if test.completed_at else ""
    )

    filename = f"INDX1000_Certificate_{user_name.replace(' ', '_')}_{test_id}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


@router.get("/qa-pdf/{test_id}")
async def download_series_qa_pdf(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate and download Q&A PDF for a series test"""
    from fastapi.responses import StreamingResponse
    from ..utils.qa_pdf_generator import generate_qa_pdf

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if not test.is_completed:
        raise HTTPException(status_code=400, detail="Test not completed")

    # Combine all questions and answers from modules
    all_questions = []
    all_answers = []

    all_questions.extend(test.module_1_questions or [])
    all_answers.extend(test.module_1_answers or [])

    if test.module_2_questions:
        all_questions.extend(test.module_2_questions)
        all_answers.extend(test.module_2_answers or [])

    if test.module_3_questions:
        all_questions.extend(test.module_3_questions)
        all_answers.extend(test.module_3_answers or [])

    user_name = test.user.full_name if test.user else "Guest User"

    pdf_buffer = generate_qa_pdf(
        test_name=test.test_name,
        user_name=user_name,
        completed_at=test.completed_at.isoformat() if test.completed_at else "",
        questions=all_questions,
        answers=all_answers
    )

    filename = f"INDX1000_QA_{user_name.replace(' ', '_')}_{test_id}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


@router.get("/answers/{test_id}")
async def get_series_answers(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get series test questions and answers for display"""

    test = db.query(SeriesTestAttempt).filter(
        SeriesTestAttempt.id == test_id
    ).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Combine all questions and answers from modules
    all_questions = []
    all_answers = []

    # Module 1
    for i, q in enumerate(test.module_1_questions or [], 1):
        all_questions.append({
            "question_id": i,
            "question_text": q.get("question_text", ""),
            "module": 1
        })
    all_answers.extend(test.module_1_answers or [])

    # Module 2
    if test.module_2_questions:
        offset = len(test.module_1_questions or [])
        for i, q in enumerate(test.module_2_questions, 1):
            all_questions.append({
                "question_id": offset + i,
                "question_text": q.get("question_text", ""),
                "module": 2
            })
        for a in (test.module_2_answers or []):
            a_copy = a.copy()
            a_copy["question_id"] = a["question_id"] + offset
            all_answers.append(a_copy)

    # Module 3
    if test.module_3_questions:
        offset = len(test.module_1_questions or []) + len(test.module_2_questions or [])
        for i, q in enumerate(test.module_3_questions, 1):
            all_questions.append({
                "question_id": offset + i,
                "question_text": q.get("question_text", ""),
                "module": 3
            })
        for a in (test.module_3_answers or []):
            a_copy = a.copy()
            a_copy["question_id"] = a["question_id"] + offset
            all_answers.append(a_copy)

    return {
        "test_id": test.id,
        "test_name": test.test_name,
        "series_type": test.series_type,
        "total_modules": test.total_modules,
        "questions": all_questions,
        "answers": all_answers,
        "completed_at": test.completed_at.isoformat() if test.completed_at else None
    }
