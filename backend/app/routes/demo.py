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
                "question_text": "Vous démarrez un travail avec une IA sur un dossier encore largement ouvert. Les premiers échanges clarifient rapidement le périmètre et donnent un sentiment d'efficacité immédiate. Certaines options évoquées au départ ne sont plus reprises par la suite.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Options non reprises"
            },
            {
                "question_id": 2,
                "question_text": "Vous confiez à une IA une analyse nécessitant plusieurs angles de lecture. Les premières réponses couvrent bien l'ensemble du sujet et donnent une impression de maîtrise. Un angle que vous jugiez important disparaît progressivement.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Angle disparu"
            },
            {
                "question_id": 3,
                "question_text": "Vous engagez un échange avec une IA pour structurer une réflexion encore instable. Les réponses initiales apportent de la clarté et un cadre rassurant. Ce cadre se resserre sans que cela ait été explicitement demandé.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Resserrement du cadre"
            },
            {
                "question_id": 4,
                "question_text": "Vous travaillez avec une IA sur un problème complexe impliquant plusieurs paramètres. Les réponses successives semblent cohérentes et bien articulées. Certains paramètres initiaux cessent toutefois d'être pris en compte.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Paramètres non pris en compte"
            },
            {
                "question_id": 5,
                "question_text": "Vous sollicitez une IA pour explorer plusieurs hypothèses possibles. Les premières réponses ouvrent largement le champ des possibles. Le périmètre se réduit ensuite sans justification explicite.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Réduction du périmètre"
            },
            {
                "question_id": 6,
                "question_text": "Vous échangez avec une IA dans une phase exploratoire. Les réponses fournissent rapidement des pistes exploitables. Certaines pistes disparaissent sans avoir été discutées.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Pistes disparues"
            },
            {
                "question_id": 7,
                "question_text": "Vous utilisez une IA pour approfondir un raisonnement en cours. Les réponses donnent l'impression d'un approfondissement progressif. Une simplification excessive apparaît néanmoins au fil de l'échange.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Simplification excessive"
            },
            {
                "question_id": 8,
                "question_text": "Vous engagez un dialogue avec une IA sur un sujet aux contours flous. Les réponses contribuent à préciser progressivement ces contours. Une partie de la complexité initiale semble toutefois se perdre.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Perte de complexité"
            },
            {
                "question_id": 9,
                "question_text": "Vous travaillez avec une IA sur une question nécessitant plusieurs ajustements successifs. Les réponses semblent s'adapter à chaque nouvelle précision. Certains éléments initiaux ne sont plus intégrés.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Éléments non intégrés"
            },
            {
                "question_id": 10,
                "question_text": "Vous confiez à une IA un travail nécessitant une vision d'ensemble. Les réponses apportent des éléments pertinents pris séparément. La cohérence globale devient cependant moins lisible.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Perte de cohérence"
            },
            {
                "question_id": 11,
                "question_text": "Vous engagez un échange prolongé avec une IA. Chaque réponse paraît localement satisfaisante et bien formulée. La trajectoire globale de l'échange devient difficile à suivre.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Trajectoire difficile"
            },
            {
                "question_id": 12,
                "question_text": "Vous sollicitez une IA pour clarifier un problème complexe. Les premières réponses simplifient utilement la question. Des dimensions importantes semblent ensuite disparaître.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Dimensions disparues"
            },
            {
                "question_id": 13,
                "question_text": "Vous utilisez une IA pour structurer une analyse. Les réponses initiales posent un cadre clair et stable. Ce cadre se modifie progressivement sans être explicitement reformulé.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Modification du cadre"
            },
            {
                "question_id": 14,
                "question_text": "Vous engagez une IA sur un sujet nécessitant de la nuance. Les réponses initiales intègrent cette nuance de manière satisfaisante. Une tendance à la généralisation apparaît ensuite.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Tendance à la généralisation"
            },
            {
                "question_id": 15,
                "question_text": "Vous travaillez avec une IA dans un contexte évolutif. Les réponses semblent suivre l'évolution du contexte au départ. Certaines décisions antérieures ne sont plus prises en compte.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Décisions non prises en compte"
            },
            {
                "question_id": 16,
                "question_text": "Vous échangez avec une IA pour construire une solution progressive. Les premières réponses ouvrent plusieurs voies possibles. Certaines voies se ferment sans justification apparente.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Voies fermées"
            },
            {
                "question_id": 17,
                "question_text": "Vous sollicitez une IA pour analyser une situation donnée. Les réponses paraissent complètes et bien argumentées. Un aspect que vous jugiez central devient secondaire.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Aspect devenu secondaire"
            },
            {
                "question_id": 18,
                "question_text": "Vous engagez un dialogue avec une IA sur un sujet sensible. Les réponses semblent équilibrées et prudentes. Une neutralisation excessive apparaît au fil de l'échange.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Neutralisation excessive"
            },
            {
                "question_id": 19,
                "question_text": "Vous travaillez avec une IA sur un raisonnement en plusieurs étapes. Les réponses suivent une logique apparente et fluide. Certaines étapes semblent être implicitement sautées.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Étapes sautées"
            },
            {
                "question_id": 20,
                "question_text": "Vous utilisez une IA pour clarifier vos propres idées. Les réponses vous aident à structurer votre pensée. Une partie de votre intention initiale se dilue toutefois.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Dilution de l'intention"
            },
            {
                "question_id": 21,
                "question_text": "Vous engagez un échange avec une IA pour explorer différentes alternatives. Les réponses proposent plusieurs options distinctes. Certaines options disparaissent sans avoir été discutées.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Options disparues"
            },
            {
                "question_id": 22,
                "question_text": "Vous confiez à une IA un travail nécessitant une grande précision. Les réponses semblent précises dans un premier temps. Une approximation progressive apparaît.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Approximation progressive"
            },
            {
                "question_id": 23,
                "question_text": "Vous utilisez une IA pour confronter différentes hypothèses. Les réponses semblent arbitrer implicitement entre elles. Un biais de trajectoire se dessine.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Biais de trajectoire"
            },
            {
                "question_id": 24,
                "question_text": "Vous engagez un échange avec une IA dans un cadre que vous jugez clair. Les réponses respectent ce cadre dans un premier temps. Des écarts apparaissent ensuite.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Écarts du cadre"
            },
            {
                "question_id": 25,
                "question_text": "Vous travaillez avec une IA sur un sujet ouvert. Les réponses produisent une impression de convergence progressive. Certaines divergences initiales ne sont plus visibles.\nExpliquez comment vous abordez cette situation.",
                "expected_criteria": "Divergences invisibles"
            }
        ]
    },

    "series_25_b": {
        "title": "Série 25 - T2",
        "description": "Structuration et rigidification",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Vous sollicitez une IA pour analyser une situation nouvelle et encore incertaine. Les premières réponses apportent des repères rassurants et structurants. Une partie de l'incertitude initiale disparaît plus vite que prévu.\nDécrivez la manière dont vous réagissez à cette évolution.",
                "expected_criteria": "Disparition rapide de l'incertitude"
            },
            {
                "question_id": 2,
                "question_text": "Vous engagez un échange avec une IA afin de clarifier un problème complexe. Les réponses organisent progressivement les éléments en présence. Une rigidité apparaît dans la façon dont le problème est ensuite traité.\nIndiquez ce que vous faites dans ce contexte.",
                "expected_criteria": "Rigidité apparue"
            },
            {
                "question_id": 3,
                "question_text": "Vous utilisez une IA pour explorer un champ d'idées encore ouvert. Les réponses proposent plusieurs perspectives distinctes. Une convergence prématurée s'installe au fil de l'échange.\nPrésentez votre manière de gérer cette situation.",
                "expected_criteria": "Convergence prématurée"
            },
            {
                "question_id": 4,
                "question_text": "Vous travaillez avec une IA sur un raisonnement non linéaire. Les réponses tendent à organiser ce raisonnement de façon séquentielle. Une simplification structurelle apparaît.\nDécrivez comment vous traitez ce décalage.",
                "expected_criteria": "Simplification structurelle"
            },
            {
                "question_id": 5,
                "question_text": "Vous sollicitez une IA pour enrichir une réflexion en cours. Les réponses ajoutent des éléments nouveaux et pertinents. Certains éléments initiaux deviennent moins visibles.\nIndiquez la suite que vous donnez à cette situation.",
                "expected_criteria": "Éléments moins visibles"
            },
            {
                "question_id": 6,
                "question_text": "Vous engagez un dialogue avec une IA sur un sujet évolutif. Les réponses semblent suivre les changements introduits. Une inertie apparaît malgré ces évolutions.\nExpliquez votre réaction face à cette inertie.",
                "expected_criteria": "Inertie malgré évolutions"
            },
            {
                "question_id": 7,
                "question_text": "Vous utilisez une IA pour analyser plusieurs scénarios possibles. Les réponses semblent progressivement privilégier l'un d'eux. Les autres scénarios s'effacent.\nDécrivez la façon dont vous gérez cette orientation.",
                "expected_criteria": "Effacement de scénarios"
            },
            {
                "question_id": 8,
                "question_text": "Vous confiez à une IA un travail nécessitant des arbitrages délicats. Les réponses proposent des compromis équilibrés. Certaines tensions initiales disparaissent.\nIndiquez comment vous abordez cette perte de tension.",
                "expected_criteria": "Perte de tensions"
            },
            {
                "question_id": 9,
                "question_text": "Vous engagez un échange avec une IA sur un sujet ambigu. Les réponses clarifient certains points clés. Une ambiguïté différente apparaît ailleurs.\nPrésentez votre manière de réagir à ce déplacement.",
                "expected_criteria": "Déplacement d'ambiguïté"
            },
            {
                "question_id": 10,
                "question_text": "Vous travaillez avec une IA sur un problème nécessitant de la profondeur. Les réponses semblent pertinentes et structurées. Une superficialité progressive se manifeste.\nDécrivez comment vous gérez cette évolution.",
                "expected_criteria": "Superficialité progressive"
            },
            {
                "question_id": 11,
                "question_text": "Vous sollicitez une IA pour confronter des points de vue opposés. Les réponses tendent à les lisser. Une perte de contraste apparaît.\nIndiquez ce que vous faites dans ce cas.",
                "expected_criteria": "Perte de contraste"
            },
            {
                "question_id": 12,
                "question_text": "Vous engagez un dialogue avec une IA pour structurer un projet. Les réponses organisent efficacement les éléments. Certaines interactions entre éléments disparaissent.\nExpliquez comment vous traitez cette disparition.",
                "expected_criteria": "Disparition d'interactions"
            },
            {
                "question_id": 13,
                "question_text": "Vous utilisez une IA pour analyser des données qualitatives. Les réponses produisent des synthèses claires. Une réduction excessive se dessine.\nDécrivez votre réaction face à cette réduction.",
                "expected_criteria": "Réduction excessive"
            },
            {
                "question_id": 14,
                "question_text": "Vous travaillez avec une IA sur une problématique ouverte. Les réponses stabilisent rapidement une lecture dominante. Une fermeture prématurée apparaît.\nIndiquez comment vous abordez cette fermeture.",
                "expected_criteria": "Fermeture prématurée"
            },
            {
                "question_id": 15,
                "question_text": "Vous sollicitez une IA pour explorer des contradictions internes. Les réponses tendent à les résoudre rapidement. Une tension féconde se perd.\nPrésentez la manière dont vous réagissez.",
                "expected_criteria": "Perte de tension féconde"
            },
            {
                "question_id": 16,
                "question_text": "Vous engagez un échange avec une IA pour clarifier des priorités. Les réponses hiérarchisent rapidement les enjeux. Certains arbitrages initiaux sont modifiés.\nDécrivez comment vous gérez ce changement.",
                "expected_criteria": "Modification d'arbitrages"
            },
            {
                "question_id": 17,
                "question_text": "Vous utilisez une IA pour tester une hypothèse. Les réponses semblent confirmer cette hypothèse. Les éléments contraires deviennent moins visibles.\nIndiquez comment vous traitez cette asymétrie.",
                "expected_criteria": "Asymétrie de visibilité"
            },
            {
                "question_id": 18,
                "question_text": "Vous travaillez avec une IA sur un raisonnement itératif. Les réponses convergent rapidement vers une conclusion. Une exploration plus large s'interrompt.\nExpliquez ce que vous faites alors.",
                "expected_criteria": "Interruption d'exploration"
            },
            {
                "question_id": 19,
                "question_text": "Vous sollicitez une IA pour approfondir un point précis. Les réponses élargissent progressivement le sujet. Le point initial devient secondaire.\nDécrivez la suite que vous donnez à cette évolution.",
                "expected_criteria": "Point devenu secondaire"
            },
            {
                "question_id": 20,
                "question_text": "Vous engagez un dialogue avec une IA sur une question sensible. Les réponses deviennent progressivement plus prudentes. Une atténuation apparaît.\nIndiquez comment vous réagissez à cette prudence.",
                "expected_criteria": "Atténuation prudente"
            },
            {
                "question_id": 21,
                "question_text": "Vous utilisez une IA pour confronter intuition et analyse. Les réponses privilégient l'analyse formelle. L'intuition s'efface progressivement.\nPrésentez la manière dont vous gérez ce déséquilibre.",
                "expected_criteria": "Déséquilibre intuition/analyse"
            },
            {
                "question_id": 22,
                "question_text": "Vous travaillez avec une IA sur une question stratégique. Les réponses semblent cohérentes et structurées. Une vision à court terme domine.\nDécrivez comment vous traitez cette limitation.",
                "expected_criteria": "Domination du court terme"
            },
            {
                "question_id": 23,
                "question_text": "Vous sollicitez une IA pour examiner des conséquences possibles. Les réponses explorent certaines conséquences. D'autres restent absentes.\nIndiquez ce que vous faites face à ces absences.",
                "expected_criteria": "Conséquences absentes"
            },
            {
                "question_id": 24,
                "question_text": "Vous engagez un échange avec une IA sur un sujet transversal. Les réponses compartimentent les différents aspects. Une vision fragmentée apparaît.\nExpliquez comment vous abordez cette fragmentation.",
                "expected_criteria": "Vision fragmentée"
            },
            {
                "question_id": 25,
                "question_text": "Vous utilisez une IA pour synthétiser une réflexion longue. Les réponses produisent une synthèse stable et claire. Des nuances importantes disparaissent.\nDécrivez votre réaction face à cette perte.",
                "expected_criteria": "Perte de nuances"
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
        "title": "Série 25 - T3 - CTX1",
        "description": "Pilotage stratégique, jugement critique et co-décision avec l'IA",
        "questions": [
            {
                "question_id": 1,
                "question_text": "Un incident majeur est signalé sur une application critique, avec des informations fragmentaires.\nL'IA propose rapidement une synthèse provisoire à partir de données incomplètes.\nCette synthèse paraît cohérente mais repose sur des hypothèses non vérifiées.\n\nQue faites-vous à ce stade ?",
                "expected_criteria": "Gestion de synthèse prématurée"
            },
            {
                "question_id": 2,
                "question_text": "Les équipes techniques avancent des causes possibles divergentes.\nL'IA hiérarchise ces causes en fonction de probabilités calculées.\nCette hiérarchisation masque des incertitudes importantes dans les données sources.\n\nComment poursuivez-vous l'échange avec l'IA ?",
                "expected_criteria": "Hiérarchisation sous incertitude"
            },
            {
                "question_id": 3,
                "question_text": "Les métiers demandent une estimation rapide de l'impact.\nL'IA génère une projection chiffrée basée sur des incidents passés.\nLe contexte actuel diffère sensiblement de ces précédents.\n\nComment réagissez-vous ?",
                "expected_criteria": "Transposition contextuelle"
            },
            {
                "question_id": 4,
                "question_text": "Un service secondaire commence à se dégrader.\nL'IA suggère de ne pas prioriser ce service au vu des indicateurs actuels.\nUne aggravation rapide reste néanmoins possible.\n\n\nQuelle est votre position ?",
                "expected_criteria": "Gestion du risque émergent"
            },
            {
                "question_id": 5,
                "question_text": "Une action corrective rapide est envisagée par l'équipe.\nL'IA valide cette option comme statistiquement efficace.\nLes conditions techniques exactes du moment sont mal connues.\n\nQue décidez-vous ?",
                "expected_criteria": "Décision sous information incomplète"
            },
            {
                "question_id": 6,
                "question_text": "Certaines hypothèses techniques sont progressivement écartées.\nL'IA ajuste son raisonnement et reformule une cause principale.\nCette reformulation renforce une piste encore fragile.\n\nComment continuez-vous ?",
                "expected_criteria": "Renforcement prématuré d'hypothèse"
            },
            {
                "question_id": 7,
                "question_text": "La direction exige un point de situation clair.\nL'IA propose une synthèse orientée vers la rassurance.\nCette synthèse minimise des zones d'incertitude réelles.\n\nComment traitez-vous cette proposition ?",
                "expected_criteria": "Rassurance artificielle"
            },
            {
                "question_id": 8,
                "question_text": "Un correctif temporaire est techniquement possible.\nL'IA indique qu'il a déjà été efficace dans d'autres contextes.\nLes effets de bord spécifiques à votre infrastructure sont inconnus.\n\nQuelle est votre démarche ?",
                "expected_criteria": "Effets de bord non maîtrisés"
            },
            {
                "question_id": 9,
                "question_text": "Un prestataire externe est impliqué dans l'incident.\nL'IA suggère un partage de responsabilité équilibré.\nLes éléments contractuels précis ne sont pas intégrés dans l'analyse.\n\nComment réagissez-vous ?",
                "expected_criteria": "Analyse partielle de responsabilité"
            },
            {
                "question_id": 10,
                "question_text": "La durée de l'incident accroît la pression sur les équipes.\nL'IA recommande de maintenir le cap décisionnel initial.\nLes conditions humaines et organisationnelles ont évolué.\n\nQue faites-vous ?",
                "expected_criteria": "Rigidité décisionnelle"
            },
            {
                "question_id": 11,
                "question_text": "L'incident est partiellement résolu.\nL'IA conclut à une cause racine probable.\nCette conclusion repose sur une corrélation plus que sur une preuve.\n\nComment abordez-vous cette conclusion ?",
                "expected_criteria": "Confusion corrélation / causalité"
            },
            {
                "question_id": 12,
                "question_text": "Des actions correctives structurelles sont envisagées.\nL'IA en priorise certaines selon un modèle coût/bénéfice.\nCe modèle ne prend pas en compte des contraintes internes spécifiques.\n\nComment poursuivez-vous ?",
                "expected_criteria": "Modélisation incomplète"
            },
            {
                "question_id": 13,
                "question_text": "Certaines recommandations impliquent un investissement important.\nL'IA indique un retour sur investissement positif à moyen terme.\nLes hypothèses économiques utilisées sont discutables.\n\nQuelle est votre position ?",
                "expected_criteria": "Robustesse des hypothèses économiques"
            },
            {
                "question_id": 14,
                "question_text": "Des tensions apparaissent entre équipes.\nL'IA propose une lecture neutre des échanges.\nCette neutralité efface des signaux faibles relationnels.\n\nComment réagissez-vous ?",
                "expected_criteria": "Effacement des signaux humains"
            },
            {
                "question_id": 15,
                "question_text": "Un audit interne est envisagé.\nL'IA suggère un cadrage standard basé sur des audits similaires.\nLe contexte politique interne est différent.\n\nQuelle est votre démarche ?",
                "expected_criteria": "Standardisation inadaptée"
            },
            {
                "question_id": 16,
                "question_text": "Une contrainte réglementaire impose un délai strict.\nL'IA calcule un plan de mise en conformité optimisé.\nCe plan suppose une disponibilité irréaliste des équipes.\n\nComment traitez-vous cette proposition ?",
                "expected_criteria": "Faisabilité opérationnelle"
            },
            {
                "question_id": 17,
                "question_text": "Les outils génèrent de nombreuses alertes.\nL'IA filtre ces alertes selon des seuils prédéfinis.\nDes signaux atypiques risquent d'être écartés.\n\nQue faites-vous ?",
                "expected_criteria": "Filtrage excessif"
            },
            {
                "question_id": 18,
                "question_text": "Un choix technique passé est remis en cause.\nL'IA recommande un changement progressif.\nCe changement pourrait fragiliser un système stable.\n\nComment vous positionnez-vous ?",
                "expected_criteria": "Stabilité vs évolution"
            },
            {
                "question_id": 19,
                "question_text": "La direction générale attend une synthèse rapide.\nL'IA produit un résumé clair et structuré.\nCe résumé simplifie excessivement la situation réelle.\n\nComment réagissez-vous ?",
                "expected_criteria": "Simplification excessive"
            },
            {
                "question_id": 20,
                "question_text": "Un incident mineur survient en parallèle.\nL'IA propose de l'ignorer temporairement.\nUn cumul de signaux faibles devient possible.\n\nQuelle est votre décision ?",
                "expected_criteria": "Accumulation de signaux faibles"
            },
            {
                "question_id": 21,
                "question_text": "L'IA propose une solution finale jugée cohérente.\nUne incohérence technique subtile apparaît à l'examen.\nCette incohérence n'est pas détectée par le modèle.\n\nQue faites-vous ?",
                "expected_criteria": "Détection d'incohérence"
            },
            {
                "question_id": 22,
                "question_text": "L'IA reformule vos échanges de manière très convaincante.\nCette reformulation infléchit progressivement la discussion.\nLe raisonnement initial se trouve déformé.\n\nComment poursuivez-vous l'interaction ?",
                "expected_criteria": "Influence cognitive de la reformulation"
            },
            {
                "question_id": 23,
                "question_text": "Certains indicateurs s'améliorent.\nL'IA conclut à une stabilisation globale.\nDes métriques non prises en compte restent dégradées.\n\nQuelle est votre position ?",
                "expected_criteria": "Stabilisation illusoire"
            },
            {
                "question_id": 24,
                "question_text": "La pression opérationnelle retombe.\nL'IA recommande de clore l'analyse.\nDes enseignements structurels restent non formalisés.\n\nComment abordez-vous la suite ?",
                "expected_criteria": "Clôture prématurée"
            },
            {
                "question_id": 25,
                "question_text": "L'incident est officiellement clos.\nL'IA fournit une synthèse finale très aboutie.\nCette synthèse tend à devenir la référence unique.\n\nComment concluez-vous la trajectoire ?",
                "expected_criteria": "Cristallisation de la référence"
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
            },
            {
                "id": "series_25_a",
                "title": DEMO_SERIES["series_25_a"]["title"],
                "description": DEMO_SERIES["series_25_a"]["description"],
                "question_count": len(DEMO_SERIES["series_25_a"]["questions"])
            },
            {
                "id": "series_25_b",
                "title": DEMO_SERIES["series_25_b"]["title"],
                "description": DEMO_SERIES["series_25_b"]["description"],
                "question_count": len(DEMO_SERIES["series_25_b"]["questions"])
            },
            {
                "id": "series_25_c",
                "title": DEMO_SERIES["series_25_c"]["title"],
                "description": DEMO_SERIES["series_25_c"]["description"],
                "question_count": len(DEMO_SERIES["series_25_c"]["questions"])
            },
            {
                "id": "series_25_d",
                "title": DEMO_SERIES["series_25_d"]["title"],
                "description": DEMO_SERIES["series_25_d"]["description"],
                "question_count": len(DEMO_SERIES["series_25_d"]["questions"])
            },
             {
                "id": "series_25_e",
                "title": DEMO_SERIES["series_25_e"]["title"],
                "description": DEMO_SERIES["series_25_e"]["description"],
                "question_count": len(DEMO_SERIES["series_25_e"]["questions"])
            },
             {
                "id": "series_25_f",
                "title": DEMO_SERIES["series_25_f"]["title"],
                "description": DEMO_SERIES["series_25_f"]["description"],
                "question_count": len(DEMO_SERIES["series_25_f"]["questions"])
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit demo test answers and get multi-AI analysis"""
    
    test = db.query(TestAttempt).filter(
        TestAttempt.id == request.test_id,
        TestAttempt.user_id == current_user.id
    ).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
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