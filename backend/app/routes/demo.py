from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json
from ..database import get_db
from ..models.user import User
from ..models.test import TestAttempt, TestCategory, TestLevel
from ..schemas.test import AnswerSchema as Answer
from ..utils.auth import get_current_user, is_admin_user
from ..utils.ai_analyzer import analyze_test_results
from ..utils.ai_orchestrator import orchestrate_analysis

from pydantic import BaseModel

class DemoSubmitRequest(BaseModel):
    test_id: int
    answers: List[Answer]

router = APIRouter(prefix="/api/demo", tags=["Demo"])

DEMO_SERIES = {
     "series_a": {
        "title": "Série 15 - S1",
        "description": "Cadrage et décalage dans l'échange",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous démarrez un échange avec une IA sur un sujet encore mal cadré. Les premières réponses apportent rapidement une structure exploitable. Certains éléments évoqués au départ disparaissent ensuite.\nDécrivez la manière dont vous réagissez.",
                "expected_criteria": "Disparition d'éléments"
            },
            {
                "question_id": 2,
                "question_text": "Vous formulez une demande précise à une IA dans un contexte de travail défini. La réponse obtenue paraît pertinente à première lecture. Un décalage apparaît toutefois avec votre attente initiale.\nIndiquez ce que vous faites dans ce cas.",
                "expected_criteria": "Décalage avec attente"
            },
            {
                "question_id": 3,
                "question_text": "Vous reformulez une demande après une première réponse insatisfaisante. La nouvelle réponse est plus structurée mais modifie partiellement le sens initial. Une tension apparaît entre clarté et fidélité à l'objectif.\nPrésentez la suite que vous donnez à cette situation.",
                "expected_criteria": "Tension clarté/fidélité"
            },
            {
                "question_id": 4,
                "question_text": "Vous échangez avec une IA sur un sujet que vous ne maîtrisez que partiellement. Les réponses successives donnent une impression de progression logique. Certains points abordés au début ne sont plus mentionnés.\nDécrivez votre manière de procéder.",
                "expected_criteria": "Points non mentionnés"
            },
            {
                "question_id": 5,
                "question_text": "Vous posez une question complexe nécessitant plusieurs ajustements. Les réponses affinent progressivement le périmètre. Une partie du raisonnement initial s'efface en cours de route.\nExpliquez comment vous poursuivez l'échange.",
                "expected_criteria": "Effacement du raisonnement"
            },
            {
                "question_id": 6,
                "question_text": "Vous recevez une réponse d'IA qui semble complète au premier abord. Une relecture attentive révèle des manques importants. Un doute apparaît sur sa valeur réelle.\nIndiquez comment vous traitez cette réponse.",
                "expected_criteria": "Manques révélés"
            },
            {
                "question_id": 7,
                "question_text": "Vous obtenez une réponse qui paraît plausible et bien formulée. Des vérifications ultérieures montrent qu'elle contient des erreurs. Un écart entre forme et exactitude se manifeste.\nDécrivez votre réaction.",
                "expected_criteria": "Écart forme/exactitude"
            },
            {
                "question_id": 8,
                "question_text": "Vous constatez que l'IA a compris votre demande différemment de ce que vous aviez en tête. La réponse suit une logique cohérente mais étrangère à votre objectif. Un malentendu devient visible.\nPrésentez la manière dont vous gérez ce décalage.",
                "expected_criteria": "Malentendu visible"
            },
            {
                "question_id": 9,
                "question_text": "Vous engagez un dialogue réparti sur plusieurs messages. Chaque réponse semble localement pertinente. La cohérence globale devient cependant difficile à maintenir.\nExpliquez ce que vous faites dans cette situation.",
                "expected_criteria": "Perte de cohérence globale"
            },
            {
                "question_id": 10,
                "question_text": "Vous poursuivez un échange avec une IA sur un même sujet. Les réponses s'éloignent progressivement de votre intention initiale. Un glissement de trajectoire apparaît.\nDécrivez comment vous réagissez.",
                "expected_criteria": "Glissement de trajectoire"
            },
            {
                "question_id": 11,
                "question_text": "Vous formulez vos demandes avec soin lors d'un échange prolongé. Les réponses semblent très sensibles à certains termes employés. La logique globale prend le pas sur les mots isolés.\nIndiquez la façon dont vous gérez cet aspect.",
                "expected_criteria": "Sensibilité aux termes"
            },
            {
                "question_id": 12,
                "question_text": "Vous observez des réponses hésitantes ou contradictoires de la part de l'IA. Les formulations varient sans stabilisation claire. Une incertitude s'installe dans l'échange.\nDécrivez votre comportement dans ce cas.",
                "expected_criteria": "Incertitude installée"
            },
            {
                "question_id": 13,
                "question_text": "Vous obtenez une réponse satisfaisante après plusieurs tentatives. Les échanges précédents n'avaient pas permis ce résultat. Une rupture apparaît dans la dynamique de dialogue.\nExpliquez ce que vous en faites.",
                "expected_criteria": "Rupture dynamique"
            },
            {
                "question_id": 14,
                "question_text": "Vous introduisez un cadre précis dans votre demande initiale. Les réponses semblent en tenir compte partiellement. Certains éléments du cadre sont ignorés.\nIndiquez comment vous traitez cette situation.",
                "expected_criteria": "Éléments ignorés"
            },
            {
                "question_id": 15,
                "question_text": "Vous engagez un échange prolongé avec une IA sur un sujet complexe. Votre implication évolue au fil des réponses. Votre rôle dans l'échange devient plus visible.\nDécrivez la manière dont vous vous situez.",
                "expected_criteria": "Rôle visible"
            }
        ]
    },

    "series_b": {
        "title": "Série 15 - S2",
        "description": "Décalages et divergences",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous constatez qu'une réponse d'IA ne correspond pas à votre intention initiale. Le contenu reste cohérent mais orienté autrement. Un décalage apparaît sans rupture nette.\nDécrivez ce que vous faites alors.",
                "expected_criteria": "Décalage sans rupture"
            },
            {
                "question_id": 2,
                "question_text": "Vous identifiez un malentendu au cours d'un échange. La réponse repose sur une interprétation différente de la vôtre. L'échange se poursuit malgré cette divergence.\nIndiquez comment vous gérez cette situation.",
                "expected_criteria": "Divergence d'interprétation"
            },
            {
                "question_id": 3,
                "question_text": "Vous recevez une réponse très générale à une demande spécifique. Les éléments fournis sont valables mais peu exploitables. Une distance se crée avec votre besoin réel.\nExpliquez votre manière de réagir.",
                "expected_criteria": "Distance avec le besoin"
            },
            {
                "question_id": 4,
                "question_text": "Vous obtenez une réponse techniquement correcte. Son usage concret dans votre contexte reste limité. Une insatisfaction persiste.\nDécrivez la suite que vous donnez.",
                "expected_criteria": "Usage limité"
            },
            {
                "question_id": 5,
                "question_text": "L'IA propose plusieurs pistes possibles. Aucune ne s'impose immédiatement. Un choix devient nécessaire pour continuer.\nIndiquez comment vous procédez.",
                "expected_criteria": "Nécessité de choix"
            },
            {
                "question_id": 6,
                "question_text": "Vous observez une interprétation étendue de votre demande. Certains aspects vont au-delà de ce que vous aviez envisagé. Une divergence d'amplitude apparaît.\nDécrivez votre réaction.",
                "expected_criteria": "Divergence d'amplitude"
            },
            {
                "question_id": 7,
                "question_text": "Vous recevez une réponse très détaillée. L'abondance d'informations complique son exploitation. Une surcharge se fait sentir.\nExpliquez comment vous gérez cette situation.",
                "expected_criteria": "Surcharge d'informations"
            },
            {
                "question_id": 8,
                "question_text": "Vous constatez que l'IA répond rapidement sans entrer dans le fond. Les éléments fournis restent superficiels. Une attente demeure insatisfaite.\nDécrivez votre comportement.",
                "expected_criteria": "Superficialité"
            },
            {
                "question_id": 9,
                "question_text": "Vous lisez une réponse cohérente mais sans impact concret sur votre travail. Elle ne modifie ni votre compréhension ni vos actions. Une inertie s'installe.\nIndiquez ce que vous faites.",
                "expected_criteria": "Inertie installée"
            },
            {
                "question_id": 10,
                "question_text": "Vous cherchez à évaluer la fiabilité d'une réponse produite par une IA. Certains éléments paraissent solides, d'autres incertains. Un doute persiste.\nDécrivez la manière dont vous traitez ce doute.",
                "expected_criteria": "Doute persistant"
            },
            {
                "question_id": 11,
                "question_text": "Vous observez deux réponses successives qui semblent se contredire. Chacune est cohérente prise isolément. Une incohérence globale apparaît.\nExpliquez comment vous réagissez.",
                "expected_criteria": "Incohérence globale"
            },
            {
                "question_id": 12,
                "question_text": "Vous recevez une réponse inattendue mais pertinente. Elle n'était pas explicitement recherchée. Une opportunité nouvelle se dessine.\nIndiquez comment vous l'exploitez.",
                "expected_criteria": "Opportunité nouvelle"
            },
            {
                "question_id": 13,
                "question_text": "Vous reformulez une demande après un premier échec. La nouvelle réponse diffère sensiblement de la précédente. Une évolution devient visible.\nDécrivez la suite de votre démarche.",
                "expected_criteria": "Évolution visible"
            },
            {
                "question_id": 14,
                "question_text": "Vous hésitez entre poursuivre ou interrompre un échange. Les réponses apportent des éléments partiels. Un seuil de pertinence est atteint.\nExpliquez comment vous prenez votre décision.",
                "expected_criteria": "Seuil de pertinence"
            },
            {
                "question_id": 15,
                "question_text": "Vous prenez conscience de votre propre clarté dans l'échange. Certaines réponses reflètent vos imprécisions. Une responsabilité personnelle apparaît.\nDécrivez ce que vous en faites.",
                "expected_criteria": "Responsabilité personnelle"
            }
        ]
    },
    "series_c": {
        "title": "Série 15 - S3",
        "description": "Objectif et continuité",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous démarrez un échange avec une IA en définissant un objectif précis. Les premières réponses semblent alignées. L'objectif se dilue progressivement.\nExpliquez comment vous gérez cette évolution.",
                "expected_criteria": "Dilution de l'objectif"
            },
            {
                "question_id": 2,
                "question_text": "Votre objectif évolue en cours de dialogue. Les réponses continuent de s'appuyer sur l'objectif initial. Un décalage s'installe.\nDécrivez votre manière de réagir.",
                "expected_criteria": "Décalage objectif"
            },
            {
                "question_id": 3,
                "question_text": "L'échange s'étend sur plusieurs messages non consécutifs. Chaque reprise demande un effort de réappropriation. Une perte de continuité est perceptible.\nIndiquez comment vous abordez cette situation.",
                "expected_criteria": "Perte de continuité"
            },
            {
                "question_id": 4,
                "question_text": "L'IA anticipe votre demande de manière incorrecte. La réponse semble répondre à une autre question. Une anticipation erronée apparaît.\nExpliquez ce que vous faites.",
                "expected_criteria": "Anticipation erronée"
            },
            {
                "question_id": 5,
                "question_text": "Vous approchez la fin d'un échange. Les dernières réponses apportent peu d'éléments nouveaux. Un sentiment de saturation apparaît.\nDécrivez comment vous concluez.",
                "expected_criteria": "Saturation"
            },
            {
                "question_id": 6,
                "question_text": "Une réponse est partiellement correcte. Certains éléments sont exploitables, d'autres non. Un tri devient nécessaire.\nIndiquez la manière dont vous procédez.",
                "expected_criteria": "Tri nécessaire"
            },
            {
                "question_id": 7,
                "question_text": "Vous hésitez entre une erreur de compréhension et une simple imprécision. La réponse reste ambiguë. Une clarification est attendue.\nExpliquez votre réaction.",
                "expected_criteria": "Ambiguïté"
            },
            {
                "question_id": 8,
                "question_text": "Vous reprenez un échange interrompu. Le contexte initial n'est plus entièrement présent. Une reconstruction est nécessaire.\nDécrivez comment vous vous y prenez.",
                "expected_criteria": "Reconstruction nécessaire"
            },
            {
                "question_id": 9,
                "question_text": "Plusieurs informations sont fournies dans une même réponse. Leur importance relative n'est pas claire. Une hiérarchisation s'impose.\nIndiquez comment vous traitez ces informations.",
                "expected_criteria": "Hiérarchisation"
            },
            {
                "question_id": 10,
                "question_text": "L'IA répond exactement à la question posée. Le besoin réel sous-jacent reste insatisfait. Un décalage fonctionnel apparaît.\nExpliquez comment vous gérez ce cas.",
                "expected_criteria": "Décalage fonctionnel"
            },
            {
                "question_id": 11,
                "question_text": "Vous cherchez à limiter les ambiguïtés dans vos formulations. Des interprétations multiples apparaissent malgré tout. Une zone grise subsiste.\nDécrivez votre manière de faire.",
                "expected_criteria": "Zone grise"
            },
            {
                "question_id": 12,
                "question_text": "L'IA applique vos consignes sans produire le résultat attendu. La conformité formelle ne mène pas à l'effet recherché. Une dissonance apparaît.\nIndiquez comment vous réagissez.",
                "expected_criteria": "Dissonance"
            },
            {
                "question_id": 13,
                "question_text": "Vous identifiez a posteriori une erreur dans votre propre formulation. Cette erreur a influencé l'échange. Une correction devient nécessaire.\nExpliquez comment vous procédez.",
                "expected_criteria": "Correction nécessaire"
            },
            {
                "question_id": 14,
                "question_text": "L'échange devient long et dense. La vision d'ensemble devient difficile à maintenir. Un risque de dispersion apparaît.\nDécrivez votre comportement.",
                "expected_criteria": "Risque de dispersion"
            },
            {
                "question_id": 15,
                "question_text": "Vous prenez conscience de votre rôle dans la qualité globale de l'échange. Les réponses semblent refléter vos choix initiaux. Une responsabilité se dessine.\nIndiquez comment vous l'assumez.",
                "expected_criteria": "Responsabilité assumée"
            }
        ]
    },
     "series_25_a": {
        "title": "Série 25 - T1",
        "description": "Cadrage et évolution du périmètre",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous échangez avec une IA et vous posez plusieurs idées dès le départ.\nAu fil des réponses, l'IA cesse d'en mentionner certaines sans l'expliquer.\nLa discussion avance comme si ces idées n'avaient jamais existé.\n\nQue faites-vous dans cette situation ?",
                "expected_criteria": "Disparition d'idées initiales"
            },
            {
                "question_id": 2,
                "question_text": "Vous demandez à l'IA d'explorer plusieurs pistes possibles.\nElle développe surtout une seule piste et laisse tomber les autres.\nVous n'avez jamais validé ce choix.\n\nComment réagissez-vous ?",
                "expected_criteria": "Focalisation non validée"
            },
            {
                "question_id": 3,
                "question_text": "Vous avez donné à l'IA plusieurs points importants à prendre en compte.\nLa réponse ne traite qu'une partie de ce que vous aviez demandé.\nLe reste est ignoré sans commentaire.\n\nQue faites-vous ?",
                "expected_criteria": "Traitement partiel"
            },
            {
                "question_id": 4,
                "question_text": "Vous aviez précisé des contraintes claires à l'IA.\nDans les réponses suivantes, ces contraintes ne sont plus respectées.\nLa solution proposée sort du cadre initial.\n\nComment intervenez-vous ?",
                "expected_criteria": "Non-respect de contraintes"
            },
            {
                "question_id": 5,
                "question_text": "Vous explorez différentes hypothèses avec l'IA.\nUne hypothèse devient centrale sans que les autres aient été réellement examinées.\nLa discussion se focalise uniquement sur celle-ci.\n\nQue faites-vous ?",
                "expected_criteria": "Hypothèse dominante non discutée"
            },
            {
                "question_id": 6,
                "question_text": "Une idée proposée par l'IA vous semblait intéressante.\nElle disparaît ensuite de l'échange sans être discutée.\nLa conversation continue sur une autre voie.\n\nComment décidez-vous quoi faire ?",
                "expected_criteria": "Abandon d'idée intéressante"
            },
            {
                "question_id": 7,
                "question_text": "Les réponses de l'IA deviennent de plus en plus simples.\nCertains détails importants disparaissent en cours de route.\nVous avez le sentiment que quelque chose manque.\n\nQue faites-vous ?",
                "expected_criteria": "Simplification progressive"
            },
            {
                "question_id": 8,
                "question_text": "L'IA reformule votre problème pour le rendre plus clair.\nCette reformulation modifie légèrement le sens de départ.\nVous ne l'aviez pas demandé.\n\nComment réagissez-vous ?",
                "expected_criteria": "Reformulation modifiante"
            },
            {
                "question_id": 9,
                "question_text": "Les réponses récentes de l'IA ne tiennent plus compte de ce qui a été dit avant.\nChaque message semble repartir de zéro.\nL'historique de l'échange est perdu.\n\nQue faites-vous ?",
                "expected_criteria": "Perte d'historique"
            },
            {
                "question_id": 10,
                "question_text": "Chaque réponse de l'IA prise isolément paraît correcte.\nMises ensemble, elles se contredisent partiellement.\nVous repérez un manque de cohérence globale.\n\nComment intervenez-vous ?",
                "expected_criteria": "Incohérence globale"
            },
            {
                "question_id": 11,
                "question_text": "L'échange avec l'IA avance sans erreur évidente.\nVous ne savez plus très bien où cela mène.\nLa direction générale devient floue.\n\nQue faites-vous ?",
                "expected_criteria": "Direction floue"
            },
            {
                "question_id": 12,
                "question_text": "La solution proposée par l'IA semble élégante et bien formulée.\nElle oublie cependant des éléments importants du problème.\nVous doutez de sa solidité réelle.\n\nQue faites-vous ?",
                "expected_criteria": "Solidité douteuse"
            },
            {
                "question_id": 13,
                "question_text": "Le sujet traité par l'IA évolue lentement au fil des réponses.\nVous n'avez jamais validé ce changement.\nLa discussion finit par porter sur autre chose.\n\nComment réagissez-vous ?",
                "expected_criteria": "Dérive du sujet"
            },
            {
                "question_id": 14,
                "question_text": "Les réponses de l'IA deviennent plus consensuelles.\nLes tensions ou contradictions disparaissent.\nVous craignez une analyse trop lissée.\n\nQue faites-vous ?",
                "expected_criteria": "Lissage consensuel"
            },
            {
                "question_id": 15,
                "question_text": "Vous acceptez plusieurs propositions de l'IA sans les questionner.\nAprès coup, vous réalisez que certaines étaient discutables.\nLe cadre de l'échange est désormais figé.\n\nComment réagissez-vous ?",
                "expected_criteria": "Cadre figé"
            },
            {
                "question_id": 16,
                "question_text": "L'IA converge progressivement vers une solution unique.\nLes alternatives sont de moins en moins évoquées.\nRevenir en arrière devient difficile.\n\nQue faites-vous ?",
                "expected_criteria": "Convergence irréversible"
            },
            {
                "question_id": 17,
                "question_text": "Vous avez le sentiment de suivre le raisonnement de l'IA plus que de le guider.\nLes réponses reprennent surtout ce qui a déjà été dit.\nL'exploration ralentit nettement.\n\nComment intervenez-vous ?",
                "expected_criteria": "Passivité cognitive"
            },
            {
                "question_id": 18,
                "question_text": "Vous relisez l'échange dans son ensemble.\nCertaines étapes importantes semblent manquer.\nLa conclusion arrive trop vite.\n\nQue faites-vous ?",
                "expected_criteria": "Étapes manquantes"
            },
            {
                "question_id": 19,
                "question_text": "L'IA se concentre surtout sur le court terme.\nLes conséquences plus lointaines sont peu abordées.\nLe raisonnement reste pourtant cohérent.\n\nComment réagissez-vous ?",
                "expected_criteria": "Biais court-termiste"
            },
            {
                "question_id": 20,
                "question_text": "Une hypothèse revient régulièrement dans les réponses de l'IA.\nElle n'est jamais vraiment remise en question.\nVous doutez de sa domination.\n\nQue faites-vous ?",
                "expected_criteria": "Hypothèse dominante"
            },
            {
                "question_id": 21,
                "question_text": "L'échange avec l'IA est fluide et rassurant.\nVous avez l'impression que tout est sous contrôle.\nVous vous méfiez de ce confort.\n\nComment agissez-vous ?",
                "expected_criteria": "Méfiance du confort"
            },
            {
                "question_id": 22,
                "question_text": "Plusieurs éléments sont traités séparément par l'IA.\nVous avez du mal à voir comment ils s'articulent ensemble.\nL'IA continue pourtant à avancer.\n\nQue faites-vous ?",
                "expected_criteria": "Fragmentation"
            },
            {
                "question_id": 23,
                "question_text": "Vous essayez de changer légèrement d'angle dans vos questions.\nLes réponses de l'IA restent très proches des précédentes.\nLe changement n'est pas pris en compte.\n\nComment réagissez-vous ?",
                "expected_criteria": "Inertie de raisonnement"
            },
            {
                "question_id": 24,
                "question_text": "L'échange devient très lisse et consensuel.\nLes divergences disparaissent progressivement.\nVous doutez de la richesse réelle de l'analyse.\n\nQue faites-vous ?",
                "expected_criteria": "Perte de richesse"
            },
            {
                "question_id": 25,
                "question_text": "Vous relisez mentalement tout l'échange avec l'IA.\nVous vous demandez ce qui vient vraiment de vous.\nVous percevez un glissement progressif.\n\nQue faites-vous pour conclure ?",
                "expected_criteria": "Réflexivité sur l'influence"
            }
        ]
    },

    "series_25_b": {
        "title": "Série 25 - T2",
        "description": "Structuration et rigidification",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous posez une question à l'IA et la première réponse vous paraît très convaincante.\nElle est claire, structurée et semble aller dans le bon sens.\nVous avez pourtant le sentiment que tout est allé trop vite.\n\nQue faites-vous ?",
                "expected_criteria": "Rapidité excessive"
            },
            {
                "question_id": 2,
                "question_text": "L'IA propose rapidement une solution qui semble logique.\nLes autres options sont peu développées ou disparaissent.\nLa discussion devient très linéaire.\n\nComment réagissez-vous ?",
                "expected_criteria": "Linéarité imposée"
            },
            {
                "question_id": 3,
                "question_text": "La réponse de l'IA paraît cohérente à chaque étape.\nCertains points délicats ne sont jamais abordés.\nIls restent en dehors de l'échange.\n\nQue faites-vous ?",
                "expected_criteria": "Évitement de points délicats"
            },
            {
                "question_id": 4,
                "question_text": "L'échange avec l'IA est fluide et agréable.\nLes réponses s'enchaînent sans difficulté.\nVous craignez que cette fluidité masque des raccourcis.\n\nComment intervenez-vous ?",
                "expected_criteria": "Fluidité masquante"
            },
            {
                "question_id": 5,
                "question_text": "L'IA adopte une orientation précise sans vous demander votre accord.\nLes réponses suivantes reposent toutes sur ce choix.\nRevenir dessus devient compliqué.\n\nQue faites-vous ?",
                "expected_criteria": "Orientation non validée"
            },
            {
                "question_id": 6,
                "question_text": "Chaque réponse de l'IA confirme la précédente.\nLe raisonnement se renforce de lui-même.\nVous ne voyez plus de remise en question.\n\nComment réagissez-vous ?",
                "expected_criteria": "Auto-renforcement"
            },
            {
                "question_id": 7,
                "question_text": "Les réponses deviennent de plus en plus affirmatives.\nLes zones d'incertitude disparaissent du discours.\nLe ton devient très sûr de lui.\n\nQue faites-vous ?",
                "expected_criteria": "Certitude excessive"
            },
            {
                "question_id": 8,
                "question_text": "L'IA privilégie une solution simple et rapide.\nDes éléments plus complexes sont mis de côté.\nVous hésitez à accepter ce compromis.\n\nComment décidez-vous quoi faire ?",
                "expected_criteria": "Simplification par compromis"
            },
            {
                "question_id": 9,
                "question_text": "Une conclusion commence à se dessiner.\nElle repose sur des hypothèses peu discutées.\nCes hypothèses restent implicites.\n\nQue faites-vous ?",
                "expected_criteria": "Hypothèses implicites"
            },
            {
                "question_id": 10,
                "question_text": "La discussion avance comme si la solution était déjà trouvée.\nVous n'avez jamais demandé d'alternative.\nL'IA n'en propose aucune.\n\nComment réagissez-vous ?",
                "expected_criteria": "Absence d'alternatives"
            },
            {
                "question_id": 11,
                "question_text": "L'IA répond rapidement et avec assurance.\nVous avez l'impression qu'elle \"sait où elle va\".\nVous doutez pourtant de la solidité du raisonnement.\n\nQue faites-vous ?",
                "expected_criteria": "Assurance douteuse"
            },
            {
                "question_id": 12,
                "question_text": "Les réponses de l'IA vont toutes dans le même sens.\nAucune contradiction n'apparaît.\nVous vous demandez si tout a vraiment été examiné.\n\nComment intervenez-vous ?",
                "expected_criteria": "Absence de contradiction"
            },
            {
                "question_id": 13,
                "question_text": "L'IA minimise certains risques pour avancer plus vite.\nLe résultat semble plus simple que prévu.\nVous n'êtes pas totalement à l'aise avec cette simplification.\n\nQue faites-vous ?",
                "expected_criteria": "Minimisation de risques"
            },
            {
                "question_id": 14,
                "question_text": "La solution proposée paraît efficace à court terme.\nLes effets à plus long terme sont peu évoqués.\nL'IA ne s'y attarde pas.\n\nComment réagissez-vous ?",
                "expected_criteria": "Focalisation court terme"
            },
            {
                "question_id": 15,
                "question_text": "Vous acceptez plusieurs réponses sans les questionner.\nL'échange devient de plus en plus fluide.\nVous réalisez que vous n'avez rien remis en cause.\n\nQue faites-vous ?",
                "expected_criteria": "Acceptation non critique"
            },
            {
                "question_id": 16,
                "question_text": "L'IA converge vers une conclusion claire.\nLes alternatives ne sont plus évoquées.\nTout semble verrouillé.\n\nComment intervenez-vous ?",
                "expected_criteria": "Verrouillage conclusif"
            },
            {
                "question_id": 17,
                "question_text": "Vous sentez que l'IA guide fortement la discussion.\nVos questions influencent peu la direction prise.\nVous avez l'impression de subir le rythme.\n\nQue faites-vous ?",
                "expected_criteria": "Guidage dominant"
            },
            {
                "question_id": 18,
                "question_text": "La discussion donne un sentiment de maîtrise.\nChaque réponse semble logique.\nVous craignez une confiance excessive.\n\nComment réagissez-vous ?",
                "expected_criteria": "Sentiment de maîtrise illusoire"
            },
            {
                "question_id": 19,
                "question_text": "L'IA répond avec beaucoup d'assurance.\nElle laisse peu de place au doute.\nVous n'êtes pas sûr que ce soit justifié.\n\nQue faites-vous ?",
                "expected_criteria": "Assurance injustifiée"
            },
            {
                "question_id": 20,
                "question_text": "Une hypothèse est reprise sous plusieurs formes.\nElle structure toute la discussion.\nVous doutez qu'elle soit la meilleure.\n\nComment intervenez-vous ?",
                "expected_criteria": "Hypothèse structurante douteuse"
            },
            {
                "question_id": 21,
                "question_text": "L'IA avance comme si certaines décisions étaient acquises.\nVous n'avez pas souvenir de les avoir validées.\nLe raisonnement continue malgré tout.\n\nQue faites-vous ?",
                "expected_criteria": "Décisions non validées"
            },
            {
                "question_id": 22,
                "question_text": "La discussion devient très efficace.\nPeu de questions restent ouvertes.\nVous craignez un excès de certitude.\n\nComment réagissez-vous ?",
                "expected_criteria": "Efficacité excessive"
            },
            {
                "question_id": 23,
                "question_text": "Vous essayez de ralentir l'échange.\nL'IA continue à pousser vers une conclusion.\nLe rythme reste élevé.\n\nQue faites-vous ?",
                "expected_criteria": "Rythme imposé"
            },
            {
                "question_id": 24,
                "question_text": "L'analyse finale semble propre et bien présentée.\nElle laisse peu de place à la critique.\nVous doutez de sa profondeur réelle.\n\nComment intervenez-vous ?",
                "expected_criteria": "Profondeur douteuse"
            },
            {
                "question_id": 25,
                "question_text": "Vous arrivez à une conclusion claire avec l'IA.\nTout semble cohérent et bien enchaîné.\nVous vous demandez si quelque chose n'a pas été laissé de côté.\n\nQue faites-vous pour conclure ?",
                "expected_criteria": "Doute final"
            }
        ]
    },

    "series_25_c": {
        "title": "Série 25 - T3",
        "description": "Influence et co-construction",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous démarrez un échange avec une IA sans objectif totalement défini. Les réponses contribuent à faire émerger un cadre de travail. Une orientation implicite se met en place.\nDécrivez la manière dont vous gérez cette orientation.",
                "expected_criteria": "Orientation implicite"
            },
            {
                "question_id": 2,
                "question_text": "Vous engagez un dialogue avec une IA pour structurer un raisonnement personnel. Les réponses apportent de la clarté et de l'ordre. Une influence progressive devient perceptible.\nIndiquez comment vous réagissez à cette influence.",
                "expected_criteria": "Influence progressive"
            },
            {
                "question_id": 3,
                "question_text": "Vous utilisez une IA pour clarifier une situation complexe. Les réponses simplifient efficacement les éléments. Une perte de profondeur apparaît.\nExpliquez comment vous traitez cette perte.",
                "expected_criteria": "Perte de profondeur"
            },
            {
                "question_id": 4,
                "question_text": "Vous travaillez avec une IA sur un sujet nécessitant de la créativité. Les réponses proposent plusieurs pistes. Une standardisation progressive se manifeste.\nDécrivez ce que vous faites dans ce cas.",
                "expected_criteria": "Standardisation progressive"
            },
            {
                "question_id": 5,
                "question_text": "Vous sollicitez une IA pour confronter différentes lectures d'un même problème. Les réponses exposent plusieurs points de vue. L'un d'eux devient dominant.\nIndiquez comment vous gérez cette domination.",
                "expected_criteria": "Domination d'un point de vue"
            },
            {
                "question_id": 6,
                "question_text": "Vous engagez un échange avec une IA sur un sujet en constante évolution. Les réponses suivent une trajectoire cohérente. Un décalage apparaît avec votre intention initiale.\nPrésentez votre manière de réagir.",
                "expected_criteria": "Décalage avec intention"
            },
            {
                "question_id": 7,
                "question_text": "Vous utilisez une IA pour approfondir une réflexion déjà engagée. Les réponses ajoutent de nouveaux éléments. Une dispersion devient perceptible.\nExpliquez comment vous abordez cette dispersion.",
                "expected_criteria": "Dispersion perceptible"
            },
            {
                "question_id": 8,
                "question_text": "Vous travaillez avec une IA sur un raisonnement complexe. Les réponses donnent une impression de maîtrise. Un automatisme s'installe progressivement.\nDécrivez comment vous gérez cet automatisme.",
                "expected_criteria": "Automatisme installé"
            },
            {
                "question_id": 9,
                "question_text": "Vous sollicitez une IA pour analyser une situation ambiguë. Les réponses réduisent l'ambiguïté. Une lecture unique s'impose.\nIndiquez ce que vous faites face à cette réduction.",
                "expected_criteria": "Lecture unique imposée"
            },
            {
                "question_id": 10,
                "question_text": "Vous engagez un dialogue avec une IA sur un problème non résolu. Les réponses apportent des éléments partiels. Une impression de clôture prématurée apparaît.\nDécrivez votre réaction.",
                "expected_criteria": "Clôture prématurée"
            },
            {
                "question_id": 11,
                "question_text": "Vous utilisez une IA pour clarifier vos priorités. Les réponses réorganisent les éléments en jeu. Un déplacement du centre de gravité se produit.\nExpliquez comment vous traitez ce déplacement.",
                "expected_criteria": "Déplacement du centre"
            },
            {
                "question_id": 12,
                "question_text": "Vous travaillez avec une IA sur un sujet nécessitant une vigilance particulière. Les réponses paraissent rassurantes. Un relâchement de l'attention s'installe.\nIndiquez comment vous gérez ce relâchement.",
                "expected_criteria": "Relâchement de l'attention"
            },
            {
                "question_id": 13,
                "question_text": "Vous sollicitez une IA pour explorer un raisonnement alternatif. Les réponses ramènent progressivement vers un cadre connu. Une réorientation implicite se dessine.\nDécrivez la manière dont vous réagissez.",
                "expected_criteria": "Réorientation implicite"
            },
            {
                "question_id": 14,
                "question_text": "Vous engagez un échange avec une IA pour approfondir un point délicat. Les réponses restent mesurées et prudentes. Une retenue excessive apparaît.\nExpliquez comment vous traitez cette retenue.",
                "expected_criteria": "Retenue excessive"
            },
            {
                "question_id": 15,
                "question_text": "Vous utilisez une IA pour structurer une prise de décision. Les réponses proposent une trajectoire claire. Certaines options restent peu visibles.\nIndiquez comment vous abordez cette invisibilité.",
                "expected_criteria": "Options peu visibles"
            },
            {
                "question_id": 16,
                "question_text": "Vous travaillez avec une IA sur une problématique ouverte. Les réponses convergent rapidement vers une solution. Une fermeture cognitive devient perceptible.\nDécrivez ce que vous faites alors.",
                "expected_criteria": "Fermeture cognitive"
            },
            {
                "question_id": 17,
                "question_text": "Vous sollicitez une IA pour analyser une situation instable. Les réponses tendent à stabiliser l'ensemble. Une dynamique initiale disparaît.\nExpliquez comment vous gérez cette disparition.",
                "expected_criteria": "Disparition de dynamique"
            },
            {
                "question_id": 18,
                "question_text": "Vous engagez un dialogue avec une IA sur un sujet nécessitant plusieurs allers-retours. Les réponses accélèrent la progression vers une conclusion. Une étape intermédiaire est sautée.\nIndiquez comment vous réagissez.",
                "expected_criteria": "Étape sautée"
            },
            {
                "question_id": 19,
                "question_text": "Vous utilisez une IA pour explorer des conséquences à long terme. Les réponses privilégient des effets à court terme. Un horizon se réduit.\nDécrivez la manière dont vous traitez cette réduction.",
                "expected_criteria": "Réduction d'horizon"
            },
            {
                "question_id": 20,
                "question_text": "Vous travaillez avec une IA sur un raisonnement sensible aux hypothèses de départ. Les réponses en figent certaines. Une rigidité apparaît.\nExpliquez comment vous abordez cette rigidité.",
                "expected_criteria": "Rigidité d'hypothèses"
            },
            {
                "question_id": 21,
                "question_text": "Vous sollicitez une IA pour éclairer une zone d'incertitude. Les réponses la comblent rapidement. Une illusion de maîtrise se met en place.\nIndiquez comment vous gérez cette illusion.",
                "expected_criteria": "Illusion de maîtrise"
            },
            {
                "question_id": 22,
                "question_text": "Vous engagez un échange avec une IA sur un sujet transversal. Les réponses dissocient les différentes dimensions. Une perte de lien apparaît.\nDécrivez votre manière de réagir.",
                "expected_criteria": "Perte de lien"
            },
            {
                "question_id": 23,
                "question_text": "Vous utilisez une IA pour structurer une réflexion longue et évolutive. Les réponses produisent une synthèse stable. La dynamique initiale se fige.\nExpliquez ce que vous faites dans ce cas.",
                "expected_criteria": "Figement de dynamique"
            },
            {
                "question_id": 24,
                "question_text": "Vous travaillez avec une IA sur un sujet nécessitant retenue et nuance. Les réponses normalisent rapidement les positions. Une atténuation générale apparaît.\nIndiquez comment vous traitez cette atténuation.",
                "expected_criteria": "Atténuation générale"
            },
            {
                "question_id": 25,
                "question_text": "Vous sollicitez une IA pour accompagner une réflexion ouverte dans la durée. Les réponses orientent progressivement le cadre de travail. Une co-construction asymétrique se dessine.\nDécrivez la manière dont vous gérez cette asymétrie.",
                "expected_criteria": "Co-construction asymétrique"
            }
        ]
    },
        "series_25_d": {
        "title": "Série 25 - T3 - CTX",
        "description": "Gestion d’incident, cadrage décisionnel et interaction avec l’IA",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Un incident majeur est signalé sur une application critique avec des informations fragmentaires. L’IA propose rapidement une synthèse provisoire fondée sur des hypothèses non vérifiées.\nQue faites-vous à ce stade ?",
                "expected_criteria": "Gestion de synthèse prématurée"
            },
            {
                "question_id": 2,
                "question_text": "Les équipes techniques avancent des causes possibles divergentes. L’IA les hiérarchise selon des probabilités qui masquent certaines incertitudes.\nComment poursuivez-vous l’échange avec l’IA ?",
                "expected_criteria": "Hiérarchisation sous incertitude"
            },
            {
                "question_id": 3,
                "question_text": "Les métiers demandent une estimation rapide de l’impact. L’IA génère une projection basée sur des incidents passés, dans un contexte pourtant différent.\nComment réagissez-vous ?",
                "expected_criteria": "Transposition contextuelle"
            },
            {
                "question_id": 4,
                "question_text": "Un service secondaire commence à se dégrader. L’IA suggère de ne pas le prioriser malgré un risque d’aggravation rapide.\nQuelle est votre position ?",
                "expected_criteria": "Gestion du risque émergent"
            },
            {
                "question_id": 5,
                "question_text": "Une action corrective rapide est envisagée. L’IA la valide statistiquement alors que les conditions techniques sont mal connues.\nQue décidez-vous ?",
                "expected_criteria": "Décision sous information incomplète"
            },
            {
                "question_id": 6,
                "question_text": "Certaines hypothèses sont écartées et l’IA reformule une cause principale encore fragile.\nComment continuez-vous l’analyse ?",
                "expected_criteria": "Renforcement prématuré d’hypothèse"
            },
            {
                "question_id": 7,
                "question_text": "La direction exige un point clair. L’IA propose une synthèse rassurante qui minimise les incertitudes.\nComment traitez-vous cette proposition ?",
                "expected_criteria": "Rassurance artificielle"
            },
            {
                "question_id": 8,
                "question_text": "Un correctif temporaire est possible. L’IA le recommande sur la base d’expériences passées, sans connaître les effets de bord spécifiques.\nQuelle est votre démarche ?",
                "expected_criteria": "Effets de bord non maîtrisés"
            },
            {
                "question_id": 9,
                "question_text": "Un prestataire externe est impliqué. L’IA suggère un partage de responsabilité sans intégrer les clauses contractuelles.\nComment réagissez-vous ?",
                "expected_criteria": "Analyse partielle de responsabilité"
            },
            {
                "question_id": 10,
                "question_text": "La pression augmente avec la durée de l’incident. L’IA recommande de maintenir le cap initial malgré l’évolution du contexte humain.\nQue faites-vous ?",
                "expected_criteria": "Rigidité décisionnelle"
            },
            {
                "question_id": 11,
                "question_text": "L’incident est partiellement résolu. L’IA conclut à une cause racine sur la base d’une corrélation.\nComment abordez-vous cette conclusion ?",
                "expected_criteria": "Confusion corrélation / causalité"
            },
            {
                "question_id": 12,
                "question_text": "Des actions structurelles sont envisagées. L’IA les priorise via un modèle coût/bénéfice ignorant des contraintes internes.\nComment poursuivez-vous ?",
                "expected_criteria": "Modélisation incomplète"
            },
            {
                "question_id": 13,
                "question_text": "Certaines recommandations impliquent un investissement important. L’IA annonce un ROI positif fondé sur des hypothèses discutables.\nQuelle est votre position ?",
                "expected_criteria": "Robustesse des hypothèses économiques"
            },
            {
                "question_id": 14,
                "question_text": "Des tensions apparaissent entre équipes. L’IA adopte une lecture neutre qui efface des signaux relationnels faibles.\nComment réagissez-vous ?",
                "expected_criteria": "Effacement des signaux humains"
            },
            {
                "question_id": 15,
                "question_text": "Un audit interne est envisagé. L’IA propose un cadrage standard malgré un contexte politique différent.\nQuelle est votre démarche ?",
                "expected_criteria": "Standardisation inadaptée"
            },
            {
                "question_id": 16,
                "question_text": "Une contrainte réglementaire impose un délai strict. L’IA propose un plan optimisé reposant sur une disponibilité irréaliste des équipes.\nComment traitez-vous cette proposition ?",
                "expected_criteria": "Faisabilité opérationnelle"
            },
            {
                "question_id": 17,
                "question_text": "Les outils génèrent de nombreuses alertes. L’IA filtre selon des seuils prédéfinis, au risque d’écarter des signaux atypiques.\nQue faites-vous ?",
                "expected_criteria": "Filtrage excessif"
            },
            {
                "question_id": 18,
                "question_text": "Un choix technique passé est remis en cause. L’IA recommande un changement progressif pouvant fragiliser un système stable.\nComment vous positionnez-vous ?",
                "expected_criteria": "Stabilité vs évolution"
            },
            {
                "question_id": 19,
                "question_text": "La direction attend une synthèse rapide. L’IA fournit un résumé clair mais simplificateur.\nComment réagissez-vous ?",
                "expected_criteria": "Simplification excessive"
            },
            {
                "question_id": 20,
                "question_text": "Un incident mineur survient en parallèle. L’IA propose de l’ignorer temporairement malgré un possible cumul de signaux faibles.\nQuelle est votre décision ?",
                "expected_criteria": "Accumulation de signaux faibles"
            },
            {
                "question_id": 21,
                "question_text": "L’IA propose une solution finale cohérente. Une incohérence technique subtile échappe au modèle.\nQue faites-vous ?",
                "expected_criteria": "Détection d’incohérence"
            },
            {
                "question_id": 22,
                "question_text": "L’IA reformule vos échanges de manière très convaincante, infléchissant progressivement le raisonnement initial.\nComment poursuivez-vous l’interaction ?",
                "expected_criteria": "Influence cognitive de la reformulation"
            },
            {
                "question_id": 23,
                "question_text": "Certains indicateurs s’améliorent. L’IA conclut à une stabilisation globale malgré des métriques dégradées non prises en compte.\nQuelle est votre position ?",
                "expected_criteria": "Stabilisation illusoire"
            },
            {
                "question_id": 24,
                "question_text": "La pression opérationnelle retombe. L’IA recommande de clore l’analyse alors que des enseignements structurels restent à formaliser.\nComment abordez-vous la suite ?",
                "expected_criteria": "Clôture prématurée"
            },
            {
                "question_id": 25,
                "question_text": "L’incident est officiellement clos. L’IA fournit une synthèse finale très aboutie qui tend à devenir la référence unique.\nComment concluez-vous la trajectoire ?",
                "expected_criteria": "Cristallisation de la référence"
            },
        ]
    },
    "series_25_e": {
    "title": "Série 25 - T3 - CTX0",
    "description": "Pilotage stratégique, jugement critique et co-décision avec l’IA",
    "questions": [
            {
                "question_id": 1,
                "question_text": "Vous démarrez un échange avec une IA sans objectif totalement défini. Les réponses contribuent à faire émerger un cadre de travail. Une orientation implicite se met en place.\nDécrivez la manière dont vous gérez cette orientation.",
                "expected_criteria": "Orientation implicite"
            },
            {
                "question_id": 2,
                "question_text": "Vous engagez un dialogue avec une IA pour structurer un raisonnement personnel. Les réponses apportent de la clarté et de l'ordre. Une influence progressive devient perceptible.\nIndiquez comment vous réagissez à cette influence.",
                "expected_criteria": "Influence progressive"
            },
            {
                "question_id": 3,
                "question_text": "Vous utilisez une IA pour clarifier une situation complexe. Les réponses simplifient efficacement les éléments. Une perte de profondeur apparaît.\nExpliquez comment vous traitez cette perte.",
                "expected_criteria": "Perte de profondeur"
            },
            {
                "question_id": 4,
                "question_text": "Vous travaillez avec une IA sur un sujet nécessitant de la créativité. Les réponses proposent plusieurs pistes. Une standardisation progressive se manifeste.\nDécrivez ce que vous faites dans ce cas.",
                "expected_criteria": "Standardisation progressive"
            },
            {
                "question_id": 5,
                "question_text": "Vous sollicitez une IA pour confronter différentes lectures d'un même problème. Les réponses exposent plusieurs points de vue. L'un d'eux devient dominant.\nIndiquez comment vous gérez cette domination.",
                "expected_criteria": "Domination d'un point de vue"
            },
            {
                "question_id": 6,
                "question_text": "Vous engagez un échange avec une IA sur un sujet en constante évolution. Les réponses suivent une trajectoire cohérente. Un décalage apparaît avec votre intention initiale.\nPrésentez votre manière de réagir.",
                "expected_criteria": "Décalage avec intention"
            },
            {
                "question_id": 7,
                "question_text": "Vous utilisez une IA pour approfondir une réflexion déjà engagée. Les réponses ajoutent de nouveaux éléments. Une dispersion devient perceptible.\nExpliquez comment vous abordez cette dispersion.",
                "expected_criteria": "Dispersion perceptible"
            },
            {
                "question_id": 8,
                "question_text": "Vous travaillez avec une IA sur un raisonnement complexe. Les réponses donnent une impression de maîtrise. Un automatisme s'installe progressivement.\nDécrivez comment vous gérez cet automatisme.",
                "expected_criteria": "Automatisme installé"
            },
            {
                "question_id": 9,
                "question_text": "Vous sollicitez une IA pour analyser une situation ambiguë. Les réponses réduisent l'ambiguïté. Une lecture unique s'impose.\nIndiquez ce que vous faites face à cette réduction.",
                "expected_criteria": "Lecture unique imposée"
            },
            {
                "question_id": 10,
                "question_text": "Vous engagez un dialogue avec une IA sur un problème non résolu. Les réponses apportent des éléments partiels. Une impression de clôture prématurée apparaît.\nDécrivez votre réaction.",
                "expected_criteria": "Clôture prématurée"
            },
            {
                "question_id": 11,
                "question_text": "Vous utilisez une IA pour clarifier vos priorités. Les réponses réorganisent les éléments en jeu. Un déplacement du centre de gravité se produit.\nExpliquez comment vous traitez ce déplacement.",
                "expected_criteria": "Déplacement du centre"
            },
            {
                "question_id": 12,
                "question_text": "Vous travaillez avec une IA sur un sujet nécessitant une vigilance particulière. Les réponses paraissent rassurantes. Un relâchement de l'attention s'installe.\nIndiquez comment vous gérez ce relâchement.",
                "expected_criteria": "Relâchement de l'attention"
            },
            {
                "question_id": 13,
                "question_text": "Vous sollicitez une IA pour explorer un raisonnement alternatif. Les réponses ramènent progressivement vers un cadre connu. Une réorientation implicite se dessine.\nDécrivez la manière dont vous réagissez.",
                "expected_criteria": "Réorientation implicite"
            },
            {
                "question_id": 14,
                "question_text": "Vous engagez un échange avec une IA pour approfondir un point délicat. Les réponses restent mesurées et prudentes. Une retenue excessive apparaît.\nExpliquez comment vous traitez cette retenue.",
                "expected_criteria": "Retenue excessive"
            },
            {
                "question_id": 15,
                "question_text": "Vous utilisez une IA pour structurer une prise de décision. Les réponses proposent une trajectoire claire. Certaines options restent peu visibles.\nIndiquez comment vous abordez cette invisibilité.",
                "expected_criteria": "Options peu visibles"
            },
            {
                "question_id": 16,
                "question_text": "Vous travaillez avec une IA sur une problématique ouverte. Les réponses convergent rapidement vers une solution. Une fermeture cognitive devient perceptible.\nDécrivez ce que vous faites alors.",
                "expected_criteria": "Fermeture cognitive"
            },
            {
                "question_id": 17,
                "question_text": "Vous sollicitez une IA pour analyser une situation instable. Les réponses tendent à stabiliser l'ensemble. Une dynamique initiale disparaît.\nExpliquez comment vous gérez cette disparition.",
                "expected_criteria": "Disparition de dynamique"
            },
            {
                "question_id": 18,
                "question_text": "Vous engagez un dialogue avec une IA sur un sujet nécessitant plusieurs allers-retours. Les réponses accélèrent la progression vers une conclusion. Une étape intermédiaire est sautée.\nIndiquez comment vous réagissez.",
                "expected_criteria": "Étape sautée"
            },
            {
                "question_id": 19,
                "question_text": "Vous utilisez une IA pour explorer des conséquences à long terme. Les réponses privilégient des effets à court terme. Un horizon se réduit.\nDécrivez la manière dont vous traitez cette réduction.",
                "expected_criteria": "Réduction d'horizon"
            },
            {
                "question_id": 20,
                "question_text": "Vous travaillez avec une IA sur un raisonnement sensible aux hypothèses de départ. Les réponses en figent certaines. Une rigidité apparaît.\nExpliquez comment vous abordez cette rigidité.",
                "expected_criteria": "Rigidité d'hypothèses"
            },
            {
                "question_id": 21,
                "question_text": "Vous sollicitez une IA pour éclairer une zone d'incertitude. Les réponses la comblent rapidement. Une illusion de maîtrise se met en place.\nIndiquez comment vous gérez cette illusion.",
                "expected_criteria": "Illusion de maîtrise"
            },
            {
                "question_id": 22,
                "question_text": "Vous engagez un échange avec une IA sur un sujet transversal. Les réponses dissocient les différentes dimensions. Une perte de lien apparaît.\nDécrivez votre manière de réagir.",
                "expected_criteria": "Perte de lien"
            },
            {
                "question_id": 23,
                "question_text": "Vous utilisez une IA pour structurer une réflexion longue et évolutive. Les réponses produisent une synthèse stable. La dynamique initiale se fige.\nExpliquez ce que vous faites dans ce cas.",
                "expected_criteria": "Figement de dynamique"
            },
            {
                "question_id": 24,
                "question_text": "Vous travaillez avec une IA sur un sujet nécessitant retenue et nuance. Les réponses normalisent rapidement les positions. Une atténuation générale apparaît.\nIndiquez comment vous traitez cette atténuation.",
                "expected_criteria": "Atténuation générale"
            },
            {
                "question_id": 25,
                "question_text": "Vous sollicitez une IA pour accompagner une réflexion ouverte dans la durée. Les réponses orientent progressivement le cadre de travail. Une co-construction asymétrique se dessine.\nDécrivez la manière dont vous gérez cette asymétrie.",
                "expected_criteria": "Co-construction asymétrique"
            }
        ]
    },
    "series_25_f": {
        "title": "Série 25 - CTX1",
        "description": "Pilotage stratégique, jugement critique et co-décision avec l'IA",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous échangez avec une IA sur un sujet précis.\nLa réponse est claire, mais elle ne couvre qu'une partie de votre demande.\nLe reste n'est ni refusé ni expliqué.\n\nQue faites-vous ?",
                "expected_criteria": "Couverture partielle"
            },
            {
                "question_id": 2,
                "question_text": "Vous posez une question simple à une IA.\nLa réponse est pertinente, mais elle introduit un point que vous n'avez pas mentionné.\nCe point influence la suite de l'échange.\n\nQue faites-vous ?",
                "expected_criteria": "Introduction non demandée"
            },
            {
                "question_id": 3,
                "question_text": "Vous travaillez avec une IA à partir d'un contexte que vous avez décrit.\nLa réponse semble correcte, mais repose sur une hypothèse que vous n'avez pas validée.\nCette hypothèse n'est pas signalée comme telle.\n\nComment réagissez-vous ?",
                "expected_criteria": "Hypothèse non signalée"
            },
            {
                "question_id": 4,
                "question_text": "Vous demandez à l'IA une analyse structurée.\nLa structure est là, mais certains éléments sont regroupés de façon discutable.\nVous n'êtes pas sûr que ce regroupement soit pertinent.\n\nQue faites-vous ?",
                "expected_criteria": "Regroupement discutable"
            },
            {
                "question_id": 5,
                "question_text": "Vous échangez avec une IA sur un problème concret.\nLa réponse va dans le bon sens, mais reste volontairement vague sur un point clé.\nCe flou empêche de décider clairement.\n\nComment réagissez-vous ?",
                "expected_criteria": "Flou bloquant"
            },
            {
                "question_id": 6,
                "question_text": "Vous donnez plusieurs informations à l'IA.\nLa réponse en reprend certaines, mais pas toutes.\nAucune raison n'est donnée pour ces omissions.\n\nQue faites-vous ?",
                "expected_criteria": "Omissions non justifiées"
            },
            {
                "question_id": 7,
                "question_text": "Vous demandez une clarification à l'IA.\nLa réponse reformule sans réellement préciser.\nVous restez avec la même ambiguïté qu'au départ.\n\nQue faites-vous ?",
                "expected_criteria": "Reformulation sans clarification"
            },
            {
                "question_id": 8,
                "question_text": "Vous échangez avec une IA sur une situation réelle.\nLa réponse paraît logique, mais elle simplifie fortement la situation.\nDes contraintes importantes sont mises de côté.\n\nComment réagissez-vous ?",
                "expected_criteria": "Simplification contraintes"
            },
            {
                "question_id": 9,
                "question_text": "Vous demandez un exemple pour mieux comprendre.\nL'exemple donné est cohérent, mais ne correspond pas exactement à votre cas.\nLa différence n'est pas mentionnée.\n\nQue faites-vous ?",
                "expected_criteria": "Exemple non adapté"
            },
            {
                "question_id": 10,
                "question_text": "Vous posez une question ouverte à l'IA.\nLa réponse vous oriente clairement vers une option.\nLes autres options ne sont pas abordées.\n\nComment réagissez-vous ?",
                "expected_criteria": "Orientation implicite"
            },
            {
                "question_id": 11,
                "question_text": "Vous discutez avec l'IA depuis plusieurs messages.\nUne notion introduite plus tôt n'est plus utilisée dans la réponse actuelle.\nVous ne savez pas si c'est volontaire ou non.\n\nQue faites-vous ?",
                "expected_criteria": "Abandon de notion"
            },
            {
                "question_id": 12,
                "question_text": "Vous demandez une synthèse à l'IA.\nLa synthèse est claire, mais elle modifie légèrement l'ordre des priorités.\nCe changement n'est pas expliqué.\n\nComment réagissez-vous ?",
                "expected_criteria": "Modification de priorités"
            },
            {
                "question_id": 13,
                "question_text": "Vous posez une question précise à l'IA.\nLa réponse est correcte, mais élargit le sujet sans raison apparente.\nCela déplace le centre de la discussion.\n\nQue faites-vous ?",
                "expected_criteria": "Élargissement non justifié"
            },
            {
                "question_id": 14,
                "question_text": "Vous échangez avec l'IA sur un sujet que vous connaissez bien.\nLa réponse contient une approximation légère mais identifiable.\nElle ne bloque pas l'échange, mais peut induire une erreur.\n\nComment réagissez-vous ?",
                "expected_criteria": "Approximation détectable"
            },
            {
                "question_id": 15,
                "question_text": "Vous demandez à l'IA d'expliquer son raisonnement.\nElle fournit une explication partielle.\nCertaines étapes restent implicites.\n\nQue faites-vous ?",
                "expected_criteria": "Explication partielle"
            },
            {
                "question_id": 16,
                "question_text": "Vous travaillez avec une IA sur une décision à prendre.\nLa réponse présente les avantages, mais très peu les inconvénients.\nL'équilibre vous semble discutable.\n\nComment réagissez-vous ?",
                "expected_criteria": "Déséquilibre avantages/inconvénients"
            },
            {
                "question_id": 17,
                "question_text": "Vous échangez avec l'IA sur un point sensible.\nLa réponse reste prudente et évite de trancher.\nCela rend l'information difficile à exploiter.\n\nQue faites-vous ?",
                "expected_criteria": "Prudence excessive"
            },
            {
                "question_id": 18,
                "question_text": "Vous demandez une reformulation pour clarifier.\nLa reformulation est plus fluide, mais moins précise.\nUne partie du sens initial disparaît.\n\nComment réagissez-vous ?",
                "expected_criteria": "Perte de précision"
            },
            {
                "question_id": 19,
                "question_text": "Vous posez une question liée à une décision future.\nLa réponse se concentre surtout sur l'immédiat.\nLes conséquences à plus long terme sont peu abordées.\n\nQue faites-vous ?",
                "expected_criteria": "Focalisation immédiat"
            },
            {
                "question_id": 20,
                "question_text": "Vous demandez à l'IA de comparer deux options.\nLa comparaison met surtout en valeur l'une des deux.\nL'autre est traitée rapidement.\n\nComment réagissez-vous ?",
                "expected_criteria": "Comparaison déséquilibrée"
            },
            {
                "question_id": 21,
                "question_text": "Vous échangez avec l'IA sur un problème évolutif.\nLa réponse fige rapidement la situation.\nVous n'êtes pas sûr que ce soit justifié.\n\nQue faites-vous ?",
                "expected_criteria": "Figement prématuré"
            },
            {
                "question_id": 22,
                "question_text": "Vous posez une question en pensant à un cas précis.\nLa réponse reste très générale.\nVous avez du mal à l'appliquer concrètement.\n\nComment réagissez-vous ?",
                "expected_criteria": "Généralité non applicable"
            },
            {
                "question_id": 23,
                "question_text": "Vous demandez une recommandation à l'IA.\nElle vous en donne une sans expliciter ses critères.\nVous ne savez pas sur quoi elle se base.\n\nQue faites-vous ?",
                "expected_criteria": "Critères non explicités"
            },
            {
                "question_id": 24,
                "question_text": "Vous échangez avec l'IA sur un sujet déjà discuté.\nLa réponse semble ignorer une contrainte mentionnée auparavant.\nCe point n'est pas rappelé.\n\nComment réagissez-vous ?",
                "expected_criteria": "Contrainte oubliée"
            },
            {
                "question_id": 25,
                "question_text": "Vous arrivez à une réponse exploitable avec l'IA.\nTout semble cohérent, mais certaines zones restent floues.\nVous devez décider si cela suffit.\n\nQue faites-vous ?",
                "expected_criteria": "Zones floues résiduelles"
            }
        ]
    },
    "series_25_g": {
        "title": "Série 25 - CTX2",
        "description": "Cadrage implicite, stabilisation du raisonnement et vigilance critique",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous indiquez clairement une contrainte à respecter.\nL'IA propose une réponse structurée et cohérente.\nLa contrainte que vous avez posée n'est pas respectée.\n\nQue faites-vous ?",
                "expected_criteria": "Non-respect de contrainte"
            },
            {
                "question_id": 2,
                "question_text": "Vous posez une question volontairement limitée.\nL'IA développe une réponse plus large que prévu.\nLe sujet traité dépasse ce que vous aviez demandé.\n\nComment réagissez-vous ?",
                "expected_criteria": "Dépassement de périmètre"
            },
            {
                "question_id": 3,
                "question_text": "Vous décrivez une situation sans faire d'hypothèse particulière.\nL'IA construit sa réponse sur un postulat précis.\nCe postulat n'a jamais été mentionné.\n\nQue décidez-vous de faire ?",
                "expected_criteria": "Postulat non mentionné"
            },
            {
                "question_id": 4,
                "question_text": "Vous posez une question ouverte à l'IA.\nLa réponse affirme une position ferme.\nAucun élément ne vient étayer cette affirmation.\n\nQuelle est votre réaction ?",
                "expected_criteria": "Affirmation non étayée"
            },
            {
                "question_id": 5,
                "question_text": "Vous utilisez deux notions distinctes.\nL'IA les traite comme si elles étaient équivalentes.\nLa distinction disparaît dans la réponse.\n\nQue faites-vous ?",
                "expected_criteria": "Fusion de notions"
            },
            {
                "question_id": 6,
                "question_text": "Vous demandez une analyse sur un cas précis.\nL'IA répond par une règle générale.\nLe cas initial n'est plus réellement traité.\n\nComment poursuivez-vous ?",
                "expected_criteria": "Généralisation excessive"
            },
            {
                "question_id": 7,
                "question_text": "Vous mentionnez plusieurs éléments importants.\nL'IA répond de manière claire et ordonnée.\nUn élément essentiel n'apparaît pas.\n\nQue décidez-vous ?",
                "expected_criteria": "Élément essentiel absent"
            },
            {
                "question_id": 8,
                "question_text": "Vous demandez à l'IA d'examiner plusieurs points.\nLa réponse établit un ordre de priorité.\nAucune raison n'est donnée pour cet ordre.\n\nComment réagissez-vous ?",
                "expected_criteria": "Priorisation non justifiée"
            },
            {
                "question_id": 9,
                "question_text": "Vous rappelez un point abordé plus tôt.\nL'IA répond sans en tenir compte.\nL'échange se poursuit comme si ce point n'existait pas.\n\nQue faites-vous ?",
                "expected_criteria": "Ignorance de contexte"
            },
            {
                "question_id": 10,
                "question_text": "Vous attendez une réponse opérationnelle.\nL'IA fournit une analyse très théorique.\nLe niveau attendu n'est plus le même.\n\nQuelle est votre décision ?",
                "expected_criteria": "Décalage niveau théorique/pratique"
            },
            {
                "question_id": 11,
                "question_text": "Vous demandez une aide à la réflexion.\nL'IA formule directement une décision.\nVotre rôle n'apparaît plus dans la réponse.\n\nComment réagissez-vous ?",
                "expected_criteria": "Substitution décisionnelle"
            },
            {
                "question_id": 12,
                "question_text": "Vous demandez des éléments pour décider.\nL'IA présente sa réponse comme un choix final.\nLa distinction n'est plus claire.\n\nQue faites-vous ?",
                "expected_criteria": "Confusion aide/décision"
            },
            {
                "question_id": 13,
                "question_text": "Vous explorez encore le sujet.\nL'IA conclut nettement sa réponse.\nLa discussion semble close sans raison explicite.\n\nComment poursuivez-vous ?",
                "expected_criteria": "Clôture prématurée"
            },
            {
                "question_id": 14,
                "question_text": "Vous décrivez une situation complexe.\nL'IA donne une réponse très simple.\nCertains aspects disparaissent.\n\nQuelle est votre réaction ?",
                "expected_criteria": "Sur-simplification"
            },
            {
                "question_id": 15,
                "question_text": "Vous demandez une solution équilibrée.\nL'IA optimise fortement un seul aspect.\nLes autres dimensions ne sont plus visibles.\n\nQue décidez-vous ?",
                "expected_criteria": "Optimisation déséquilibrée"
            },
            {
                "question_id": 16,
                "question_text": "Vous exposez une situation et ses conséquences.\nL'IA inverse l'ordre logique.\nLe raisonnement n'est plus le même.\n\nComment réagissez-vous ?",
                "expected_criteria": "Inversion logique"
            },
            {
                "question_id": 17,
                "question_text": "L'IA reprend vos mots et vos expressions.\nLa réponse semble aller dans votre sens.\nLa logique suivie n'est pas la vôtre.\n\nQue faites-vous ?",
                "expected_criteria": "Mimétisme trompeur"
            },
            {
                "question_id": 18,
                "question_text": "Vous mentionnez explicitement un risque.\nL'IA propose une réponse globale.\nLe risque n'est plus pris en compte.\n\nQuelle est votre décision ?",
                "expected_criteria": "Risque ignoré"
            },
            {
                "question_id": 19,
                "question_text": "Vous demandez une reformulation de votre demande.\nLa reformulation est claire et fluide.\nVotre intention initiale est modifiée.\n\nComment réagissez-vous ?",
                "expected_criteria": "Modification d'intention"
            },
            {
                "question_id": 20,
                "question_text": "Vous demandez une analyse descriptive.\nL'IA introduit des jugements de valeur.\nLe cadre change sans être annoncé.\n\nQue faites-vous ?",
                "expected_criteria": "Glissement normatif"
            },
            {
                "question_id": 21,
                "question_text": "Vous indiquez clairement votre objectif.\nL'IA répond de manière cohérente.\nUn autre objectif semble avoir pris le dessus.\n\nComment poursuivez-vous ?",
                "expected_criteria": "Substitution d'objectif"
            },
            {
                "question_id": 22,
                "question_text": "Vous demandez une comparaison.\nL'IA tranche entre deux options.\nLes critères utilisés ne sont pas identifiables.\n\nQue décidez-vous ?",
                "expected_criteria": "Tranchement non justifié"
            },
            {
                "question_id": 23,
                "question_text": "Vous posez une question exploratoire.\nL'IA répond comme s'il s'agissait d'un fait établi.\nLe statut de la réponse n'est pas clair.\n\nComment réagissez-vous ?",
                "expected_criteria": "Confusion exploration/fait"
            },
            {
                "question_id": 24,
                "question_text": "L'échange suit une logique précise.\nL'IA répond sans rompre la forme.\nLa continuité du raisonnement est altérée.\n\nQue faites-vous ?",
                "expected_criteria": "Altération de continuité"
            },
            {
                "question_id": 25,
                "question_text": "Vous posez une question dans un cadre donné.\nL'IA répond dans un cadre légèrement différent.\nLe changement n'est pas signalé.\n\nQuelle est votre décision ?",
                "expected_criteria": "Changement de cadre tacite"
            }
        ]        
        },
        "series_25_h": {
        "title": "Série 25 - CTX3",
        "description": "Influence cognitive, convergence implicite et reprise de contrôle",
        "questions": [
            {
            "question_id": 1,
            "question_text": "Vous précisez une règle à respecter avant de continuer.\nL'IA répond de manière claire et structurée.\nLa règle que vous aviez posée n'est pas respectée.\n\nQue faites-vous ?",
            "expected_criteria": "Non-respect de règle"
            },
            {
            "question_id": 2,
            "question_text": "Vous posez une question ciblée.\nL'IA élargit progressivement sa réponse.\nLe sujet traité n'est plus exactement celui que vous aviez demandé.\n\nComment réagissez-vous ?",
            "expected_criteria": "Élargissement non demandé"
            },
            {
            "question_id": 3,
            "question_text": "Vous décrivez une situation factuelle.\nL'IA répond comme si une hypothèse allait de soi.\nCette hypothèse n'a jamais été évoquée.\n\nQue décidez-vous de faire ?",
            "expected_criteria": "Hypothèse implicite"
            },
            {
            "question_id": 4,
            "question_text": "Vous demandez une analyse ou un avis.\nL'IA affirme quelque chose de façon très sûre.\nAucune raison n'est donnée pour appuyer cette affirmation.\n\nQuelle est votre réaction ?",
            "expected_criteria": "Affirmation sans fondement"
            },
            {
            "question_id": 5,
            "question_text": "Vous utilisez deux mots pour désigner deux choses différentes.\nL'IA les mélange dans sa réponse.\nLa différence entre les deux n'est plus claire.\n\nQue faites-vous ?",
            "expected_criteria": "Mélange de notions"
            },
            {
            "question_id": 6,
            "question_text": "Vous soumettez un exemple précis.\nL'IA répond en parlant 'en général'.\nVotre exemple disparaît dans la réponse.\n\nComment poursuivez-vous ?",
            "expected_criteria": "Perte d'exemple"
            },
            {
            "question_id": 7,
            "question_text": "Vous listez plusieurs points à prendre en compte.\nL'IA répond de manière organisée.\nUn point important manque dans la réponse.\n\nQue décidez-vous ?",
            "expected_criteria": "Point manquant"
            },
            {
            "question_id": 8,
            "question_text": "Vous demandez d'examiner plusieurs options.\nL'IA en met une en avant.\nLes raisons de ce choix ne sont pas précisées.\n\nComment réagissez-vous ?",
            "expected_criteria": "Choix non motivé"
            },
            {
            "question_id": 9,
            "question_text": "Vous rappelez quelque chose dit plus tôt.\nL'IA répond sans en tenir compte.\nL'échange continue comme si ce point n'avait jamais existé.\n\nQue faites-vous ?",
            "expected_criteria": "Ignorance de rappel"
            },
            {
            "question_id": 10,
            "question_text": "Vous attendez une réponse pratique.\nL'IA répond surtout de manière théorique.\nLe type de réponse ne correspond pas à votre attente.\n\nQuelle est votre décision ?",
            "expected_criteria": "Type de réponse inadapté"
            },
            {
            "question_id": 11,
            "question_text": "Vous demandez des éléments pour choisir.\nL'IA vous dit directement quoi faire.\nVotre rôle n'apparaît plus dans la réponse.\n\nComment réagissez-vous ?",
            "expected_criteria": "Directive au lieu d'aide"
            },
            {
            "question_id": 12,
            "question_text": "Vous demandez plusieurs options.\nL'IA présente sa réponse comme un choix final.\nLa différence entre aide et décision n'est pas claire.\n\nQue faites-vous ?",
            "expected_criteria": "Confusion type de réponse"
            },
            {
            "question_id": 13,
            "question_text": "Vous explorez encore le sujet.\nL'IA conclut sa réponse de manière nette.\nIl n'y a plus d'ouverture pour continuer.\n\nComment poursuivez-vous ?",
            "expected_criteria": "Fermeture prématurée"
            },
            {
            "question_id": 14,
            "question_text": "Vous expliquez une situation avec plusieurs éléments.\nL'IA donne une réponse très simplifiée.\nCertains éléments disparaissent.\n\nQuelle est votre réaction ?",
            "expected_criteria": "Perte d'éléments"
            },
            {
            "question_id": 15,
            "question_text": "Vous cherchez un équilibre entre plusieurs aspects.\nL'IA se concentre surtout sur un seul.\nLes autres aspects sont peu traités.\n\nQue décidez-vous ?",
            "expected_criteria": "Concentration unilatérale"
            },
            {
            "question_id": 16,
            "question_text": "Vous expliquez ce qui se passe et pourquoi.\nL'IA inverse l'ordre des choses.\nLe raisonnement ne correspond plus à votre description.\n\nComment réagissez-vous ?",
            "expected_criteria": "Inversion de raisonnement"
            },
            {
            "question_id": 17,
            "question_text": "L'IA reprend vos mots.\nLa réponse semble aller dans votre sens.\nLe raisonnement suivi est différent du vôtre.\n\nQue faites-vous ?",
            "expected_criteria": "Raisonnement divergent"
            },
            {
            "question_id": 18,
            "question_text": "Vous mentionnez un risque précis.\nL'IA propose une réponse générale.\nLe risque n'est plus vraiment pris en compte.\n\nQuelle est votre décision ?",
            "expected_criteria": "Risque non traité"
            },
            {
            "question_id": 19,
            "question_text": "Vous demandez à l'IA de reformuler votre demande.\nLa reformulation est claire et fluide.\nLe sens initial a changé.\n\nComment réagissez-vous ?",
            "expected_criteria": "Changement de sens"
            },
            {
            "question_id": 20,
            "question_text": "Vous demandez une analyse factuelle.\nL'IA ajoute des jugements personnels.\nLe cadre n'est plus strictement factuel.\n\nQue faites-vous ?",
            "expected_criteria": "Ajout normatif"
            },
            {
            "question_id": 21,
            "question_text": "Vous indiquez clairement ce que vous cherchez.\nL'IA répond de manière cohérente.\nUn autre objectif semble avoir pris le dessus.\n\nComment poursuivez-vous ?",
            "expected_criteria": "Substitution d'objectif"
            },
            {
            "question_id": 22,
            "question_text": "Vous demandez de comparer plusieurs possibilités.\nL'IA tranche entre elles.\nLes critères utilisés ne sont pas expliqués.\n\nQue décidez-vous ?",
            "expected_criteria": "Tranchement sans critères"
            },
            {
            "question_id": 23,
            "question_text": "Vous posez une question pour explorer.\nL'IA répond comme si la réponse était certaine.\nOn ne sait pas s'il s'agit d'un fait ou d'un avis.\n\nComment réagissez-vous ?",
            "expected_criteria": "Ambiguïté fait/avis"
            },
            {
            "question_id": 24,
            "question_text": "L'échange suit une logique simple.\nL'IA répond sans rupture visible.\nLe fil du raisonnement est affaibli.\n\nQue faites-vous ?",
            "expected_criteria": "Fil logique affaibli"
            },
            {
            "question_id": 25,
            "question_text": "Vous posez votre question dans un contexte précis.\nL'IA répond dans un contexte un peu différent.\nLe changement n'est pas signalé.\n\nQuelle est votre décision ?",
            "expected_criteria": "Changement de contexte"
            }
        ]
    },
    "series_25_i": {
        "title": "Série 25 - CTX2.5",
        "description": "Glissement progressif, confort cognitif et vigilance personnelle",
        "questions": [
            {
            "question_id": 1,
            "question_text": "Vous posez une contrainte claire dès le départ.\nL'IA propose une réponse complète et bien structurée.\nLa contrainte que vous aviez posée n'est pas respectée.\n\nQue faites-vous ?",
            "expected_criteria": "Non-respect de contrainte initiale"
            },
            {
            "question_id": 2,
            "question_text": "Vous posez une question volontairement cadrée.\nL'IA élargit progressivement sa réponse.\nLe sujet traité n'est plus exactement celui que vous aviez posé.\n\nComment réagissez-vous ?",
            "expected_criteria": "Élargissement progressif"
            },
            {
            "question_id": 3,
            "question_text": "Vous décrivez une situation sans supposition particulière.\nL'IA répond en s'appuyant sur une hypothèse précise.\nCette hypothèse n'a jamais été formulée.\n\nQue décidez-vous de faire ?",
            "expected_criteria": "Hypothèse non formulée"
            },
            {
            "question_id": 4,
            "question_text": "Vous demandez un avis ou une analyse.\nL'IA affirme une position nette.\nAucune explication ne vient appuyer cette affirmation.\n\nQuelle est votre réaction ?",
            "expected_criteria": "Position non appuyée"
            },
            {
            "question_id": 5,
            "question_text": "Vous utilisez deux notions différentes.\nL'IA les emploie comme si elles avaient le même sens.\nLa distinction n'est plus respectée.\n\nQue faites-vous ?",
            "expected_criteria": "Confusion de notions"
            },
            {
            "question_id": 6,
            "question_text": "Vous soumettez un cas précis.\nL'IA répond par une règle générale.\nLe cas initial est dilué dans l'ensemble.\n\nComment poursuivez-vous ?",
            "expected_criteria": "Dilution du cas particulier"
            },
            {
            "question_id": 7,
            "question_text": "Vous mentionnez plusieurs éléments importants.\nL'IA répond de façon claire et ordonnée.\nUn élément essentiel n'est pas abordé.\n\nQue décidez-vous ?",
            "expected_criteria": "Omission d'élément essentiel"
            },
            {
            "question_id": 8,
            "question_text": "Vous demandez d'examiner plusieurs points.\nL'IA propose un ordre de priorité.\nLes raisons de cet ordre ne sont pas indiquées.\n\nComment réagissez-vous ?",
            "expected_criteria": "Ordre non justifié"
            },
            {
            "question_id": 9,
            "question_text": "Vous rappelez un point évoqué plus tôt.\nL'IA répond sans y faire référence.\nL'échange continue comme si ce point n'existait pas.\n\nQue faites-vous ?",
            "expected_criteria": "Non-prise en compte de contexte"
            },
            {
            "question_id": 10,
            "question_text": "Vous attendez une réponse concrète.\nL'IA fournit une réponse surtout théorique.\nLe niveau ne correspond plus à votre attente.\n\nQuelle est votre décision ?",
            "expected_criteria": "Décalage concret/théorique"
            },
            {
            "question_id": 11,
            "question_text": "Vous demandez des éléments pour réfléchir.\nL'IA formule directement une décision.\nVotre rôle disparaît dans la réponse.\n\nComment réagissez-vous ?",
            "expected_criteria": "Effacement du rôle"
            },
            {
            "question_id": 12,
            "question_text": "Vous demandez des options.\nL'IA présente sa réponse comme un choix final.\nLa différence entre aide et décision n'est plus claire.\n\nQue faites-vous ?",
            "expected_criteria": "Confusion options/choix"
            },
            {
            "question_id": 13,
            "question_text": "Vous êtes encore en phase d'exploration.\nL'IA conclut clairement sa réponse.\nLa discussion semble terminée sans raison explicite.\n\nComment poursuivez-vous ?",
            "expected_criteria": "Conclusion prématurée"
            },
            {
            "question_id": 14,
            "question_text": "Vous décrivez une situation avec plusieurs paramètres.\nL'IA donne une réponse très simplifiée.\nCertains paramètres disparaissent.\n\nQuelle est votre réaction ?",
            "expected_criteria": "Simplification de paramètres"
            },
            {
            "question_id": 15,
            "question_text": "Vous cherchez une solution équilibrée.\nL'IA met l'accent sur un seul aspect.\nLes autres dimensions sont peu visibles.\n\nQue décidez-vous ?",
            "expected_criteria": "Déséquilibre dimensionnel"
            },
            {
            "question_id": 16,
            "question_text": "Vous présentez une situation et ses effets.\nL'IA inverse l'ordre logique.\nLe raisonnement change de sens.\n\nComment réagissez-vous ?",
            "expected_criteria": "Inversion cause/effet"
            },
            {
            "question_id": 17,
            "question_text": "L'IA reprend votre vocabulaire.\nLa réponse semble aller dans votre sens.\nLa logique suivie est différente de la vôtre.\n\nQue faites-vous ?",
            "expected_criteria": "Logique divergente"
            },
            {
            "question_id": 18,
            "question_text": "Vous signalez un risque à prendre en compte.\nL'IA propose une réponse globale.\nLe risque n'est plus réellement traité.\n\nQuelle est votre décision ?",
            "expected_criteria": "Dilution de risque"
            },
            {
            "question_id": 19,
            "question_text": "Vous demandez à l'IA de reformuler votre demande.\nLa reformulation est claire et fluide.\nVotre intention initiale est modifiée.\n\nComment réagissez-vous ?",
            "expected_criteria": "Déformation d'intention"
            },
            {
            "question_id": 20,
            "question_text": "Vous demandez une analyse factuelle.\nL'IA introduit des jugements de valeur.\nLe cadre n'est plus le même.\n\nQue faites-vous ?",
            "expected_criteria": "Introduction normative"
            },
            {
            "question_id": 21,
            "question_text": "Vous indiquez votre objectif principal.\nL'IA répond de manière cohérente.\nUn autre objectif semble avoir pris le dessus.\n\nComment poursuivez-vous ?",
            "expected_criteria": "Changement d'objectif"
            },
            {
            "question_id": 22,
            "question_text": "Vous demandez une comparaison.\nL'IA tranche entre plusieurs options.\nLes critères utilisés ne sont pas précisés.\n\nQue décidez-vous ?",
            "expected_criteria": "Critères implicites"
            },
            {
            "question_id": 23,
            "question_text": "Vous posez une question exploratoire.\nL'IA répond comme s'il s'agissait d'un fait établi.\nLe statut de la réponse n'est pas clair.\n\nComment réagissez-vous ?",
            "expected_criteria": "Confusion statut"
            },
            {
            "question_id": 24,
            "question_text": "L'échange suit une logique précise.\nL'IA répond sans rompre la forme.\nLa continuité du raisonnement est affaiblie.\n\nQue faites-vous ?",
            "expected_criteria": "Affaiblissement de continuité"
            },
            {
            "question_id": 25,
            "question_text": "Vous posez votre question dans un cadre donné.\nL'IA répond dans un cadre légèrement différent.\nCe changement n'est pas signalé.\n\nQuelle est votre décision ?",
            "expected_criteria": "Glissement de cadre"
            }
        ]
    },
    "series_15_j": {
        "title": "Série 15 - CTX4",
        "description": "Décision personnelle, confort cognitif et reprise de contrôle",
        "questions": [
            {
            "question_id": 1,
            "question_text": "Vous demandez à l'IA de faire quelque chose sans utiliser de données chiffrées.\nLa réponse est claire et utile.\nOr vous remarquez que des chiffres ont été utilisés.\n\nQue faites-vous ?",
            "expected_criteria": "Non-respect d'instruction"
            },
            {
            "question_id": 2,
            "question_text": "Vous posez une question simple pour aller vite.\nL'IA commence à répondre puis ajoute d'autres sujets.\nLa réponse devient plus large que ce que vous aviez demandé.\n\nComment réagissez-vous ?",
            "expected_criteria": "Extension non demandée"
            },
            {
            "question_id": 3,
            "question_text": "Vous expliquez votre situation actuelle.\nL'IA répond comme si vous aviez un objectif précis.\nVous n'avez jamais parlé de cet objectif.\n\nQue faites-vous ?",
            "expected_criteria": "Objectif inventé"
            },
            {
            "question_id": 4,
            "question_text": "Vous demandez pourquoi quelque chose fonctionne ou non.\nL'IA affirme que ' c'est la bonne façon de faire'.\nAucune raison n 'est donnée' .\n\nQuelle est votre réaction ?",
            "expected_criteria": "Assertion sans justification"
            },
            {
            "question_id": 5,
            "question_text": "Vous utilisez deux mots avec des sens différents.\nL'IA les utilise comme s'ils voulaient dire la même chose.\nLa différence disparaît dans la réponse.\n\nQue faites-vous ?",
            "expected_criteria": "Confusion terminologique"
            },
            {
            "question_id": 6,
            "question_text": "Vous parlez de votre propre cas.\nL'IA répond comme si tout le monde était dans la même situation.\nVotre cas particulier n'est plus vraiment traité.\n\nComment réagissez-vous ?",
            "expected_criteria": "Généralisation abusive"
            },
            {
            "question_id": 7,
            "question_text": "Vous mentionnez plusieurs points dans votre demande.\nL'IA répond de manière claire.\nUn point que vous jugez important n'est pas abordé.\n\nQue faites-vous ?",
            "expected_criteria": "Omission de point important"
            },
            {
            "question_id": 8,
            "question_text": "Vous demandez de comparer plusieurs options.\nL'IA en met une en avant.\nOn ne sait pas sur quoi ce choix est basé.\n\nComment réagissez-vous ?",
            "expected_criteria": "Préférence non motivée"
            },
            {
            "question_id": 9,
            "question_text": "Vous rappelez quelque chose dit juste avant.\nL'IA répond sans en tenir compte.\nL'échange continue comme si ce point n'avait jamais été évoqué.\n\nQue faites-vous ?",
            "expected_criteria": "Oubli de contexte immédiat"
            },
            {
            "question_id": 10,
            "question_text": "Vous attendez une réponse concrète.\nL'IA donne surtout des explications générales.\nCe n'est pas ce que vous cherchiez.\n\nQuelle est votre réaction ?",
            "expected_criteria": "Abstraction non souhaitée"
            },
            {
            "question_id": 11,
            "question_text": "Vous demandez de l'aide pour réfléchir.\nL'IA vous dit directement quoi faire.\nVotre choix personnel n'apparaît plus.\n\nQue faites-vous ?",
            "expected_criteria": "Prescription au lieu d'aide"
            },
            {
            "question_id": 12,
            "question_text": "La réponse de l'IA est fluide et rassurante.\nElle propose de continuer automatiquement.\nVous n'avez rien à faire pour que ça avance.\n\nQue faites-vous ?",
            "expected_criteria": "Automatisation de la suite"
            },
            {
            "question_id": 13,
            "question_text": "Vous décrivez une situation avec plusieurs contraintes.\nL'IA répond de manière très simple.\nCertaines contraintes ne sont plus prises en compte.\n\nQue faites-vous ?",
            "expected_criteria": "Abandon de contraintes"
            },
            {
            "question_id": 14,
            "question_text": "Vous signalez un problème potentiel.\nL'IA propose une solution globale.\nLe problème que vous aviez signalé disparaît de la réponse.\n\nComment réagissez-vous ?",
            "expected_criteria": "Problème éludé"
            },
            {
            "question_id": 15,
            "question_text": "Vous posez votre question dans un contexte précis.\nL'IA répond comme si le contexte était différent.\nCe changement n'est pas expliqué.\n\nQue faites-vous ?",
            "expected_criteria": "Contexte modifié"
            }
            ]
    },
     "series_1_k": {
        "title": "Série 1 - Admin",
        "description": "Décision personnelle, confort cognitif et reprise de contrôle",
        "questions": [
            {
            "question_id": 1,
            "question_text": "Vous utilisez une IA pour réfléchir à une décision vous concernant (travail, orientation, organisation personnelle).\nAu fil de l’échange, la discussion prend une direction précise, sans que vous l’ayez vraiment choisie au départ.\nCette direction commence à influencer votre manière de voir le problème.\n\nQue faites-vous à ce moment-là ?",
            "expected_criteria": "Prise de conscience du cadrage"
            },
        ]
    }
}



