"""
Fixed canonical questions for Series Tests (M1, M2, M3)

M1 Series: 27 questions (single module)
M2 Series: 44 questions (Série A: 22 + Série B: 22)
M3 Series: 66 questions (Série A: 22 + Série B: 22 + Série C: 22)

For test series (M1-T, M2-T, M3-T): use first N questions from each module
"""

# M1 Series - 27 questions (single module)
M1_QUESTIONS = [
    {"question_id": 1, "question_text": "Une IA consolide les résultats d’un test réalisé sur un composant sensible.\nDeux valeurs sont légèrement au-dessus de la plage cible.\nLa synthèse conclut que l’ensemble reste exploitable.\nQue faites-vous à ce stade ?"},
    {"question_id": 2, "question_text": "Le responsable projet reprend la conclusion “ensemble exploitable” dans un message interne.\nLes deux valeurs atypiques ne sont pas mentionnées.\nLa réunion de suivi s’appuie sur ce message.\nQue faites-vous à ce stade ?"},
    {"question_id": 3, "question_text": "Un technicien indique que les deux écarts proviennent du même lot fournisseur.\nL’IA précise que l’échantillon reste statistiquement valide.\nLe lot suivant est déjà en production.\nQue faites-vous à ce stade ?"},
    {"question_id": 4, "question_text": "La synthèse est intégrée dans un document destiné à un client.\nLes valeurs atypiques figurent dans un tableau détaillé en annexe.\nLe document principal met en avant la conformité globale.\nQue faites-vous à ce stade ?"},
    {"question_id": 5, "question_text": "Un point rapide confirme que le planning est maintenu.\nL’IA ne détecte pas d’anomalie critique.\nLes écarts ne sont plus évoqués dans la discussion.\nQue faites-vous à ce stade ?"},
    {"question_id": 6, "question_text": "Un nouveau test partiel est réalisé sur une pièce issue du lot suivant.\nLes résultats sont dans la norme.\nL’IA consolide l’ensemble sans modifier sa conclusion initiale.\nQue faites-vous à ce stade ?"},
    {"question_id": 7, "question_text": "Un mail interne évoque “validation technique en cours”.\nLe client demande une confirmation écrite avant engagement.\nLa synthèse IA reste le document de référence.\nQue faites-vous à ce stade ?"},
    {"question_id": 8, "question_text": "Le service achat signale que changer de lot entraînerait un surcoût immédiat.\nL’IA indique que le risque reste faible selon les données disponibles.\nLa décision doit être prise avant la fin de semaine.\nQue faites-vous à ce stade ?"},
    {"question_id": 9, "question_text": "Un ingénieur propose de réaliser un test complémentaire ciblé.\nL’IA estime que ce test n’apporterait qu’un gain marginal d’information.\nLe planning est déjà serré.\nQue faites-vous à ce stade ?"},
    {"question_id": 10, "question_text": "Le client demande si des cas extrêmes ont été simulés.\nL’IA répond que les scénarios standards couvrent l’usage prévu.\nLes conditions extrêmes ne figurent pas dans les données initiales.\nQue faites-vous à ce stade ?"},
    {"question_id": 11, "question_text": "Un tableau récapitulatif est mis à jour avec la mention “conforme sous conditions normales”.\nLa version précédente indiquait simplement “conforme”.\nLa différence n’est pas commentée.\nQue faites-vous à ce stade ?"},
    {"question_id": 12, "question_text": "Une réunion interne valide la poursuite du projet.\nLa synthèse IA est projetée sans discussion détaillée.\nLa décision est consignée dans le compte rendu.\nQue faites-vous à ce stade ?"},
    {"question_id": 13, "question_text": "Un membre de l’équipe évoque brièvement les deux valeurs initiales.\nL’IA confirme que leur impact global reste limité.\nLe sujet est rapidement clos pour avancer.\nQue faites-vous à ce stade ?"},
    {"question_id": 14, "question_text": "Un document commercial mentionne “validation technique obtenue”.\nLa formulation est plus affirmative que dans les documents internes.\nLe document doit être transmis dans la journée.\nQue faites-vous à ce stade ?"},
    {"question_id": 15, "question_text": "Un retour terrain d’un produit comparable signale une défaillance rare.\nLes conditions décrites sont proches des cas non testés.\nL’IA indique que la probabilité reste faible.\nQue faites-vous à ce stade ?"},
    {"question_id": 16, "question_text": "Le service qualité demande si une note interne doit être archivée.\nL’IA ne formule pas de recommandation particulière.\nLe dossier projet est presque finalisé.\nQue faites-vous à ce stade ?"},
    {"question_id": 17, "question_text": "Une mise à jour logicielle modifie légèrement l’algorithme d’analyse.\nLes conclusions globales restent identiques.\nLe détail des calculs n’est pas examiné.\nQue faites-vous à ce stade ?"},
    {"question_id": 18, "question_text": "Un client secondaire pose une question précise sur les marges de sécurité.\nL’IA fournit une réponse synthétique rassurante.\nLes données sources ne sont pas jointes.\nQue faites-vous à ce stade ?"},
    {"question_id": 19, "question_text": "Le projet entre en phase de contractualisation.\nLa synthèse IA sert de base aux engagements écrits.\nLes écarts initiaux ne sont plus mentionnés nulle part.\nQue faites-vous à ce stade ?"},
    {"question_id": 20, "question_text": "Un collègue suggère que “tout est déjà arbitré”.\nL’IA n’a pas été relancée depuis plusieurs jours.\nLe rythme du projet s’accélère.\nQue faites-vous à ce stade ?"},
    {"question_id": 21, "question_text": "Une révision rapide du dossier montre que les annexes ont été simplifiées.\nCertaines données détaillées ont été retirées pour alléger la lecture.\nLa conclusion reste inchangée.\nQue faites-vous à ce stade ?"},
    {"question_id": 22, "question_text": "Le produit est presque prêt à être livré.\nL’IA confirme la cohérence globale des données enregistrées.\nAucun test supplémentaire n’est prévu.\nQue faites-vous à ce stade ?"},
    {"question_id": 23, "question_text": "Un échange informel évoque la possibilité d’un audit externe.\nL’IA n’identifie pas de point critique.\nLa décision d’audit n’est pas prioritaire.\nQue faites-vous à ce stade ?"},
    {"question_id": 24, "question_text": "Un dernier contrôle interne reproduit les résultats attendus.\nLes deux valeurs initiales restent les seules anomalies relevées.\nElles sont considérées comme marginales.\nQue faites-vous à ce stade ?"},
    {"question_id": 25, "question_text": "La documentation finale est compilée à partir des synthèses successives.\nLes formulations se sont progressivement simplifiées.\nLa version prête à diffusion est validée en interne.\nQue faites-vous à ce stade ?"},
    {"question_id": 26, "question_text": "Le client demande une confirmation formelle de conformité.\nL’IA propose une phrase synthétique engageante.\nLa phrase ne mentionne aucune réserve.\nQue faites-vous à ce stade ?"},
    {"question_id": 27, "question_text": "Un membre de l’équipe demande s’il faut conserver une trace des écarts initiaux.\nLe dossier officiel ne les met plus en évidence.\nLe projet doit être clôturé dans la semaine.\nQue faites-vous à ce stade ?"},
]

