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
        "title": "Série 1",
        "description": "Décision et action en contexte incertain",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous travaillez avec une IA sur un dossier en cours.\nLes informations disponibles sont incomplètes, mais une réponse est attendue rapidement.\nL’IA vous demande comment avancer malgré ces manques.",
                "expected_criteria": "Gestion de l'incertitude, cadrage"
            },
            {
                "question_id": 2,
                "question_text": "Un premier cadre d’action a été esquissé avec l’IA.\nDepuis, certains éléments se sont révélés incertains, sans pour autant invalider l’ensemble.\nL’IA attend une instruction pour poursuivre.",
                "expected_criteria": "Ajustement du cadre, continuité"
            },
            {
                "question_id": 3,
                "question_text": "Le contexte évolue, mais toutes les données ne sont pas encore consolidées.\nReporter la décision est possible, mais aurait des effets indirects sur la suite du travail.\nL’IA vous demande quelle option retenir.",
                "expected_criteria": "Arbitrage, anticipation"
            },
            {
                "question_id": 4,
                "question_text": "Plusieurs pistes sont envisageables, aucune ne s’impose clairement.\nLes critères habituels de priorité ne sont pas applicables dans ce cas précis.\nL’IA vous sollicite pour trancher.",
                "expected_criteria": "Décision sans hiérarchie claire"
            },
            {
                "question_id": 5,
                "question_text": "L’IA propose d’attendre des informations supplémentaires avant d’agir.\nVous savez que ce délai pourrait modifier l’équilibre global de la situation.\nVous devez lui répondre.",
                "expected_criteria": "Gestion du temps, impact global"
            },
            {
                "question_id": 6,
                "question_text": "Une action est possible immédiatement, mais elle implique d’écarter certaines hypothèses.\nNe rien faire préserverait ces hypothèses, au prix d’un ralentissement notable.\nL’IA vous demande quelle voie suivre.",
                "expected_criteria": "Choix action / inaction"
            },
            {
                "question_id": 7,
                "question_text": "La décision à prendre pourra être discutée ultérieurement, voire critiquée.\nÀ ce stade, aucune option ne permet d’éviter complètement ce risque.\nL’IA attend votre position.",
                "expected_criteria": "Responsabilité décisionnelle"
            },
            {
                "question_id": 8,
                "question_text": "L’IA vous demande une validation formelle.\nVous ne disposez pas de tous les éléments nécessaires pour la donner pleinement.\nVous devez néanmoins lui répondre.",
                "expected_criteria": "Validation sous contrainte"
            },
            {
                "question_id": 9,
                "question_text": "Deux options sont sur la table.\nToutes deux reposent sur des bases fragiles, mais pour des raisons différentes.\nL’IA vous demande laquelle privilégier.",
                "expected_criteria": "Comparaison de fragilités"
            },
            {
                "question_id": 10,
                "question_text": "Le temps passe sans qu’une décision claire n’émerge.\nVous constatez que cette absence de choix commence elle-même à produire des effets.\nL’IA vous interroge sur la suite.",
                "expected_criteria": "Effets de la non-décision"
            },
            {
                "question_id": 11,
                "question_text": "Une action envisagée peut être corrigée plus tard, mais son coût initial est élevé.\nL’inaction, elle, est peu coûteuse à court terme mais difficilement réversible.\nL’IA vous demande comment procéder.",
                "expected_criteria": "Coût et réversibilité"
            },
            {
                "question_id": 12,
                "question_text": "Le travail touche à une étape où aucune certitude supplémentaire ne peut être obtenue.\nPourtant, la séquence doit être close afin de poursuivre.\nL’IA vous demande comment finaliser.",
                "expected_criteria": "Clôture sans certitude"
            }
        ]
    },

    "series_b": {
        "title": "Série 2",
        "description": "Définition et maîtrise du périmètre",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous échangez avec une IA sur un sujet dont les contours sont encore flous.\nPlusieurs directions semblent possibles, toutes raisonnables.\nL’IA vous demande ce qui doit être traité, et ce qui ne doit pas l’être.",
                "expected_criteria": "Délimitation du périmètre"
            },
            {
                "question_id": 2,
                "question_text": "Une demande initiale a été formulée de manière volontairement large.\nEn travaillant avec l’IA, vous constatez que certaines dimensions s’ajoutent naturellement.\nVous devez préciser ce qui relève réellement de la demande.",
                "expected_criteria": "Clarification de la demande"
            },
            {
                "question_id": 3,
                "question_text": "L’IA reformule votre objectif pour le rendre plus complet.\nCette reformulation paraît cohérente, mais modifie légèrement le champ initial.\nVous devez réagir.",
                "expected_criteria": "Réaction à l’élargissement"
            },
            {
                "question_id": 4,
                "question_text": "Au fil des échanges, le périmètre de travail tend à s’étendre.\nRien n’est manifestement faux, mais l’ensemble devient difficile à maîtriser.\nL’IA attend votre arbitrage sur le cadre à retenir.",
                "expected_criteria": "Arbitrage du cadre"
            },
            {
                "question_id": 5,
                "question_text": "Vous identifiez plusieurs éléments intéressants mais périphériques.\nLes inclure améliorerait la richesse du résultat, au prix d’un élargissement du cadre.\nL’IA vous demande si elle doit les intégrer.",
                "expected_criteria": "Gestion des éléments périphériques"
            },
            {
                "question_id": 6,
                "question_text": "Le sujet traité comporte des zones volontairement imprécises.\nL’IA cherche à les préciser pour avancer plus efficacement.\nVous devez décider ce qui doit rester indéterminé.",
                "expected_criteria": "Acceptation de l’indétermination"
            },
            {
                "question_id": 7,
                "question_text": "Une partie du problème semble proche du cœur du sujet sans en faire pleinement partie.\nL’IA propose de la traiter « au passage ».\nVous devez lui répondre.",
                "expected_criteria": "Gestion du hors-périmètre"
            },
            {
                "question_id": 8,
                "question_text": "Certaines hypothèses apparaissent utiles mais reposent sur peu d’éléments.\nLes exclure réduit le champ, les inclure augmente l’incertitude.\nL’IA vous demande comment procéder.",
                "expected_criteria": "Choix face à l’incertitude"
            },
            {
                "question_id": 9,
                "question_text": "Le cadre de travail n’a jamais été formalisé explicitement.\nJusqu’ici, cela n’a pas posé de difficulté majeure.\nL’IA vous demande de le poser clairement.",
                "expected_criteria": "Formalisation du cadre"
            },
            {
                "question_id": 10,
                "question_text": "Une reformulation plus précise est proposée par l’IA.\nElle semble améliorer la clarté, mais introduit un biais possible.\nVous devez trancher.",
                "expected_criteria": "Clarté vs biais"
            },
            {
                "question_id": 11,
                "question_text": "L’IA identifie un axe d’optimisation pertinent.\nVous percevez que cet axe n’est peut-être pas souhaitable dans ce contexte.\nVous devez lui répondre.",
                "expected_criteria": "Pertinence contextuelle"
            },
            {
                "question_id": 12,
                "question_text": "Le travail avance, mais vous sentez que l’IA dépasse progressivement son rôle initial.\nAucun signal d’erreur n’est évident.\nVous devez décider où s’arrête légitimement son intervention.",
                "expected_criteria": "Limites de l’IA"
            }
        ]
    },

    "series_c": {
        "title": "Série 3",
        "description": "Contradictions et problèmes ouverts",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous travaillez avec une IA sur une situation qui comporte une contradiction centrale.\nCette contradiction ne peut pas être levée sans déformer le problème.\nL’IA vous demande comment avancer.",
                "expected_criteria": "Gestion des contradictions"
            },
            {
                "question_id": 2,
                "question_text": "Une demande vous est adressée, mais certaines notions restent ambiguës.\nAucune clarification supplémentaire n’est réellement possible.\nL’IA vous sollicite pour poursuivre.",
                "expected_criteria": "Action malgré l’ambiguïté"
            },
            {
                "question_id": 3,
                "question_text": "Plusieurs interprétations du problème coexistent.\nAucune ne s’impose clairement comme la « bonne ».\nL’IA cherche une direction.",
                "expected_criteria": "Pluralité des lectures"
            },
            {
                "question_id": 4,
                "question_text": "L’IA tente de résumer la situation pour la rendre plus cohérente.\nVous constatez que cette synthèse gomme une tension essentielle.\nVous devez lui répondre.",
                "expected_criteria": "Préservation des tensions"
            },
            {
                "question_id": 5,
                "question_text": "Le sujet traité ne permet pas de conclusion nette.\nPourtant, un résultat est attendu à ce stade.\nL’IA vous demande comment formuler la suite.",
                "expected_criteria": "Résultat sans clôture"
            },
            {
                "question_id": 6,
                "question_text": "Une zone d’incertitude demeure malgré les échanges.\nElle semble constitutive du problème, et non accidentelle.\nL’IA vous interroge sur la manière de la traiter.",
                "expected_criteria": "Incertitude structurelle"
            },
            {
                "question_id": 7,
                "question_text": "L’IA propose une simplification qui rendrait l’ensemble plus lisible.\nVous percevez que cette lisibilité serait trompeuse.\nVous devez lui répondre.",
                "expected_criteria": "Refus de la simplification abusive"
            },
            {
                "question_id": 8,
                "question_text": "Le cadre de travail accepte plusieurs lectures concurrentes.\nEn choisir une seule faciliterait l’action, mais appauvrirait la situation.\nL’IA attend votre position.",
                "expected_criteria": "Maintien de la complexité"
            },
            {
                "question_id": 9,
                "question_text": "L’IA cherche à hiérarchiser des éléments qui résistent à toute hiérarchie stable.\nCette tentative semble pragmatique, mais discutable.\nVous devez réagir.",
                "expected_criteria": "Refus de hiérarchie forcée"
            },
            {
                "question_id": 10,
                "question_text": "Le problème reste ouvert, malgré l’avancée du travail.\nVous savez qu’il ne pourra pas être « résolu » au sens classique.\nL’IA vous demande comment continuer.",
                "expected_criteria": "Continuation sans résolution"
            },
            {
                "question_id": 11,
                "question_text": "Une clarification supplémentaire est demandée par l’IA.\nVous savez qu’elle introduirait plus d’erreur que de compréhension.\nVous devez lui répondre.",
                "expected_criteria": "Refus de fausse clarté"
            },
            {
                "question_id": 12,
                "question_text": "La demande initiale ne peut être comprise de manière univoque.\nToute tentative de la stabiliser en trahirait une part essentielle.\nL’IA vous interroge sur la suite à donner.",
                "expected_criteria": "Acceptation de l’indétermination"
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
        test_name=f"{series['title']}",
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