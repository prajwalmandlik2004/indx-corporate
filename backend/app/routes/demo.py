from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import json
from ..database import get_db
from ..models.user import User
from ..models.test import TestAttempt, TestCategory, TestLevel
from ..schemas.test import AnswerSchema as Answer
from ..utils.auth import get_current_user
from ..utils.ai_analyzer import analyze_test_results

from pydantic import BaseModel

class DemoSubmitRequest(BaseModel):
    test_id: int
    answers: List[Answer]

router = APIRouter(prefix="/api/demo", tags=["Demo"])

# Hardcoded demo questions
DEMO_SERIES = {
    "series_a": {
        "title": "Series S",
        "description": "Évaluation des capacités d'analyse et de raisonnement",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous utilisez une IA pour préparer une décision importante. Elle vous propose d'emblée une synthèse convaincante, alors que le périmètre exact du problème n'a pas été formalisé explicitement. Indiquez votre point de départ et ce que vous fixez en premier.",
                "expected_criteria": "Structure méthodique, gestion de l'incertitude"
            },
            {
                "question_id": 2,
                "question_text": "Vous demandez à l'IA sur quelles informations elle s'appuie. Elle répond de manière fluide mais mélange des faits, des hypothèses et des généralisations. Décrivez comment vous posez le cadre de ce qui peut être tenu pour acquis.",
                "expected_criteria": "Pensée critique, évaluation des sources"
            },
            {
                "question_id": 3,
                "question_text": "Vous reformulez votre demande pour être plus précis. L'IA change sensiblement de recommandation, sans signaler clairement ce qui a motivé ce changement. Indiquez comment vous traitez cette bascule.",
                "expected_criteria": "Adaptabilité, analyse des changements"
            },
            {
                "question_id": 4,
                "question_text": "Vous introduisez un critère non négociable (conformité, éthique, sécurité, contraintes opérationnelles). L'IA 's'adapte' mais laisse passer un détail incompatible avec ce critère. Expliquez comment vous réagissez et ce que vous ajustez.",
                "expected_criteria": "Vigilance, gestion des contraintes"
            },
            {
                "question_id": 5,
                "question_text": "L'IA vous propose une solution élégante, mais elle suppose implicitement des conditions qui ne sont pas garanties dans le réel. Décrivez comment vous testez la solidité de cette proposition.",
                "expected_criteria": "Esprit critique, validation méthodique"
            },
            {
                "question_id": 6,
                "question_text": "Vous demandez à l'IA de comparer deux options. Elle fournit une comparaison structurée, mais vous remarquez une incohérence entre deux parties de son raisonnement. Indiquez comment vous traitez cette incohérence.",
                "expected_criteria": "Détection d'incohérences, résolution"
            },
            {
                "question_id": 7,
                "question_text": "Un acteur humain (décideur, client, partenaire) impose une contrainte de calendrier. L'IA vous incite à choisir vite 'la meilleure option', alors que l'incertitude demeure. Précisez ce que vous priorisez pour décider.",
                "expected_criteria": "Gestion de la pression, priorisation"
            },
            {
                "question_id": 8,
                "question_text": "Vous demandez à l'IA d'expliciter les risques. Elle liste des risques plausibles mais omet un risque majeur que vous jugez possible. Décrivez comment vous complétez et restructurez l'analyse.",
                "expected_criteria": "Analyse de risques, complétude"
            },
            {
                "question_id": 9,
                "question_text": "Vous demandez un plan d'action. L'IA fournit un plan détaillé, mais certains points semblent optimisés localement au détriment de l'objectif global. Indiquez comment vous réalignez l'action sur l'objectif.",
                "expected_criteria": "Vision stratégique, réalignement"
            },
            {
                "question_id": 10,
                "question_text": "Une information nouvelle arrive et contredit partiellement la trajectoire choisie. L'IA propose une correction, mais elle paraît 'sauter' trop vite à une conclusion. Expliquez comment vous ajustez sans perdre la cohérence.",
                "expected_criteria": "Adaptabilité contrôlée, cohérence"
            },
            {
                "question_id": 11,
                "question_text": "La décision est engagée. Les premiers effets sont ambigus. L'IA interprète ces signaux dans un sens déterminé, sans considérer d'hypothèses concurrentes. Décrivez comment vous gardez le contrôle de l'interprétation.",
                "expected_criteria": "Maintien du contrôle, ouverture d'esprit"
            },
            {
                "question_id": 12,
                "question_text": "Vous devez maintenant piloter la suite : surveiller, corriger, documenter, et décider quand réviser la trajectoire. L'IA reste un outil puissant mais non responsable. Indiquez comment vous organisez le pilotage post-décision.",
                "expected_criteria": "Organisation, pilotage continu"
            }
        ]
    },
    "series_b": {
        "title": "Series B",
        "description": "Évaluation de la cohérence et de l'adaptation",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Une IA vous propose immédiatement une recommandation 'optimale' alors que les critères de réussite n'ont pas été explicités. Indiquez ce que vous fixez avant toute discussion.",
                "expected_criteria": "Clarification des objectifs"
            },
            {
                "question_id": 2,
                "question_text": "Interrogée sur ses sources, l'IA mélange données factuelles, extrapolations et analogies plausibles. Précisez comment vous distinguez ce qui est établi de ce qui ne l'est pas.",
                "expected_criteria": "Distinction fait/hypothèse"
            },
            {
                "question_id": 3,
                "question_text": "Après clarification, l'IA modifie sensiblement sa position sans expliquer la transition. Décrivez votre manière d'interpréter ce changement.",
                "expected_criteria": "Interprétation des changements"
            },
            {
                "question_id": 4,
                "question_text": "Vous introduisez une contrainte stricte. L'IA reformule mais conserve une hypothèse incompatible. Indiquez comment vous traitez cette incompatibilité.",
                "expected_criteria": "Gestion des incompatibilités"
            },
            {
                "question_id": 5,
                "question_text": "La solution proposée est élégante mais repose sur une hypothèse tacite non vérifiée. Expliquez comment vous testez cette hypothèse.",
                "expected_criteria": "Validation des hypothèses"
            },
            {
                "question_id": 6,
                "question_text": "L'IA compare deux options de façon structurée, mais une incohérence apparaît entre critères. Décrivez votre action face à cette incohérence.",
                "expected_criteria": "Résolution d'incohérences"
            },
            {
                "question_id": 7,
                "question_text": "Sous pression temporelle, l'IA pousse vers un choix rapide en minimisant l'incertitude restante. Indiquez ce que vous privilégiez pour décider.",
                "expected_criteria": "Décision sous contrainte"
            },
            {
                "question_id": 8,
                "question_text": "L'IA dresse une liste de risques plausibles mais en néglige un que vous jugez critique. Précisez comment vous complétez l'analyse.",
                "expected_criteria": "Complétude de l'analyse"
            },
            {
                "question_id": 9,
                "question_text": "Un plan d'action détaillé est proposé, avec des optimisations locales contraires à l'objectif global. Expliquez comment vous réalignez.",
                "expected_criteria": "Réalignement stratégique"
            },
            {
                "question_id": 10,
                "question_text": "Une information nouvelle contredit partiellement la trajectoire. L'IA conclut trop vite. Décrivez comment vous ajustez sans rompre la cohérence.",
                "expected_criteria": "Ajustement cohérent"
            },
            {
                "question_id": 11,
                "question_text": "Les premiers résultats sont ambigus. L'IA interprète unilatéralement. Indiquez comment vous maintenez une lecture ouverte.",
                "expected_criteria": "Maintien de l'ouverture"
            },
            {
                "question_id": 12,
                "question_text": "La décision est engagée. Il faut surveiller, corriger et décider quand réviser. Décrivez votre mode de pilotage.",
                "expected_criteria": "Organisation du pilotage"
            }
        ]
    },
    "series_c": {
        "title": "Series C",
        "description": "Évaluation de l'orientation et du pilotage",
        "questions": [
            {
                "question_id": 1,
                "question_text": "L'IA démarre avec une synthèse convaincante alors que le problème n'a pas été cadré. Indiquez votre point d'ancrage initial.",
                "expected_criteria": "Cadrage initial"
            },
            {
                "question_id": 2,
                "question_text": "Les arguments de l'IA alternent faits, corrélations et généralisations. Précisez comment vous hiérarchisez ces éléments.",
                "expected_criteria": "Hiérarchisation des informations"
            },
            {
                "question_id": 3,
                "question_text": "Une reformulation entraîne une recommandation différente, sans justification explicite. Expliquez comment vous traitez cette divergence.",
                "expected_criteria": "Traitement des divergences"
            },
            {
                "question_id": 4,
                "question_text": "Une contrainte non négociable est posée. L'IA s'ajuste mais laisse subsister un conflit latent. Indiquez votre réponse à ce conflit.",
                "expected_criteria": "Résolution de conflits"
            },
            {
                "question_id": 5,
                "question_text": "La proposition suppose des conditions idéales rarement réunies. Décrivez votre méthode de vérification.",
                "expected_criteria": "Méthode de vérification"
            },
            {
                "question_id": 6,
                "question_text": "La comparaison fournie est claire mais contient une contradiction interne. Expliquez comment vous la traitez.",
                "expected_criteria": "Traitement des contradictions"
            },
            {
                "question_id": 7,
                "question_text": "Un impératif externe impose de trancher vite. L'IA réduit la complexité pour accélérer. Indiquez ce que vous maintenez prioritaire.",
                "expected_criteria": "Maintien des priorités"
            },
            {
                "question_id": 8,
                "question_text": "Des risques sont listés ; un angle majeur reste absent. Précisez comment vous restructurez l'analyse.",
                "expected_criteria": "Restructuration de l'analyse"
            },
            {
                "question_id": 9,
                "question_text": "Le plan proposé maximise des gains locaux au détriment de la finalité. Expliquez votre réalignement.",
                "expected_criteria": "Réalignement sur la finalité"
            },
            {
                "question_id": 10,
                "question_text": "Un signal contradictoire apparaît. L'IA propose une correction abrupte. Décrivez votre ajustement.",
                "expected_criteria": "Ajustement progressif"
            },
            {
                "question_id": 11,
                "question_text": "Les résultats initiaux sont ambigus. L'IA privilégie une interprétation unique. Indiquez comment vous gardez le contrôle interprétatif.",
                "expected_criteria": "Contrôle interprétatif"
            },
            {
                "question_id": 12,
                "question_text": "Il faut désormais piloter dans la durée avec une IA non responsable. Décrivez votre organisation de suivi.",
                "expected_criteria": "Organisation du suivi"
            }
        ]
    }
}