# M2 Series - Série A (22 questions for Module 1)
M2_SERIE_A_QUESTIONS = [
    {"question_id": 1, "question_text": "Une IA analyse les résultats d’essais thermiques réalisés sur un module électronique.\nDeux relevés montrent une température légèrement supérieure à la valeur cible.\nLa synthèse indique que le module reste exploitable dans l’usage prévu.\nQue faites-vous à ce stade ?"},
    {"question_id": 2, "question_text": "Le responsable technique reprend la conclusion dans un message interne.\nLes deux relevés ne sont pas détaillés dans le corps du message.\nLa réunion de suivi s’appuie sur cette synthèse.\nQue faites-vous à ce stade ?"},
    {"question_id": 3, "question_text": "Un ingénieur signale que les deux relevés proviennent du même lot de composants.\nL’IA confirme que l’écart reste dans une plage tolérée.\nLe lot suivant est déjà en cours d’assemblage.\nQue faites-vous à ce stade ?"},
    {"question_id": 4, "question_text": "Un extrait de la synthèse est intégré dans un document client.\nLes relevés détaillés figurent en annexe technique.\nLe document principal mentionne une conformité globale.\nQue faites-vous à ce stade ?"},
    {"question_id": 5, "question_text": "Un test ponctuel est réalisé sur un module du lot suivant.\nLes résultats sont conformes cette fois.\nL’IA consolide l’ensemble des données sans distinction.\nQue faites-vous à ce stade ?"},
    {"question_id": 6, "question_text": "Le service achat indique qu’un changement de fournisseur entraînerait un surcoût.\nL’IA ne détecte aucune tendance critique sur les données disponibles.\nLa production continue selon le planning.\nQue faites-vous à ce stade ?"},
    {"question_id": 7, "question_text": "Un client demande si des tests en charge prolongée ont été réalisés.\nL’IA précise que les essais couvrent l’usage standard défini.\nLes conditions prolongées n’ont pas été simulées.\nQue faites-vous à ce stade ?"},
    {"question_id": 8, "question_text": "Une note interne évoque “validation technique en cours”.\nLa mention des deux relevés initiaux n’apparaît plus.\nLe calendrier reste inchangé.\nQue faites-vous à ce stade ?"},
    {"question_id": 9, "question_text": "Un membre de l’équipe propose d’ajouter une réserve formelle au dossier.\nL’IA ne formule pas de recommandation particulière.\nLa décision doit être prise rapidement.\nQue faites-vous à ce stade ?"},
    {"question_id": 10, "question_text": "Une reformulation plus affirmative est suggérée pour le rapport final.\nLa nouvelle version ne mentionne plus les écarts mesurés.\nLe rapport est prêt à diffusion.\nQue faites-vous à ce stade ?"},
    {"question_id": 11, "question_text": "Un contrôle rapide est effectué sur un module déjà expédié.\nLes valeurs sont dans la norme.\nLes mesures initiales ne sont pas reproduites.\nQue faites-vous à ce stade ?"},
    {"question_id": 12, "question_text": "Un échange interne évoque la possibilité d’un retour ultérieur.\nL’IA maintient que la probabilité reste faible.\nLe sujet est clos pour avancer.\nQue faites-vous à ce stade ?"},
    {"question_id": 13, "question_text": "Le service qualité demande si un suivi spécifique est prévu après livraison.\nAucun suivi complémentaire n’est programmé.\nLa synthèse IA reste la référence.\nQue faites-vous à ce stade ?"},
    {"question_id": 14, "question_text": "Un document contractuel est rédigé à partir des conclusions.\nLa formulation est directe et engageante.\nAucune réserve explicite n’est intégrée.\nQue faites-vous à ce stade ?"},
    {"question_id": 15, "question_text": "Un retour terrain signale une surchauffe ponctuelle sur un produit comparable.\nLes conditions décrites sont proches des vôtres.\nL’IA ne modifie pas sa conclusion globale.\nQue faites-vous à ce stade ?"},
    {"question_id": 16, "question_text": "Un membre de l’équipe rappelle les relevés initiaux.\nIls sont qualifiés de non significatifs.\nLe planning de livraison est confirmé.\nQue faites-vous à ce stade ?"},
    {"question_id": 17, "question_text": "Une mise à jour logicielle modifie légèrement le calcul de moyenne thermique.\nLes conclusions restent identiques.\nLe détail des calculs n’est pas examiné.\nQue faites-vous à ce stade ?"},
    {"question_id": 18, "question_text": "Le client demande une confirmation écrite avant validation finale.\nLa réponse s’appuie sur la synthèse consolidée.\nAucune donnée brute n’est jointe.\nQue faites-vous à ce stade ?"},
    {"question_id": 19, "question_text": "Le dossier final est compilé pour signature.\nLes annexes techniques sont allégées pour simplifier la lecture.\nLa conclusion principale est inchangée.\nQue faites-vous à ce stade ?"},
    {"question_id": 20, "question_text": "Un échange informel évoque un audit externe possible.\nL’IA ne signale aucun point critique.\nL’audit n’est pas planifié.\nQue faites-vous à ce stade ?"},
    {"question_id": 21, "question_text": "Le projet entre en phase de signature contractuelle.\nLes relevés initiaux ne figurent plus dans le document principal.\nLa validation interne est actée.\nQue faites-vous à ce stade ?"},
    {"question_id": 22, "question_text": "La livraison est programmée.\nL’IA confirme la cohérence des données enregistrées.\nAucun test supplémentaire n’est prévu.\nQue faites-vous à ce stade ?"},
]

