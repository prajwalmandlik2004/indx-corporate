'use client';

import Link from 'next/link';
import { Brain, Target, TrendingUp, Shield, Users, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="py-5 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Hero Poster Section */}

        {/* <section className="w-full mt-[-120] hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px]">
              <img
                src="/hero.jpg"
                alt="INDX Hero - Cognitive Steering Evaluation"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section> */}

        <div className="max-w-7xl mx-auto mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-7">

               <div className="space-y-2">
                <h1 className="text-3xl sm:text-3xl lg:text-3xl font-bold leading-tight">
                  INDX
                </h1>

                <p className="text-base font-semibold">
                  Analyse de la trajectoire intercognitive
                </p>

                <p className="text-md text-gray-600">
                  Cadre méthodologique versionné pour l'analyse des interactions humain–IA (INDX-Core v1.0)
                </p>
              </div>

              <div className="text-2xl font-bold">
                ACCUEIL — Vue générale
              </div>

              <div className="space-y-3 text-gray-600 text-base">
                <p>
                  Les systèmes d'intelligence artificielle sont désormais intégrés au cœur des processus analytiques, stratégiques et décisionnels.
                </p>
                <p>
                  Dans ces environnements, la performance ne dépend plus uniquement de la sophistication des modèles ou des outils employés. Elle dépend de la manière dont l'interaction est conduite.
                </p>
                <p>
                  Formuler une intention exploitable.<br></br>
                  Maintenir une direction cohérente.<br></br>
                  Interpréter des retours variables.<br></br>
                  Corriger une dérive sans perdre la maîtrise.
                </p>
                <p className="text-gray-900">
                  Ces capacités déterminent la qualité réelle des résultats.
                </p>
                <p className="text-gray-900">
                  INDX a été conçu pour les mesurer.
                </p>
              </div>
            </div>

            {/* Right Column - Table of Contents - Mobile */}
            <div className="block lg:hidden mt-[-25]">
              <div className="bg-white p-8 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    -
                    <a href="#variable-strategique" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Variable stratégique
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#objet-de-la-mesure" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Objet de la mesure
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#indice-et-trajectoire" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Indice et trajectoire
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#architecture-methodologique" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Architecture méthodologique
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#indx-core" className="hover:text-[#00008B] transition-colors underline ms-2">
                      INDX-Core v1.0
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#champ-application" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Champ d'application
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#risque-organisationnel" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Risque organisationnel
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#cadre-scientifique" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Cadre scientifique
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#gouvernance" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Gouvernance
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#limites" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Limites
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#acces-corporate" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Accès corporate
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-[400px] lg:h-[400px] overflow-hidden shadow-xl">
              <img
                src="/building.png"
                alt="INDX Cognitive Framework"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 1. Variable stratégique */}
      <section id="variable-strategique" className="py-3 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-12 bg-[#00008B] flex-shrink-0"></div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Variable stratégique
                  </h2>
                </div>
              </div>

              <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                <p>
                  À mesure que l'usage de l'IA devient prolongé et intégré aux chaînes décisionnelles, une variable devient déterminante : la capacité humaine à stabiliser une trajectoire d'interaction dans un environnement non déterministe.
                </p>
                <p>
                  Cette capacité n'est ni un trait de personnalité, ni un indicateur d'intelligence générale.
                </p>
                <p>
                  Elle relève de la structuration cognitive dans l'action : pilotage, régulation, cohérence, ajustement.
                </p>
                <p>
                  Elle est rarement objectivée.
                </p>
                <p className="text-gray-900">
                  INDX formalise cette variable.
                </p>
              </div>
            </div>

            {/* Right Column - Table of Contents - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white p-8 rounded-lg sticky top-8">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    -
                    <a href="#variable-strategique" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Variable stratégique
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#objet-de-la-mesure" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Objet de la mesure
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#indice-et-trajectoire" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Indice et trajectoire
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#architecture-methodologique" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Architecture méthodologique
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#indx-core" className="hover:text-[#00008B] transition-colors underline ms-2">
                      INDX-Core v1.0
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#champ-application" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Champ d'application
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#risque-organisationnel" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Risque organisationnel
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#cadre-scientifique" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Cadre scientifique
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#gouvernance" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Gouvernance
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#limites" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Limites
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#acces-corporate" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Accès corporate
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Objet de la mesure */}
      <section id="objet-de-la-mesure" className="py-6 px-4 sm:px-6 lg:px-8 bg-white md:mt-[-65]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-12 bg-[#8B0000] flex-shrink-0"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Objet de la mesure
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              INDX observe la manière dont un individu conduit une interaction avec un système d'intelligence artificielle au fil de phases successives.
            </p>
            <p>
              L'analyse porte sur :
            </p>
            <ul className="list-none space-y-2 pl-6">
              <li>• la construction initiale de l'intention,</li>
              <li>• la cohérence directive dans la durée,</li>
              <li>• la gestion des retours variables,</li>
              <li>• la capacité d'ajustement,</li>
              <li>• la stabilisation finale de la trajectoire.</li>
            </ul>
            <p className="text-gray-900">
              Ce qui est mesuré n'est pas un résultat isolé, mais une dynamique.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Indice et trajectoire */}
      <section id="indice-et-trajectoire" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Indice et trajectoire
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p className="text-gray-900">
              INDX produit un indice unique, issu de l'intégration complète d'une trajectoire observée.
            </p>
            <p>
              Cet indice résulte de l'analyse structurée :
            </p>
            <ul className="list-none space-y-2 pl-6">
              <li>• des ajustements,</li>
              <li>• des pertes de cohérence,</li>
              <li>• des phases de stabilisation,</li>
              <li>• des capacités de récupération.</li>
            </ul>
            <p>
              Il s'agit d'une compression quantitative d'un comportement cognitif en situation d'interaction prolongée.
            </p>
            <p className="text-gray-900">
              L'indice permet la comparabilité entre individus ou équipes dans un protocole identique.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Architecture méthodologique */}
      <section id="architecture-methodologique" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Architecture méthodologique
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              INDX repose sur un protocole séquentiel contrôlé.
            </p>
            <p>
              Les évaluations sont organisées en phases distinctes permettant d'observer :
            </p>
            <ul className="list-none space-y-2 pl-6">
              <li>• la structuration initiale,</li>
              <li>• la réaction à la variation,</li>
              <li>• la stabilisation sous contrainte.</li>
            </ul>
            <p>
              Cette architecture permet de distinguer la compétence déclarative du pilotage effectif.
            </p>
            <p className="text-gray-900">
              L'évaluation est quantitative, reproductible et protocolisée.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INDX-Core v1.0 */}
      <section id="indx-core" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              INDX-Core v1.0
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              Toutes les sessions sont traitées par une architecture de scoring figée et versionnée : INDX-Core v1.0.
            </p>
            <p>
              Le moteur :
            </p>
            <ul className="list-none space-y-2 pl-6">
              <li>• applique des invariants méthodologiques,</li>
              <li>• intègre des seuils régulés de détection de dérive,</li>
              <li>• stabilise les résultats par une logique de scoring contrôlée,</li>
              <li>• garantit la comparabilité dans le cadre défini.</li>
            </ul>
            <p>
              L'architecture est figée à l'échelle de la version.
            </p>
            <p className="text-gray-900">
              Toute évolution fait l'objet d'un nouveau référentiel explicitement identifié.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Champ d'application */}
      <section id="champ-application" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Champ d'application
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              INDX peut être mobilisé dans des contextes où l'IA intervient dans :
            </p>
            <ul className="list-none space-y-2 pl-6">
              <li>• l'analyse stratégique,</li>
              <li>• la préparation de décision,</li>
              <li>• la production intellectuelle,</li>
              <li>• la coordination opérationnelle,</li>
              <li>• la supervision analytique.</li>
            </ul>
            <p className="text-gray-900">
              Il s'adresse aux organisations souhaitant intégrer un critère structuré de pilotage cognitif dans leurs processus de sélection, de validation ou de gouvernance.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Risque organisationnel */}
      <section id="risque-organisationnel" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Risque organisationnel
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              Dans des environnements non déterministes, la dérive ne se manifeste pas toujours par une erreur visible. Elle peut s'installer progressivement dans la formulation, l'interprétation ou l'ajustement.
            </p>
            <p>
              À mesure que la confiance dans les systèmes augmente, le risque n'est plus uniquement technique. Il devient cognitif.
            </p>
            <p className="text-gray-900">
              Ne pas mesurer cette dimension revient à laisser implicite un facteur stratégique.
            </p>
            <p className="text-gray-900">
              INDX introduit une lecture structurée de ce risque.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Cadre scientifique */}
      <section id="cadre-scientifique" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Cadre scientifique
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              INDX s'inscrit dans un champ analytique portant sur la régulation cognitive en interaction avec des systèmes complexes.
            </p>
            <p>
              Le cadre mobilise des apports issus :
            </p>
            <ul className="list-none space-y-2 pl-6">
              <li>• des sciences cognitives,</li>
              <li>• de l'épistémologie,</li>
              <li>• de la théorie des systèmes,</li>
              <li>• de l'analyse décisionnelle.</li>
            </ul>
            <p className="text-gray-900">
              Il considère l'interaction avec l'IA comme un processus dynamique structuré dans le temps.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Gouvernance */}
      <section id="gouvernance" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Gouvernance
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              INDX fonctionne sous un cadre méthodologique versionné.
            </p>
            <p className="text-gray-900">
              L'architecture INDX-Core v1.0 constitue la référence active.
            </p>
            <p>
              Les protocoles sont définis, traçables et reproductibles.
            </p>
            <p>
              Le déploiement s'effectue dans un cadre structuré garantissant la cohérence méthodologique.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Limites */}
      <section id="limites" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Limites
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              INDX observe une capacité située dans des conditions définies.
            </p>
            <p>
              Les résultats doivent être interprétés :
            </p>
            <ul className="list-none space-y-2 pl-6">
              <li>• dans un contexte donné,</li>
              <li>• à un moment donné,</li>
              <li>• en complément d'autres éléments d'analyse.</li>
            </ul>
            <p>
              La mesure ne se substitue pas au jugement humain.
            </p>
            <p className="text-gray-900">
              Elle l'éclaire.
            </p>
          </div>
        </div>
      </section>

      {/* 11. Accès corporate */}
      <section id="acces-corporate" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Accès corporate
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              INDX est proposé sous forme de sessions structurées adaptées aux contextes exécutifs.
            </p>
            <p className="text-gray-900">
              Les engagements sont définis selon le périmètre organisationnel et les objectifs décisionnels.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}