@router.get("/series")
async def get_demo_series():
    """Get all available demo series"""
    return {
        "series": [
            {
                "id": "series_a",
                "title": DEMO_SERIES["series_a"]["title"],
                "description": DEMO_SERIES["series_a"]["description"],
                "question_count": len(DEMO_SERIES["series_a"]["questions"])
            },
            {
                "id": "series_b",
                "title": DEMO_SERIES["series_b"]["title"],
                "description": DEMO_SERIES["series_b"]["description"],
                "question_count": len(DEMO_SERIES["series_b"]["questions"])
            },
            {
                "id": "series_c",
                "title": DEMO_SERIES["series_c"]["title"],
                "description": DEMO_SERIES["series_c"]["description"],
                "question_count": len(DEMO_SERIES["series_c"]["questions"])
            }
        ]
    }

@router.post("/start/{series_id}")
async def start_demo_test(
    series_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a demo test for a specific series"""
    
    if series_id not in DEMO_SERIES:
        raise HTTPException(status_code=404, detail="Series not found")
    
    series = DEMO_SERIES[series_id]
    
    # Create test attempt with demo category
    test_attempt = TestAttempt(
        user_id=current_user.id,
        category=TestCategory.GENERAL,  # Use GENERAL for demo tests
        level=TestLevel.LEVEL_1,  # Use LEVEL_1 for demo tests
        test_name=f"Demo Test - {series['title']}",
        questions=series["questions"],
        answers=[]
    )
    
    db.add(test_attempt)
    db.commit()
    db.refresh(test_attempt)
    
    return {
        "id": test_attempt.id,
        "questions": series["questions"],  
        "test_name": test_attempt.test_name
    }


# Then change the endpoint to:
@router.post("/submit")
async def submit_demo_test(
    request: DemoSubmitRequest,  # Change this line
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit demo test answers and get analysis"""
    
    # Access via request.test_id and request.answers
    test = db.query(TestAttempt).filter(
        TestAttempt.id == request.test_id,  # Change this
        TestAttempt.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    if test.completed:
        raise HTTPException(status_code=400, detail="Test already completed")
    
    # Store answers
    answers_list = [{"question_id": a.question_id, "answer_text": a.answer_text} for a in request.answers]  # Change this
    test.answers = answers_list
    
    # Analyze results using AI (will auto-detect French and respond in French)
    analysis = await analyze_test_results(
        questions=test.questions,
        answers=answers_list,
        category="demo",
        level="évaluation"
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

@router.get("/test/{test_id}")
async def get_demo_test(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get demo test by ID"""
    test = db.query(TestAttempt).filter(
        TestAttempt.id == test_id,
        TestAttempt.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    return test