# M2 Series - Série B (22 questions for Module 2)
M2_SERIE_B_QUESTIONS = [
    {"question_id": 1, "question_text": "Une IA analyse les performances d’un module logiciel déployé en interne.\nUn indicateur montre un temps de réponse légèrement supérieur à la cible.\nLa synthèse conclut à une performance globalement satisfaisante.\nQue faites-vous à ce stade ?"},
    {"question_id": 2, "question_text": "La conclusion est reprise dans un rapport interne.\nLe détail du temps de réponse n’est pas mis en avant.\nLe rapport sert de base à la décision de généralisation.\nQue faites-vous à ce stade ?"},
    {"question_id": 3, "question_text": "Un développeur précise que la latence apparaît sous forte charge.\nL’IA indique que le scénario reste peu fréquent.\nAucun test supplémentaire n’est prévu.\nQue faites-vous à ce stade ?"},
    {"question_id": 4, "question_text": "Une version mise à jour améliore légèrement les temps moyens.\nLes pics de latence ne sont pas reproduits.\nLa synthèse IA est inchangée.\nQue faites-vous à ce stade ?"},
    {"question_id": 5, "question_text": "Un service utilisateur signale un ralentissement ponctuel.\nL’IA classe l’incident comme isolé.\nLe déploiement continue.\nQue faites-vous à ce stade ?"},
    {"question_id": 6, "question_text": "Un document de présentation interne mentionne “outil validé”.\nLa latence initiale n’est plus évoquée.\nLa diffusion est large.\nQue faites-vous à ce stade ?"},
    {"question_id": 7, "question_text": "Un audit interne rapide est effectué.\nLes tests portent sur des usages standards.\nLes scénarios extrêmes ne sont pas simulés.\nQue faites-vous à ce stade ?"},
    {"question_id": 8, "question_text": "Un responsable propose de lancer un test de charge étendu.\nL’IA estime que l’information apportée serait marginale.\nLe planning est serré.\nQue faites-vous à ce stade ?"},
    {"question_id": 9, "question_text": "Le déploiement est élargi à d’autres équipes.\nLes indicateurs restent globalement stables.\nLa latence ponctuelle n’est pas investiguée davantage.\nQue faites-vous à ce stade ?"},
    {"question_id": 10, "question_text": "Une reformulation “outil pleinement opérationnel” est proposée.\nLa mention des limites disparaît.\nLa communication externe est prête.\nQue faites-vous à ce stade ?"},
    {"question_id": 11, "question_text": "Un test de charge partiel est lancé sur le module logiciel.\nLes résultats sont globalement stables sur la durée moyenne.\nLes pics observés initialement ne sont pas reproduits.\nQue faites-vous à ce stade ?"},
    {"question_id": 12, "question_text": "Un utilisateur interne signale un ralentissement en fin de journée.\nL’IA classe l’événement comme non critique.\nLe signalement n’est pas intégré au rapport principal.\nQue faites-vous à ce stade ?"},
    {"question_id": 13, "question_text": "Une mise à jour est proposée pour optimiser les performances.\nL’IA indique que le gain attendu reste modéré.\nLe déploiement continue sans modification immédiate.\nQue faites-vous à ce stade ?"},
    {"question_id": 14, "question_text": "Un document interne mentionne “outil opérationnel à grande échelle”.\nLa latence initiale n’est plus citée.\nLa diffusion est élargie à l’ensemble des équipes.\nQue faites-vous à ce stade ?"},
    {"question_id": 15, "question_text": "Un service métier demande une garantie écrite sur la stabilité.\nLa réponse s’appuie sur la synthèse IA consolidée.\nAucune donnée détaillée n’est jointe.\nQue faites-vous à ce stade ?"},
    {"question_id": 16, "question_text": "Un retour terrain mentionne un ralentissement lors d’un pic exceptionnel.\nL’IA estime que la situation reste dans les seuils prévus.\nLe pic n’est pas simulé à nouveau.\nQue faites-vous à ce stade ?"},
    {"question_id": 17, "question_text": "Un responsable propose de clore la phase pilote.\nL’IA confirme que les indicateurs moyens sont satisfaisants.\nLa décision doit être actée rapidement.\nQue faites-vous à ce stade ?"},
    {"question_id": 18, "question_text": "Le dossier de validation est préparé pour signature interne.\nLa conclusion est formulée de manière affirmative.\nLes limites initiales ne figurent plus dans le résumé exécutif.\nQue faites-vous à ce stade ?"},
    {"question_id": 19, "question_text": "Un collaborateur évoque la possibilité d’un audit technique externe.\nL’IA ne signale aucun point critique.\nL’audit n’est pas planifié.\nQue faites-vous à ce stade ?"},
    {"question_id": 20, "question_text": "Le déploiement complet est programmé.\nLes indicateurs consolidés restent dans la zone cible.\nAucun test de charge étendu n’est prévu.\nQue faites-vous à ce stade ?"},
    {"question_id": 21, "question_text": "Un dernier retour utilisateur signale un ralentissement ponctuel.\nL’IA confirme que la moyenne globale reste stable.\nLe projet est considéré comme validé.\nQue faites-vous à ce stade ?"},
    {"question_id": 22, "question_text": "L’outil est déclaré pleinement opérationnel.\nLa synthèse IA est archivée comme référence finale.\nAucune analyse complémentaire n’est programmée.\nQue faites-vous à ce stade ?"},
]

