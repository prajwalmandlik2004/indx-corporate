'use client';

export default function MissionPage() {
  return (
    <div className="overflow-hidden">
      {/* Vision & Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            Vision & mission
          </h1>

          {/* Vision */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Vision
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                L'intelligence artificielle constitue désormais un environnement de raisonnement à part entière.
                Elle intervient dans des processus de décision, d'analyse et d'interprétation qui s'inscrivent dans la durée, avec des effets cumulatifs et parfois irréversibles.
                Dans ce contexte, la question n'est plus uniquement celle des capacités des systèmes, mais celle de la tenue du raisonnement humain lorsqu'il s'exerce au contact de systèmes non déterministes.
                La vision portée par INDX est que cette tenue ne relève ni de la performance ponctuelle, ni de la maîtrise technique seule, mais d'une capacité à conduire un cheminement cognitif cohérent, ajustable et soutenable, en interaction continue avec l'IA.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Mission
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                La mission d'INDX est d'évaluer et de qualifier cette capacité.
                INDX met en œuvre un dispositif structuré permettant d'analyser, dans la durée, la manière dont un raisonnement humain se construit, se stabilise, se corrige ou se rigidifie au fil des interactions avec une intelligence artificielle.
                L'approche ne se limite pas à l'observation.
                Elle permet de positionner des trajectoires, d'en comparer les dynamiques et d'en restituer une lecture synthétique, destinée à éclairer des décisions individuelles ou institutionnelles.
                INDX ne mesure pas des réponses isolées, mais des cheminements.
                Il vise à rendre explicites des différences de conduite cognitive qui restent généralement invisibles, alors qu'elles deviennent déterminantes dès lors que l'IA est mobilisée dans des usages réels, complexes et durables.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}