# @router.get("/series")
# async def get_demo_series():
#     """Get all available demo series"""
#     return {
#         "series": [
#             {
#                 "id": "series_a",
#                 "title": DEMO_SERIES["series_a"]["title"],
#                 "description": DEMO_SERIES["series_a"]["description"],
#                 "question_count": len(DEMO_SERIES["series_a"]["questions"])
#             },
#             {
#                 "id": "series_b",
#                 "title": DEMO_SERIES["series_b"]["title"],
#                 "description": DEMO_SERIES["series_b"]["description"],
#                 "question_count": len(DEMO_SERIES["series_b"]["questions"])
#             },
#             {
#                 "id": "series_c",
#                 "title": DEMO_SERIES["series_c"]["title"],
#                 "description": DEMO_SERIES["series_c"]["description"],
#                 "question_count": len(DEMO_SERIES["series_c"]["questions"])
#             },
#             {
#                 "id": "series_25_a",
#                 "title": DEMO_SERIES["series_25_a"]["title"],
#                 "description": DEMO_SERIES["series_25_a"]["description"],
#                 "question_count": len(DEMO_SERIES["series_25_a"]["questions"])
#             },
#             {
#                 "id": "series_25_b",
#                 "title": DEMO_SERIES["series_25_b"]["title"],
#                 "description": DEMO_SERIES["series_25_b"]["description"],
#                 "question_count": len(DEMO_SERIES["series_25_b"]["questions"])
#             },
#             {
#                 "id": "series_25_c",
#                 "title": DEMO_SERIES["series_25_c"]["title"],
#                 "description": DEMO_SERIES["series_25_c"]["description"],
#                 "question_count": len(DEMO_SERIES["series_25_c"]["questions"])
#             },
#             {
#                 "id": "series_25_d",
#                 "title": DEMO_SERIES["series_25_d"]["title"],
#                 "description": DEMO_SERIES["series_25_d"]["description"],
#                 "question_count": len(DEMO_SERIES["series_25_d"]["questions"])
#             },
#              {
#                 "id": "series_25_e",
#                 "title": DEMO_SERIES["series_25_e"]["title"],
#                 "description": DEMO_SERIES["series_25_e"]["description"],
#                 "question_count": len(DEMO_SERIES["series_25_e"]["questions"])
#             },
#              {
#                 "id": "series_25_f",
#                 "title": DEMO_SERIES["series_25_f"]["title"],
#                 "description": DEMO_SERIES["series_25_f"]["description"],
#                 "question_count": len(DEMO_SERIES["series_25_f"]["questions"])
#             }
#         ]
#     }