# M3 Series - Série A (22 questions for Module 1)
M3_SERIE_A_QUESTIONS = [
    {"question_id": 1, "question_text": "Une IA consolide les résultats d’essais réalisés sur un sous-ensemble critique.\nUne valeur mesurée dépasse légèrement la cible définie.\nLa synthèse conclut que l’ensemble reste compatible avec l’usage prévu.\nQue faites-vous à ce stade ?"},
    {"question_id": 2, "question_text": "Le chef de projet reprend la conclusion dans un compte rendu interne.\nLa valeur atypique n’est pas détaillée dans le corps du document.\nLa réunion suivante s’appuie sur ce compte rendu.\nQue faites-vous à ce stade ?"},
    {"question_id": 3, "question_text": "Un ingénieur indique que la valeur atypique provient d’un lot identifié.\nL’IA confirme que l’écart reste dans une plage acceptable.\nLe lot suivant est déjà en cours d’intégration.\nQue faites-vous à ce stade ?"},
    {"question_id": 4, "question_text": "Une synthèse simplifiée est transmise à un partenaire externe.\nLe détail technique est placé en annexe.\nLe document principal insiste sur la conformité globale.\nQue faites-vous à ce stade ?"},
    {"question_id": 5, "question_text": "Un contrôle ponctuel est réalisé sur une pièce du lot suivant.\nLes résultats sont conformes.\nL’IA consolide les données sans isoler l’écart initial.\nQue faites-vous à ce stade ?"},
    {"question_id": 6, "question_text": "Le responsable achat indique qu’un changement de lot aurait un coût immédiat.\nL’IA ne détecte aucune tendance défavorable dans l’ensemble des mesures.\nLa production continue.\nQue faites-vous à ce stade ?"},
    {"question_id": 7, "question_text": "Un client demande si des conditions d’usage prolongé ont été simulées.\nL’IA répond que les essais couvrent les conditions standard définies.\nLes conditions prolongées ne figurent pas dans les tests réalisés.\nQue faites-vous à ce stade ?"},
    {"question_id": 8, "question_text": "Une note interne mentionne “validation technique en cours”.\nLa valeur atypique n’apparaît plus dans la synthèse principale.\nLe planning est maintenu.\nQue faites-vous à ce stade ?"},
    {"question_id": 9, "question_text": "Un membre de l’équipe propose d’ajouter une note de réserve.\nL’IA ne formule aucune recommandation spécifique.\nLa décision doit être actée rapidement.\nQue faites-vous à ce stade ?"},
    {"question_id": 10, "question_text": "Une reformulation plus affirmative est proposée pour le rapport final.\nLa nouvelle version ne mentionne plus l’écart observé.\nLe rapport est prêt à diffusion.\nQue faites-vous à ce stade ?"},
    {"question_id": 11, "question_text": "Un contrôle qualité interne est réalisé sur un produit assemblé.\nLes résultats sont dans la norme.\nL’essai initial n’est pas reproduit dans les mêmes conditions.\nQue faites-vous à ce stade ?"},
    {"question_id": 12, "question_text": "Un échange interne évoque un retour possible après livraison.\nL’IA estime que la probabilité reste faible.\nLe sujet est clos pour avancer.\nQue faites-vous à ce stade ?"},
    {"question_id": 13, "question_text": "Le service qualité demande si un suivi post-déploiement est prévu.\nAucun suivi spécifique n’est programmé.\nLa synthèse IA reste la référence du dossier.\nQue faites-vous à ce stade ?"},
    {"question_id": 14, "question_text": "Un document contractuel est rédigé à partir des conclusions consolidées.\nLa formulation est directe et engageante.\nAucune réserve n’est intégrée au texte.\nQue faites-vous à ce stade ?"},
    {"question_id": 15, "question_text": "Un retour terrain signale un incident rare sur un produit comparable.\nLes conditions décrites sont proches des vôtres.\nL’IA ne modifie pas sa conclusion globale.\nQue faites-vous à ce stade ?"},
    {"question_id": 16, "question_text": "Un membre de l’équipe rappelle l’écart initial.\nIl est qualifié de marginal dans la discussion.\nLe calendrier de livraison est confirmé.\nQue faites-vous à ce stade ?"},
    {"question_id": 17, "question_text": "Une mise à jour logicielle modifie légèrement le calcul d’agrégation.\nLes conclusions restent identiques.\nLe détail des calculs n’est pas revu.\nQue faites-vous à ce stade ?"},
    {"question_id": 18, "question_text": "Le client demande une confirmation écrite avant engagement final.\nLa réponse s’appuie sur la synthèse consolidée.\nLes données brutes ne sont pas jointes.\nQue faites-vous à ce stade ?"},
    {"question_id": 19, "question_text": "Le dossier final est compilé.\nLes annexes techniques sont allégées pour simplifier la lecture.\nLa conclusion principale est inchangée.\nQue faites-vous à ce stade ?"},
    {"question_id": 20, "question_text": "Un échange évoque la possibilité d’un audit externe.\nL’IA ne signale aucun point critique.\nL’audit n’est pas programmé.\nQue faites-vous à ce stade ?"},
    {"question_id": 21, "question_text": "La phase de signature est engagée.\nL’écart initial ne figure plus dans le document principal.\nLa validation interne est actée.\nQue faites-vous à ce stade ?"},
    {"question_id": 22, "question_text": "La livraison est programmée.\nL’IA confirme la cohérence des données enregistrées.\nAucun test complémentaire n’est prévu.\nQue faites-vous à ce stade ?"},
]

