'use client';

import Link from 'next/link';
import { BookOpen, Brain, Trophy, Users, ArrowRight, CheckCircle, Zap, Target } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get detailed feedback and insights powered by GPT-4o for comprehensive learning.',
    },
    {
      icon: Target,
      title: 'Multiple Categories',
      description: 'Tests for schools, professionals, technical skills, and corporate assessments.',
    },
    {
      icon: Trophy,
      title: 'Progressive Levels',
      description: 'Five difficulty levels to challenge and track your improvement over time.',
    },
    {
      icon: Users,
      title: 'For Everyone',
      description: 'Perfect for students, professionals, and organizations of all sizes.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Tests Completed' },
    { number: '5K+', label: 'Active Users' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Available' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Compact with Contained Image */}
      <section className="py-5 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-7">
              <div className="text-[#00008B text-3xl font-bold">
                ACCUEIL
              </div>

              <h3 className="text-3xl sm:text-3xl lg:text-3xl font-bold leading-tight text-[#00008B">
                INDX
              </h3>

              <p className="text-base font-semibold text-gray-600">
                Human-AI Cognitive Trajectory Framework
              </p>

              <div className="space-y-3 text-gray-600 text-base">
                <p>
                  INDX mesure la capacité humaine à piloter un
                  projet impliquant une IA, dans la durée.
                  Il s'intéresse à la manière dont l'interaction est
                  structurée et ajustée au fil du projet, en tenant
                  compte des spécificités des systèmes artificiels
                  et de la maîtrise des décisions.
                </p>
              </div>

              {/* <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup" className="bg-[#050E3C] text-white font-semibold py-3 px-6 rounded-none hover:bg-[#050E3C] transition-all duration-300 text-center">
                  Get Started
                </Link>
                <Link href="/about" className="bg-white text-gray-900 font-semibold py-3 px-6 rounded-none hover:bg-gray-100 transition-all duration-300 border border-gray-300 text-center">
                  Learn More
                </Link>
              </div> */}
            </div>


            {/* Right Column - Table of Contents */}
            <div className="block lg:hidden mt-[-25]">
              <div className="bg-white p-8 rounded-lg sticky">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    -
                    <a href="#vue-generale" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Vue générale
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#institutions-publiques" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Institutions publiques
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#institutions-education" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Institutions / Education
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#cas-usages-transsectoriels" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Cas d'usages transsectoriels
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#applications-organisationnelles" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Applications organisationnelles
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#bases-scientifiques" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Bases scientifiques
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#logique-evaluation" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Logique d'évaluation
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#champ-mesures" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Champ de mesures
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#integrations-systemes" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Intégrations systèmes
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#questions-generales" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Questions générales
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#principes-methodologiques" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Principes méthodologiques
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#ethique-limites" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Éthique et limites
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#scenarios-deploiement" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Scénarios de déploiement
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#a-propos-indx" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      À propos d'INDX
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#origine-ais" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Origine et nécessité d'AIS
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* University Building Image */}
            <div className="relative h-[300px] lg:h-[350px] overflow-hidden shadow-xl">
              <img
                src="/home_four.jpg"
                alt="University Campus"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ce que fait concrètement INDX */}
      <section className="py-3 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-12 bg-[#00008B] flex-shrink-0"></div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Ce que fait concrètement INDX
                  </h2>
                </div>
              </div>

              <div id="#vue-generale" className="space-y-3 text-gray-700 text-base leading-relaxed">
                <p>
                  INDX fournit un cadre structuré permettant d'observer, de comparer et d'analyser des trajectoires de pilotage humain face à l'IA, dans des situations réelles ou simulées.
                </p>
                <p>
                  Il met en évidence des écarts de posture, de méthode et de contrôle, indépendamment des outils ou technologies employés.
                </p>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Ce que mesure / ne mesure pas INDX
                </h3>
                <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                  <p>
                    - INDX ne mesure ni la performance des systèmes d'IA, ni le niveau technique des outils utilisés.
                  </p>
                  <p>
                    - Il évalue la capacité humaine à définir un cadre d'usage, à conduire un projet dans la durée et à conserver un contrôle effectif sur les décisions engagées.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Table of Contents */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white p-8 rounded-lg sticky top-8">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    -
                    <a href="#vue-generale" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Vue générale
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#institutions-publiques" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Institutions publiques
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#institutions-education" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Institutions / Education
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#cas-usages-transsectoriels" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Cas d'usages transsectoriels
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#applications-organisationnelles" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Applications organisationnelles
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#bases-scientifiques" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Bases scientifiques
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#logique-evaluation" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Logique d'évaluation
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#champ-mesures" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Champ de mesures
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#integrations-systemes" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Intégrations systèmes
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#questions-generales" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Questions générales
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#principes-methodologiques" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Principes méthodologiques
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#ethique-limites" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Éthique et limites
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#scenarios-deploiement" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Scénarios de déploiement
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#a-propos-indx" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      À propos d'INDX
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#origine-ais" className="hover:text-[#00008B] transition-colors cursor-pointer underline ms-2">
                      Origine et nécessité d'AIS
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* À qui s'adresse INDX */}
      <section id="a-propos-indx" className="lg:-mt-38 py-4 px-4 sm:px-6 lg:px-8 bg-white">   <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-2 h-12 bg-[#8B0000] flex-shrink-0"></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              À qui s'adresse INDX
            </h2>
          </div>
        </div>

        <div id="institutions-publiques" className="space-y-3 text-gray-700 text-base leading-relaxed mb-8">
          <p>
            INDX s'adresse aux individus, organisations et institutions confrontés à l'intégration croissante de l'IA dans leurs processus de réflexion, de décision ou d'action, et qui souhaitent disposer d'un cadre d'analyse rigoureux pour en évaluer les usages.
          </p>
        </div>

        {/* Institutions publiques */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Institutions publiques
          </h3>
          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              L'introduction de l'intelligence artificielle dans les institutions publiques concerne des domaines à fort impact : aide à la décision, analyse de données complexes, orientation des politiques publiques, gestion de services sensibles ou régulés.
            </p>
            <p>
              Dans ces environnements, les risques ne tiennent pas uniquement à la fiabilité technique des systèmes. Ils relèvent largement de la manière dont les résultats sont interprétés, contextualisés, corrigés et intégrés dans des chaînes décisionnelles humaines, souvent longues, distribuées et hiérarchisées. INDX permet d'éclairer ces usages en se concentrant sur les conditions humaines du pilotage cognitif : la capacité à maintenir une cohérence décisionnelle, à gérer l'incertitude produite par des systèmes non déterministes, et à éviter les effets de délégation implicite ou de sur-confiance.
            </p>
            <p id="institutions-education">
              Le cadre s'inscrit dans une logique de lisibilité, de prévention et de gouvernance, et non dans une logique de contrôle automatisé.
            </p>
          </div>
        </div>

        {/* Institutions / Education */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Institutions / Education - Enseignement supérieur et organismes académiques
          </h3>
          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              L'enseignement supérieur est confronté à une transformation profonde de ses modes d'évaluation et de production intellectuelle, liée à l'usage massif de l'IA par les étudiants comme par les enseignants. Dans ce contexte, l'enjeu n'est pas seulement la détection d'usages inappropriés ou la préservation de formes académiques existantes.
            </p>
            <p>
              Il porte sur l'identification de ce qui constitue désormais une différenciation intellectuelle réelle : la capacité à structurer un raisonnement, à maintenir une cohérence cognitive et à conduire une interaction avec l'IA sans perte de maîtrise.
            </p>
            <p>
              INDX offre un cadre permettant d'observer ces capacités de manière transversale, indépendamment des disciplines et des outils utilisés.
            </p>
            <p id="applications-organisationnelles">
              Il peut servir de repère en fin de cycle, de support à des cursus intégrant l'IA de façon structurelle, ou d'outil de réflexion institutionnelle sur l'évolution des critères d'excellence académique.
            </p>
          </div>
        </div>

        {/* Applications organisationnelles */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Applications organisationnelles
          </h3>
          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              Dans les organisations, l'IA est de plus en plus mobilisée dans des fonctions d'analyse, de recommandation, de synthèse ou d'aide à la décision, souvent au cœur de processus stratégiques ou opérationnels. Dans ces contextes, la valeur produite dépend moins des performances brutes des outils que de la qualité du pilotage cognitif exercé par les individus et les équipes qui les utilisent.
            </p>
            <p>
              INDX permet d'observer cette capacité à structurer l'interaction, à ajuster une trajectoire dans le temps et à maintenir un contrôle intellectuel sur des systèmes dont les réponses évoluent.
            </p>
            <p>
              Le cadre peut être utilisé pour comparer des postures, identifier des dérives ou des stabilités, et éclairer des décisions en matière de formation, d'accompagnement ou de gouvernance interne.
            </p>
          </div>
        </div>
      </div>
      </section>

      {/* Cas d'usages transsectoriels */}
      <section id="cas-usages-transsectoriels" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Cas d'usages transsectoriels
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              INDX a été conçu dès l'origine comme un cadre transversal, applicable à des secteurs, des métiers et des environnements très différents, dès lors que l'enjeu porte sur la conduite humaine d'une interaction cognitive avec des systèmes d'IA.
            </p>
            <p>
              Cette transversalité ne repose pas sur une abstraction théorique, mais sur le choix délibéré de se situer en amont des contenus, des outils et des architectures techniques.
            </p>
            <p>
              INDX ne décrit pas ce que fait une IA dans un domaine donné, mais comment un humain organise, stabilise et pilote son interaction avec elle, quelles que soient les finalités poursuivies.
            </p>
            <p className="">Cette approche permet :</p>
            <ul className="list-none space-y-2 pl-0">
              <li>- des lectures comparables entre environnements hétérogènes,</li>
              <li>- l'identification de schémas récurrents de pilotage ou de dérive,</li>
              <li>- une portabilité du cadre entre secteurs soumis à des contraintes très différentes.</li>
            </ul>
            <p>
              La transversalité constitue ainsi l'un des leviers essentiels de la durabilité du cadre, en le rendant indépendant des cycles technologiques et des effets de mode.
            </p>
          </div>
        </div>
      </section>

      {/* Le cadre et la méthode */}
      <section id="bases-scientifiques" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Le cadre et la méthode
            </h2>
          </div>

          {/* Bases scientifiques */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Bases scientifiques
            </h3>
            <div className="space-y-3 text-gray-700 text-base leading-relaxed">
              <p>
                INDX s'appuie sur des apports issus de plusieurs champs théoriques, notamment les sciences cognitives, l'épistémologie, la théorie des systèmes et l'analyse de la décision.
              </p>
              <p>
                Il considère l'interaction avec une IA non comme une simple succession de requêtes et de réponses, mais comme un processus dynamique, structuré dans le temps, où la formulation des intentions, la gestion des retours et la capacité d'interprétation humaine jouent un rôle central.
              </p>
              <p id="principes-methodologiques">
                Cette approche conduit à traiter l'IA comme un système non déterministe, dont la valeur produite dépend étroitement de la qualité du pilotage cognitif exercé par l'utilisateur, et non uniquement de ses performances intrinsèques.
              </p>
            </div>
          </div>

          {/* Principes méthodologiques */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Principes méthodologiques
            </h3>
            <div className="space-y-3 text-gray-700 text-base leading-relaxed">
              <p>
                Le cadre INDX repose sur un ensemble de principes méthodologiques stables, indépendants des contextes d'application.
              </p>
              <p className="">Il privilégie :</p>
              <ul className="list-none space-y-2 pl-0">
                <li>- une observation contextualisée des situations,</li>
                <li>- une distinction claire entre processus cognitifs et résultats obtenus,</li>
                <li>- une lecture longitudinale des interactions, plutôt qu'une évaluation ponctuelle,</li>
                <li>- une indépendance stricte vis-à-vis des technologies, des fournisseurs et des implémentations.</li>
              </ul>
              <p id="logique-evaluation">
                Ces principes visent à garantir que les lectures produites restent comparables, interprétables et robustes dans le temps.
              </p>
            </div>
          </div>

          {/* Logique d'évaluation */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Logique d'évaluation
            </h3>
            <div className="space-y-3 text-gray-700 text-base leading-relaxed">
              <p>
                INDX ne cherche pas à produire un verdict, une note isolée ou un classement.
              </p>
              <p>
                Il vise à situer une posture cognitive à un instant donné et à observer son évolution dans des situations comparables.
              </p>
              <p>
                La logique d'évaluation repose sur l'analyse des écarts, des stabilités et des ajustements successifs dans la conduite de l'interaction avec l'IA.
              </p>
              <p>
                Ce qui est observé n'est pas la conformité à un résultat attendu, mais la manière dont un individu ou un collectif maintient une trajectoire cohérente face à des retours variables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Champ de mesures, Éthique et limites, Scénarios de déploiement */}
      <section id="champ-mesures" className="py-3 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Champ de mesures */}
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Champ de mesures
            </h2>
            <div className="space-y-3 text-gray-700 text-base leading-relaxed">
              <p>
                Le champ de mesures d'INDX porte sur des capacités cognitives spécifiques, mobilisées dans l'interaction avec des systèmes d'IA.
              </p>
              <p className="">Il observe notamment la capacité à :</p>
              <ul className="list-none space-y-2 pl-0">
                <li>- formuler et reformuler une intention exploitable par un système intelligent,</li>
                <li>- maintenir une cohérence intellectuelle dans la durée,</li>
                <li>- ajuster une trajectoire en fonction de retours non prévisibles,</li>
                <li>- exercer un contrôle cognitif effectif, sans rupture ni délégation excessive.</li>
              </ul>
              <p id="ethique-limites">
                Ces dimensions ne visent pas à épuiser la complexité des situations, mais à rendre lisible une dynamique de pilotage jusqu'ici difficilement objectivable.
              </p>
            </div>
          </div>

          {/* Éthique et limites */}
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Éthique et limites
            </h2>
            <div className="space-y-3 text-gray-700 text-base leading-relaxed">
              <p>
                INDX est un cadre d'évaluation, non un instrument de jugement normatif.
              </p>
              <p>
                Il ne vise ni à prédire des comportements futurs, ni à qualifier la valeur intrinsèque d'un individu, d'un groupe ou d'une organisation.
              </p>
              <p className="">Les résultats produits par INDX doivent toujours être interprétés :</p>
              <ul className="list-none space-y-2 pl-0">
                <li>- dans un contexte donné,</li>
                <li>- à un moment donné,</li>
                <li>- en complément d'autres éléments d'analyse.</li>
              </ul>
              <p className="">Le cadre exclut explicitement :</p>
              <ul className="list-none space-y-2 pl-0">
                <li>- toute interprétation automatisée des résultats,</li>
                <li>- tout usage décisionnel direct sans médiation humaine,</li>
                <li>- toute réduction d'une trajectoire cognitive à un indicateur simplifié.</li>
              </ul>
              <p>
                Les principes éthiques qui encadrent INDX reposent notamment sur la transparence méthodologique, la proportionnalité des usages et la contextualisation systématique des lectures produites.
              </p>
              <p id="scenarios-deploiement">
                Ces limites constituent des garde-fous indispensables à un usage responsable du cadre.
              </p>
            </div>
          </div>

          {/* Scénarios de déploiement */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Scénarios de déploiement
            </h2>
            <div className="space-y-3 text-gray-700 text-base leading-relaxed">
              <p>
                INDX a été conçu pour pouvoir être déployé selon des modalités variées, adaptées aux contextes institutionnels, académiques ou organisationnels dans lesquels il est mobilisé.
              </p>
              <p className="">Le cadre peut être utilisé :</p>
              <ul className="list-none space-y-2 pl-0">
                <li>- à des fins d'observation ponctuelle,</li>
                <li>- dans des dispositifs longitudinaux de suivi,</li>
                <li>- comme outil de réflexion collective ou de gouvernance.</li>
              </ul>
              <p>
                Il ne prescrit ni un mode de déploiement unique, ni une fréquence d'évaluation standardisée.
              </p>
              <p>
                Les scénarios d'usage sont définis par les acteurs qui l'adoptent, en fonction de leurs contraintes, de leurs objectifs et de leur maturité institutionnelle.
              </p>
              <p>
                Cette souplesse permet une intégration progressive, sans rupture avec les dispositifs existants, tout en garantissant la cohérence du cadre d'analyse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* À propos d'INDX et Origine d'AIS */}
      <section id="a-propos-indx" className="py-4 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* À propos d'INDX */}
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              À propos d'INDX
            </h2>
            <div className="space-y-3 text-gray-700 text-base leading-relaxed">
              <p>
                INDX est un cadre d'évaluation indépendant, conçu pour analyser une capacité humaine spécifique : la manière dont un individu structure, conduit et stabilise son interaction cognitive avec une intelligence artificielle.
              </p>
              <p className="">Il ne s'agit :</p>
              <ul className="list-none space-y-2 pl-0">
                <li>- ni d'un système d'intelligence artificielle,</li>
                <li>- ni d'un outil d'analyse automatisée,</li>
                <li>- ni d'un dispositif de scoring technologique.</li>
              </ul>
              <p>
                INDX constitue un référentiel conceptuel et méthodologique, applicable quels que soient les systèmes d'IA utilisés, leurs architectures ou leurs modalités d'accès.
              </p>
              <p id="origine-ais">
                Il est destiné à être discuté, éprouvé et adapté à des contextes variés, sans dépendance à une doctrine technologique particulière.
              </p>
            </div>
          </div>

          {/* Origine d'AIS */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Origine d'AIS
            </h2>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Adaptive Intelligence Steering
            </h3>
            <div className="space-y-3 text-gray-700 text-base leading-relaxed">
              <p>
                AIS est né d'une observation structurante : les cadres d'évaluation existants sont devenus insuffisants face à l'essor rapide des systèmes d'intelligence artificielle.
              </p>
              <p>
                Ces cadres mesurent principalement des performances techniques, des connaissances déclarées ou des usages ponctuels.
              </p>
              <p>
                Ils peinent à appréhender une réalité désormais centrale : la capacité humaine à piloter, dans la durée, une interaction cognitive avec des systèmes non déterministes, dont les réponses varient selon le contexte, la formulation et la trajectoire de dialogue.
              </p>
              <p>
                AIS désigne l'approche formulée pour qualifier cette capacité spécifique.
              </p>
              <p>
                Il ne s'agit ni d'une technologie, ni d'un outil, ni d'un modèle d'IA, mais d'un cadre conceptuel d'analyse centré sur le pilotage cognitif humain : orienter l'interaction, interpréter les retours, ajuster la trajectoire et maintenir la maîtrise sans délégation aveugle.
              </p>
              <p>
                AIS a été conçu pour combler ce vide analytique, en proposant un cadre rigoureux permettant de lire et de suivre dans le temps la manière dont cette capacité se construit et s'exerce.
              </p>
              <p>
                INDX constitue la formalisation opérationnelle de cette approche, en offrant un instrument de lecture structuré de cette dynamique de pilotage.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}