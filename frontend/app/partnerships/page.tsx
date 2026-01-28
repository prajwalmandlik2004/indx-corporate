'use client';

export default function PartnershipsPage() {
  return (
    <div className="overflow-hidden">
      {/* Partenariats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            Partenariats
          </h1>

          {/* Une logique de collaboration construite */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Une logique de collaboration construite
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                INDX se développe par des collaborations avec des acteurs confrontés à des usages concrets de l'intelligence artificielle, dans des contextes où la qualité d'analyse et la comparabilité des trajectoires sont déterminantes.
                Les partenariats sont conçus comme des cadres de travail structurés, permettant de déployer, d'éprouver et d'exploiter le dispositif dans des contextes réels, plutôt que comme des intégrations génériques.
                La priorité est donnée à la qualité des situations analysées, à la comparabilité des trajectoires et à la clarté des objectifs poursuivis.
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-300 my-8"></div>

          {/* Contextes de partenariat */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Contextes de partenariat
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Les collaborations peuvent concerner :
            </p>

            <ul className="text-gray-700 text-lg leading-relaxed ml-8">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>
                  des organisations publiques ou privées, pour lesquelles la conduite des interactions humain-IA présente des enjeux opérationnels, décisionnels ou stratégiques ;
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>
                  des institutions académiques ou de formation, souhaitant disposer d'outils d'évaluation dépassant les approches déclaratives ou purement techniques ;
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>
                  des entreprises technologiques, dans des cadres clairement définis, lorsque l'indépendance du dispositif est préservée.
                </span>
              </li>
            </ul>

          </div>


          <div className="h-px bg-gray-300 my-8"></div>
          {/* Indépendance et usage */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Indépendance et usage
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                INDX est conçu pour fonctionner indépendamment des modèles, des fournisseurs et des architectures techniques.            
                Cette indépendance garantit la stabilité des évaluations, la comparabilité dans le temps et l'absence d'alignement implicite sur une technologie donnée.          
                Les partenariats s'inscrivent dans une logique de durée, avec un objectif clair :
                fournir des éléments de lecture fiables, comparables et exploitables, sans réduire la complexité des situations observées.
              </p>
            </div>
            <div className="h-px bg-gray-300 my-8"></div>
          </div>
        </div>
      </section>
    </div>
  );
}