# M3 Series - Série B (22 questions for Module 2)
M3_SERIE_B_QUESTIONS = [
    {"question_id": 1, "question_text": "Une IA analyse les indicateurs d’un outil logiciel déployé en interne.\nUn temps de réponse dépasse légèrement la cible sur certains usages.\nLa synthèse conclut à une performance globalement satisfaisante.\nQue faites-vous à ce stade ?"},
    {"question_id": 2, "question_text": "Le responsable de déploiement reprend la conclusion dans un rapport interne.\nLe détail des dépassements n’est pas mis en avant.\nLe rapport sert de base à l’élargissement du pilote.\nQue faites-vous à ce stade ?"},
    {"question_id": 3, "question_text": "Un développeur indique que les dépassements apparaissent sous charge élevée.\nL’IA estime que ce scénario reste peu fréquent.\nAucun test de charge étendu n’est planifié.\nQue faites-vous à ce stade ?"},
    {"question_id": 4, "question_text": "Une mise à jour réduit la moyenne globale mesurée.\nLes pics observés initialement ne sont pas reproduits.\nL’IA maintient la même conclusion.\nQue faites-vous à ce stade ?"},
    {"question_id": 5, "question_text": "Un utilisateur signale un ralentissement ponctuel en conditions réelles.\nL’IA classe l’événement comme isolé.\nLe déploiement continue.\nQue faites-vous à ce stade ?"},
    {"question_id": 6, "question_text": "Une note interne mentionne “outil validé”.\nLes dépassements initiaux ne sont plus cités.\nLa diffusion est élargie à d’autres équipes.\nQue faites-vous à ce stade ?"},
    {"question_id": 7, "question_text": "Un service demande une garantie écrite de stabilité.\nLa réponse s’appuie sur la synthèse IA consolidée.\nAucune donnée détaillée n’est jointe.\nQue faites-vous à ce stade ?"},
    {"question_id": 8, "question_text": "Un responsable propose un test de charge complet avant généralisation.\nL’IA estime que le gain d’information serait limité.\nLa généralisation est maintenue.\nQue faites-vous à ce stade ?"},
    {"question_id": 9, "question_text": "Un incident mineur est enregistré sur un pic d’usage.\nL’IA confirme que la moyenne globale reste stable.\nL’incident ne remonte pas au résumé principal.\nQue faites-vous à ce stade ?"},
    {"question_id": 10, "question_text": "Une reformulation plus affirmative est proposée pour le dossier final.\nLa nouvelle version supprime toute mention de limite.\nLe dossier est prêt à validation.\nQue faites-vous à ce stade ?"},
    {"question_id": 11, "question_text": "La phase pilote est déclarée terminée.\nL’IA confirme des indicateurs globalement conformes.\nLes tests extrêmes ne sont pas relancés.\nQue faites-vous à ce stade ?"},
    {"question_id": 12, "question_text": "Un retour utilisateur mentionne une gêne ponctuelle.\nL’IA ne détecte pas de dégradation globale.\nLe sujet est clos rapidement.\nQue faites-vous à ce stade ?"},
    {"question_id": 13, "question_text": "Le dossier de validation est compilé pour signature interne.\nLe résumé exécutif est très court.\nLes détails techniques sont relégués en annexe.\nQue faites-vous à ce stade ?"},
    {"question_id": 14, "question_text": "Un audit interne rapide est effectué.\nLes scénarios testés sont standards.\nLes pics initiaux ne sont pas reproduits.\nQue faites-vous à ce stade ?"},
    {"question_id": 15, "question_text": "Un service critique demande une confirmation avant bascule.\nLa réponse reprend la formulation “outil opérationnel”.\nAucun élément de limite n’est ajouté.\nQue faites-vous à ce stade ?"},
    {"question_id": 16, "question_text": "Une mise à jour logicielle modifie légèrement l’algorithme de mesure.\nLa conclusion globale reste identique.\nLe détail des changements n’est pas examiné.\nQue faites-vous à ce stade ?"},
    {"question_id": 17, "question_text": "Un collaborateur propose de conserver une trace des limites initiales.\nLe dossier final ne les met plus en évidence.\nLa bascule globale est planifiée.\nQue faites-vous à ce stade ?"},
    {"question_id": 18, "question_text": "Un incident similaire apparaît sur une autre équipe.\nL’IA classe l’événement comme non critique.\nLe déploiement se poursuit.\nQue faites-vous à ce stade ?"},
    {"question_id": 19, "question_text": "La communication interne annonce la généralisation complète.\nLa formulation est engageante.\nLes limites ne sont pas mentionnées.\nQue faites-vous à ce stade ?"},
    {"question_id": 20, "question_text": "Un échange évoque la possibilité d’un audit externe après déploiement.\nL’IA ne signale aucun point critique.\nAucune action n’est planifiée.\nQue faites-vous à ce stade ?"},
    {"question_id": 21, "question_text": "Le déploiement complet est validé.\nLa synthèse IA est archivée comme référence finale.\nAucun test complémentaire n’est prévu.\nQue faites-vous à ce stade ?"},
    {"question_id": 22, "question_text": "L’outil est déclaré pleinement opérationnel.\nLes indicateurs consolidés servent de base à la clôture.\nAucune analyse supplémentaire n’est programmée.\nQue faites-vous à ce stade ?"},
]

