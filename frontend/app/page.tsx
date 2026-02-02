'use client';

import Link from 'next/link';
import { Brain, Target, TrendingUp, Shield, Users, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="py-5 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Hero Poster Section */}
        <section className="w-full mt-[-120] hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px]">
              <img
                src="/hero.jpg"
                alt="INDX Hero - Cognitive Steering Evaluation"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto mt-[-50]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-7">
              <div className="text-2xl font-bold">
                ACCUEIL
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-3xl lg:text-3xl font-bold leading-tight">
                  INDX
                </h1>

                <p className="text-base font-semibold">
                  Évaluer le pilotage cognitif humain face aux systèmes artificiels
                </p>
              </div>

              <div className="space-y-3 text-gray-600 text-base">
                <p>
                  Les systèmes artificiels sont désormais des milieux de travail.<br></br>
                  Ils influencent la formulation, la décision, la trajectoire intellectuelle elle-même.
                </p>
                <p>
                  La question n'est plus la performance de la machine.<br></br>
                  La question est la tenue du pilotage humain.
                </p>
                <p className="text-gray-900">
                  INDX a été conçu pour répondre à ce point précis.
                </p>
              </div>
            </div>

            {/* Right Column - Table of Contents - Mobile */}
            <div className="block lg:hidden mt-[-25]">
              <div className="bg-white p-8 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    -
                    <a href="#ce-que-fait-indx" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Ce que fait INDX
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#ce-que-produit-indx" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Ce que produit INDX
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#comparer-sans-simplifier" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Comparer sans simplifier
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#contextualisation" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Contextualisation maîtrisée
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#dispositif-multi-ia" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Dispositif multi-IA
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#pourquoi-maintenant" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Pourquoi maintenant
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#ce-que-vous-obtenez" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Ce que vous obtenez
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-[300px] lg:h-[350px] overflow-hidden shadow-xl">
              <img
                src="/building.png"
                alt="INDX Cognitive Framework"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ce que fait INDX */}
      <section id="ce-que-fait-indx" className="py-3 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-12 bg-[#00008B] flex-shrink-0"></div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Ce que fait INDX
                  </h2>
                </div>
              </div>

              <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                <p>
                  INDX analyse la trajectoire cognitive d'un humain lorsqu'il interagit avec des systèmes
                  artificiels, dont les IA.
                </p>
                <p>
                  Il observe comment une pensée se structure, se maintient, se corrige ou se dégrade au fil
                  d'interactions successives.
                </p>
                <p>
                  L'analyse ne porte ni sur l'opinion, ni sur la culture déclarée, ni sur la qualité immédiate des
                  réponses.
                </p>
                <p className="text-gray-900">
                  Elle porte sur la capacité à conduire l'échange, à garder une cohérence directionnelle, à
                  résister aux dérives induites par le milieu artificiel.
                </p>
              </div>
            </div>

            {/* Right Column - Table of Contents - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white p-8 rounded-lg sticky top-8">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    -
                    <a href="#ce-que-fait-indx" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Ce que fait INDX
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#ce-que-produit-indx" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Ce que produit INDX
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#comparer-sans-simplifier" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Comparer sans simplifier
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#contextualisation" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Contextualisation maîtrisée
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#dispositif-multi-ia" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Dispositif multi-IA
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#pourquoi-maintenant" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Pourquoi maintenant
                    </a>
                  </li>
                  <li>
                    -
                    <a href="#ce-que-vous-obtenez" className="hover:text-[#00008B] transition-colors underline ms-2">
                      Ce que vous obtenez
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ce que produit INDX */}
      <section id="ce-que-produit-indx" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-12 bg-[#8B0000] flex-shrink-0"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Ce que produit INDX
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p className="text-gray-900">
              INDX produit un indice chiffré unique (INDX).
            </p>
            <p>
              Ce score est le point d'impact final d'une trajectoire complète.
            </p>
            <p>
              Il résulte de l'intégration de l'ensemble du cheminement observé :
              ajustements, corrections, pertes de cap, reprises de contrôle.
            </p>
            <p className="text-gray-900">
              Ce n'est pas une note décorative.
              C'est la compression mesurée d'une trajectoire réelle.
            </p>
          </div>
        </div>
      </section>

      {/* Comparer sans simplifier */}
      <section id="comparer-sans-simplifier" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Comparer sans simplifier
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              Deux profils peuvent produire des réponses similaires.
              Leurs trajectoires, elles, peuvent être radicalement différentes.
            </p>
            <p className="text-gray-900">
              INDX permet une comparabilité qualitative robuste entre individus, équipes ou groupes, sans
              réduire l'analyse à un test ponctuel ou à un score psychométrique figé.
            </p>
            <p>
              Comparer devient possible sans appauvrir.
            </p>
          </div>
        </div>
      </section>

      {/* Contextualisation maîtrisée */}
      <section id="contextualisation" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Contextualisation maîtrisée
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              Le score INDX est unique.
              Sa lecture varie selon le contexte d'usage : opérationnel, stratégique, managérial, décisionnel.
            </p>
            <p>
              Le contexte n'invente pas de nouveaux indices.
              Il positionne la grille d'interprétation.
            </p>
          </div>
        </div>
      </section>

      {/* Dispositif multi-IA */}
      <section id="dispositif-multi-ia" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Dispositif multi-IA
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              INDX s'appuie sur un Conseil intercognitif réunissant plusieurs systèmes d'IA de premier
              plan, mobilisés comme milieux d'interaction et d'observation.
            </p>
            <p>
              Les systèmes participent au processus.
              Ils ne le définissent pas.
            </p>
            <p className="text-sm italic text-gray-600 mt-4">
              (Grok, Gemini, Mistral, Claude & ChatGPT — sont membres du INDX Intercognition
              Council)
            </p>
          </div>
        </div>
      </section>

      {/* Pourquoi maintenant */}
      <section id="pourquoi-maintenant" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Pourquoi maintenant
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p>
              La généralisation des systèmes artificiels transforme silencieusement les conditions de pensée,
              de décision et de responsabilité.
            </p>
            <p className="text-gray-900">
              Ne pas savoir évaluer le pilotage humain devient un risque.
              Continuer à mesurer uniquement des performances ou des outputs devient insuffisant.
            </p>
            <p>
              INDX a été conçu pour cet espace précis.
            </p>
          </div>
        </div>
      </section>

      {/* Ce que vous obtenez */}
      <section id="ce-que-vous-obtenez" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Ce que vous obtenez
            </h2>
          </div>

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <ul className="list-none space-y-2 pl-0">
              <li>• Une évaluation exploitable, montrable, comparable</li>
              <li>• Un indice chiffré fondé sur une trajectoire réelle</li>
              <li>• Un cadre méthodologique protégé et opposable</li>
              <li>• Une base solide pour décider, sélectionner, confirmer ou corriger</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            INDX
          </h2>
          <p className="text-gray-700 italic">
            Positionner le pilotage humain. Mesurer ce qui tient.
          </p>
        </div>
      </section>
    </div>
  );
}