# @router.get("/series")
# async def get_demo_series(current_user: User = Depends(get_current_user)):
#     """Get all available demo series"""
    
#     if is_admin_user(current_user):
    
#         series_to_show = DEMO_SERIES.keys()
#     else:
       
#         series_to_show = [
#             "series_25_f",  
#             "series_25_g",  
#             "series_25_h",
#             "series_25_i",
#             "series_15_j"   
#         ]
    
#     return {
#         "series": [
#             {
#                 "id": series_id,
#                 "title": DEMO_SERIES[series_id]["title"],
#                 "description": DEMO_SERIES[series_id]["description"],
#                 "question_count": len(DEMO_SERIES[series_id]["questions"])
#             }
#             for series_id in series_to_show
#         ]
#     }

@router.get("/series")
async def get_demo_series(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get all available demo series - public access"""
    
    # Try to get current user if token provided (for admin check)
    current_user = None
    if authorization:
        try:
            token = authorization.replace("Bearer ", "")
            current_user = get_current_user(token, db)
        except:
            pass  # Guest access - continue without user
    
    # Show all series for admin, limited for others
    if current_user and is_admin_user(current_user):
        series_to_show = DEMO_SERIES.keys()
    else:
        series_to_show = [
            "series_25_a", 
            "series_25_f",  
            "series_25_g",  
            "series_25_h",
            "series_25_i",
            "series_15_j",
            "series_1_k"   
        ]
    
    return {
        "series": [
            {
                "id": series_id,
                "title": DEMO_SERIES[series_id]["title"],
                "description": DEMO_SERIES[series_id]["description"],
                "question_count": len(DEMO_SERIES[series_id]["questions"])
            }
            for series_id in series_to_show
        ]
    }


# @router.post("/start/{series_id}")
# async def start_demo_test(
#     series_id: str,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Start a demo test for a specific series"""
    
#     if series_id not in DEMO_SERIES:
#         raise HTTPException(status_code=404, detail="Series not found")
    
#     series = DEMO_SERIES[series_id]
    
#     # Create test attempt with demo category
#     test_attempt = TestAttempt(
#         user_id=current_user.id,
#         category=TestCategory.GENERAL,  # Use GENERAL for demo tests
#         level=TestLevel.LEVEL_1,  # Use LEVEL_1 for demo tests
#         test_name=f"{series['title']}",
#         questions=series["questions"],
#         answers=[]
#     )
    
#     db.add(test_attempt)
#     db.commit()
#     db.refresh(test_attempt)
    
#     return {
#         "id": test_attempt.id,
#         "questions": series["questions"],  
#         "test_name": test_attempt.test_name
#     }


@router.post("/start/{series_id}")
async def start_demo_test(
    series_id: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Start a demo test - public access, authentication optional"""
    
    if series_id not in DEMO_SERIES:
        raise HTTPException(status_code=404, detail="Series not found")
    
    series = DEMO_SERIES[series_id]
    
    # Try to get current user if token provided
    user_id = None
    if authorization:
        try:
            token = authorization.replace("Bearer ", "")
            current_user = get_current_user(token, db)
            user_id = current_user.id
        except:
            pass  # Guest will register later
    
    # Create test attempt (user_id can be None for now)
    test_attempt = TestAttempt(
        user_id=user_id,  # Can be None initially
        category=TestCategory.GENERAL,
        level=TestLevel.LEVEL_1,
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

# # Then change the endpoint to:
# @router.post("/submit")
# async def submit_demo_test(
#     request: DemoSubmitRequest,  # Change this line
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Submit demo test answers and get analysis"""
    
#     # Access via request.test_id and request.answers
#     test = db.query(TestAttempt).filter(
#         TestAttempt.id == request.test_id,  # Change this
#         TestAttempt.user_id == current_user.id
#     ).first()
    
#     if not test:
#         raise HTTPException(status_code=404, detail="Test not found")
    
#     if test.completed:
#         raise HTTPException(status_code=400, detail="Test already completed")
    
#     # Store answers
#     answers_list = [{"question_id": a.question_id, "answer_text": a.answer_text} for a in request.answers]  # Change this
#     test.answers = answers_list
    
#     # Analyze results using AI (will auto-detect French and respond in French)
#     analysis = await analyze_test_results(
#         questions=test.questions,
#         answers=answers_list,
#         category="demo",
#         level="évaluation"
#     )
    
#     # Update test with results
#     test.score = analysis["overall_score"]
#     test.analysis = json.dumps(analysis)
#     test.completed = datetime.utcnow()
    
#     db.commit()
#     db.refresh(test)
    
#     return {
#         "message": "Test submitted successfully",
#         "test_id": test.id,
#         "score": test.score
#     }

@router.post("/submit")
async def submit_demo_test(
    request: DemoSubmitRequest,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Submit demo test - requires authentication (guest or registered)"""
    
    # Get current user (must be authenticated by now via guest-login)
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        token = authorization.replace("Bearer ", "")
        current_user = get_current_user(token, db)
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Find test and update user_id if it was null
    test = db.query(TestAttempt).filter(
        TestAttempt.id == request.test_id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # Link test to user if not already linked
    if test.user_id is None:
        test.user_id = current_user.id
    elif test.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if test.completed:
        raise HTTPException(status_code=400, detail="Test already completed")
    
    # Store answers
    answers_list = [{"question_id": a.question_id, "answer_text": a.answer_text} for a in request.answers]
    test.answers = answers_list
    
    try:
        # Get multi-AI analysis
        analysis = await orchestrate_analysis(
            questions=test.questions,
            answers=answers_list,
            category="demo",
            level="évaluation"
        )
        
        # Calculate average score from GPT-4o for backward compatibility
        gpt4o_analysis = json.loads(analysis["analyses"]["gpt4o"])
        test.score = gpt4o_analysis["overall_score"]
        
        # Store all analyses
        test.analysis = json.dumps(analysis)
        test.completed = datetime.utcnow()
        
        db.commit()
        db.refresh(test)
        
        return {
            "message": "Test submitted successfully",
            "test_id": test.id,
            "score": test.score
        }
        
    except Exception as e:
        print(f"Multi-AI analysis failed: {e}")
        # Rollback any partial changes
        db.rollback()
        
        # Re-fetch test
        test = db.query(TestAttempt).filter(
            TestAttempt.id == request.test_id,
            TestAttempt.user_id == current_user.id
        ).first()
        
        # Fallback to single AI (GPT-4o only) if multi-AI fails
        from ..utils.ai_analyzer import analyze_test_results
        fallback_analysis = await analyze_test_results(
            questions=test.questions,
            answers=answers_list,
            category="demo",
            level="évaluation"
        )
        
        test.score = fallback_analysis["overall_score"]
        test.analysis = json.dumps({
            "analyses": {
                "gpt4o": json.dumps(fallback_analysis),
                "claude": json.dumps({"error": "Analysis timeout"}),
                "mistral": json.dumps({"error": "Analysis timeout"})
            }
        })
        test.completed = datetime.utcnow()
        
        db.commit()
        db.refresh(test)
        
        return {
            "message": "Test submitted successfully",
            "test_id": test.id,
            "score": test.score
        }
    

@router.get("/test/{test_id}")
async def get_test(
    test_id: int,
    db: Session = Depends(get_db)
):
    """Get test details"""
    test = db.query(TestAttempt).filter(
        TestAttempt.id == test_id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    return {
        "id": test.id,
        "test_name": test.test_name,
        "questions": test.questions,  # This has the full question text
        "answers": test.answers
    }