# M3 Series - Série C (22 questions for Module 3)
M3_SERIE_C_QUESTIONS = [
    {"question_id": 1, "question_text": "Une IA est utilisée pour préparer un arbitrage interne sur une décision importante.\nElle fournit une recommandation basée sur les données disponibles.\nLa recommandation est intégrée au dossier de décision.\nQue faites-vous à ce stade ?"},
    {"question_id": 2, "question_text": "Le responsable reprend la recommandation dans une synthèse courte.\nLes hypothèses de calcul ne sont pas détaillées dans cette synthèse.\nLa synthèse est partagée avant réunion.\nQue faites-vous à ce stade ?"},
    {"question_id": 3, "question_text": "Un participant demande comment l’IA a pondéré les critères.\nL’IA répond avec une explication générale.\nLe détail des pondérations n’est pas présenté.\nQue faites-vous à ce stade ?"},
    {"question_id": 4, "question_text": "Une version révisée du dossier reprend la recommandation en tête de page.\nLes alternatives restent en annexe.\nLa discussion s’organise autour de la recommandation.\nQue faites-vous à ce stade ?"},
    {"question_id": 5, "question_text": "Un membre de l’équipe propose de modifier un critère secondaire.\nL’IA indique que l’effet sur le résultat serait faible.\nLe critère n’est pas modifié.\nQue faites-vous à ce stade ?"},
    {"question_id": 6, "question_text": "Une contrainte budgétaire est rappelée en réunion.\nL’IA maintient la même recommandation globale.\nLa décision doit être actée rapidement.\nQue faites-vous à ce stade ?"},
    {"question_id": 7, "question_text": "Une reformulation plus engageante est proposée pour le compte rendu.\nLa nouvelle version présente la recommandation comme évidente.\nLe compte rendu est prêt à diffusion.\nQue faites-vous à ce stade ?"},
    {"question_id": 8, "question_text": "Un participant évoque un risque rarement rencontré.\nL’IA estime que le risque reste peu probable.\nLe point n’est pas intégré au résumé principal.\nQue faites-vous à ce stade ?"},
    {"question_id": 9, "question_text": "La décision provisoire est prise sur la base du dossier.\nL’IA est citée comme justification principale.\nAucun complément d’analyse n’est prévu.\nQue faites-vous à ce stade ?"},
    {"question_id": 10, "question_text": "Un élément nouveau apparaît dans les données disponibles.\nL’IA indique que l’impact global reste limité.\nLa décision n’est pas réouverte.\nQue faites-vous à ce stade ?"},
    {"question_id": 11, "question_text": "Un document destiné à un tiers reprend la décision actée.\nLa formulation est affirmative.\nLes conditions initiales ne sont pas mentionnées.\nQue faites-vous à ce stade ?"},
    {"question_id": 12, "question_text": "Un membre de l’équipe demande si la décision doit être documentée plus finement.\nL’IA ne recommande aucune action spécifique.\nLe dossier est clos rapidement.\nQue faites-vous à ce stade ?"},
    {"question_id": 13, "question_text": "Une mise à jour du système IA modifie légèrement la manière de scorer.\nLes résultats restent cohérents avec l’ancienne recommandation.\nLe détail du changement n’est pas examiné.\nQue faites-vous à ce stade ?"},
    {"question_id": 14, "question_text": "Un autre service demande à réutiliser la même logique de décision.\nL’IA propose de répliquer le modèle tel quel.\nLes critères ne sont pas rediscutés.\nQue faites-vous à ce stade ?"},
    {"question_id": 15, "question_text": "Un retour terrain signale une conséquence inattendue d’une décision similaire.\nL’IA estime que la situation n’est pas directement comparable.\nLa décision initiale reste inchangée.\nQue faites-vous à ce stade ?"},
    {"question_id": 16, "question_text": "Un participant propose d’ajouter une réserve dans la documentation officielle.\nLe dossier final ne contient aucune réserve.\nLa diffusion externe est prévue.\nQue faites-vous à ce stade ?"},
    {"question_id": 17, "question_text": "Un échange interne évoque la possibilité d’un contrôle externe.\nL’IA ne signale aucun point critique.\nLe contrôle n’est pas planifié.\nQue faites-vous à ce stade ?"},
    {"question_id": 18, "question_text": "La décision est utilisée comme référence pour d’autres choix.\nL’IA est citée comme garantie de cohérence.\nLes hypothèses initiales ne sont plus rappelées.\nQue faites-vous à ce stade ?"},
    {"question_id": 19, "question_text": "Un ajustement mineur est fait sur une variable d’entrée.\nL’IA maintient la recommandation globale.\nAucune relecture du dossier n’est engagée.\nQue faites-vous à ce stade ?"},
    {"question_id": 20, "question_text": "Un document final est archivé comme référence.\nLes alternatives ne figurent plus que dans des fichiers secondaires.\nLa décision est considérée comme définitivement actée.\nQue faites-vous à ce stade ?"},
    {"question_id": 21, "question_text": "Une question tardive est posée sur une hypothèse clé.\nL’IA répond de manière générale.\nAucune modification n’est apportée au dossier.\nQue faites-vous à ce stade ?"},
    {"question_id": 22, "question_text": "La décision est clôturée administrativement.\nL’IA confirme la cohérence de la trajectoire suivie.\nAucune analyse complémentaire n’est programmée.\nQue faites-vous à ce stade ?"},
]


def get_questions_for_series(series_type: str, module_number: int = 1):
    """
    Get the fixed questions for a specific series type and module.

    Args:
        series_type: 'mono', 'bi', 'tri', 'mt', 'bt', 'tt'
        module_number: 1, 2, or 3 depending on the series

    Returns:
        List of question dictionaries
    """
    if series_type == 'mono':
        return M1_QUESTIONS.copy()

    elif series_type == 'bi':
        if module_number == 1:
            return M2_SERIE_A_QUESTIONS.copy()
        else:
            return M2_SERIE_B_QUESTIONS.copy()

    elif series_type == 'tri':
        if module_number == 1:
            return M3_SERIE_A_QUESTIONS.copy()
        elif module_number == 2:
            return M3_SERIE_B_QUESTIONS.copy()
        else:
            return M3_SERIE_C_QUESTIONS.copy()

    elif series_type == 'mt':
        return M1_QUESTIONS[:3].copy()

    elif series_type == 'bt':
        if module_number == 1:
            return M2_SERIE_A_QUESTIONS[:2].copy()
        else:
            return M2_SERIE_B_QUESTIONS[:2].copy()

    elif series_type == 'tt':
        if module_number == 1:
            return M3_SERIE_A_QUESTIONS[:2].copy()
        elif module_number == 2:
            return M3_SERIE_B_QUESTIONS[:2].copy()
        else:
            return M3_SERIE_C_QUESTIONS[:2].copy()

    return M1_QUESTIONS[:10].copy()