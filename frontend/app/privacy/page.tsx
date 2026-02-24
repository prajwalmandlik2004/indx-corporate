'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="overflow-hidden">
      {/* Privacy Policy Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            Pages légales
          </h1>

          {/* 1. Mentions légales */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              1. Mentions légales
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Le site ind-x.fr est édité par :
              </p>

              <div className="pl-6">
                <p className="mb-4">
                  <strong>Éditeur</strong><br />
                  SIMG SAS<br />
                  France
                </p>

                <p className="mb-4">
                  <strong>Responsable de la publication</strong><br />
                  Barthélemy Gilles
                </p>

                <p>
                  <strong>Hébergement</strong><br />
                  Hostinger – Render – Vercel<br />
                  Infrastructure localisée en France.
                </p>
              </div>

              <p>
                Le site ind-x.fr est un site institutionnel dédié à la présentation de cadres conceptuels, travaux analytiques et dispositifs intellectuels développés par son éditeur.
              </p>

              <p>
                L'accès au site implique l'acceptation pleine et entière des présentes dispositions.
              </p>
            </div>
          </div>

          {/* 2. Propriété intellectuelle et exclusivité */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              2. Propriété intellectuelle et exclusivité
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                L'ensemble des contenus présents sur le site ind-x.fr, incluant notamment :
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>cadres conceptuels,</li>
                <li>structures méthodologiques,</li>
                <li>terminologies,</li>
                <li>dispositifs analytiques,</li>
                <li>architectures de tests,</li>
                <li>séquences et progressions,</li>
                <li>systèmes de scoring,</li>
                <li>métriques et invariants,</li>
                <li>documents, textes, graphismes et agencements,</li>
              </ul>

              <p>
                constitue des œuvres originales protégées par le droit de la propriété intellectuelle.
              </p>

              <p>
                Ces éléments sont la propriété exclusive de leur auteur.
              </p>

              <p>
                Aucune licence, explicite ou implicite, n'est concédée du seul fait de l'accès au site.
              </p>

              <p>
                Toute reproduction, représentation, extraction, adaptation, diffusion ou exploitation, totale ou partielle, est strictement interdite sans autorisation écrite préalable.
              </p>
            </div>
          </div>

          {/* 3. Dispositif INDX1000 – Série M1 (Bêta-test) */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              3. Dispositif INDX1000 – Série M1 (Bêta-test)
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                INDX1000 – Série M1 constitue un dispositif propriétaire d'analyse d'interactions cognitives proposé à titre expérimental et gratuit.
              </p>

              <p>
                Il ne constitue :
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>ni un test psychologique réglementé,</li>
                <li>ni un instrument médical,</li>
                <li>ni une certification,</li>
                <li>ni un outil décisionnel autonome.</li>
              </ul>

              <p>
                Le dispositif est fourni en l'état, dans un cadre expérimental susceptible d'évolution.
              </p>

              <p>
                L'éditeur se réserve le droit de modifier, suspendre ou interrompre le bêta-test à tout moment, sans aucune obligation de préavis.
              </p>
            </div>
          </div>

          {/* 4. Protection méthodologique renforcée */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              4. Protection méthodologique renforcée
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                La méthodologie INDX1000, incluant notamment :
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>l'architecture des séquences,</li>
                <li>la progression structurée,</li>
                <li>la logique d'évaluation,</li>
                <li>les principes d'analyse,</li>
                <li>les invariants,</li>
                <li>la structure de scoring,</li>
              </ul>

              <p>
                constitue un actif stratégique.
              </p>

              <p>
                Il est strictement interdit de :
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>reproduire les séquences,</li>
                <li>enregistrer ou diffuser le dispositif dans son intégralité,</li>
                <li>analyser publiquement sa structure interne,</li>
                <li>procéder à une ingénierie inverse,</li>
                <li>extraire ou reconstituer la logique méthodologique,</li>
                <li>utiliser les éléments observés pour développer un outil concurrent.</li>
              </ul>

              <p>
                Toute violation est susceptible d'engager la responsabilité civile et, le cas échéant, pénale de son auteur.
              </p>
            </div>
          </div>

          {/* 5. Clause de non-exploitation concurrentielle */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              5. Clause de non-exploitation concurrentielle
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Indépendamment de la protection permanente accordée par le droit de la propriété intellectuelle, le participant au bêta-test s'interdit, pendant la durée de sa participation et pour une période de vingt-quatre (24) mois à compter de celle-ci :
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>d'exploiter les informations obtenues à des fins concurrentielles,</li>
                <li>de développer ou contribuer au développement d'un dispositif substantiellement similaire fondé sur les éléments observés,</li>
                <li>d'utiliser les principes ou structures internes à des fins commerciales concurrentes.</li>
              </ul>

              <p>
                Cette clause n'affecte pas la liberté générale d'entreprendre, mais interdit toute exploitation fondée sur l'observation directe du dispositif.
              </p>
            </div>
          </div>

          {/* 6. Données personnelles */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              6. Données personnelles
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Le site ind-x.fr et le dispositif INDX1000 peuvent collecter :
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>données de navigation,</li>
                <li>logs techniques,</li>
                <li>réponses produites dans le cadre du test,</li>
                <li>informations transmises volontairement.</li>
              </ul>

              <p>
                Ces données sont utilisées exclusivement :
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>à des fins internes d'analyse,</li>
                <li>d'amélioration méthodologique,</li>
                <li>de validation statistique,</li>
                <li>de recherche,</li>
                <li>ou sous forme anonymisée et agrégée.</li>
              </ul>

              <p>
                Aucune donnée individuelle n'est vendue ni exploitée commercialement.
              </p>

              <p>
                Le traitement est réalisé conformément au Règlement (UE) 2016/679 (RGPD).
              </p>

              <p>
                L'utilisateur dispose d'un droit d'accès, de rectification et de suppression des données le concernant.
              </p>

              <p>
                Toute demande peut être adressée à : [email dédié].
              </p>
            </div>
          </div>

          {/* 7. Conditions d'accès et responsabilité */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              7. Conditions d'accès et responsabilité
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Les contenus et dispositifs sont fournis sans garantie, sans engagement de résultat et sans finalité opérationnelle déclarée.
              </p>

              <p>
                Toute utilisation au-delà de la simple consultation relève de la seule responsabilité de l'utilisateur.
              </p>

              <p>
                L'éditeur ne saurait être tenu responsable de toute interprétation, décision ou conséquence résultant de l'accès au site ou de l'utilisation du dispositif.
              </p>
            </div>
          </div>

          {/* 8. Droit applicable */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              8. Droit applicable
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Le site ind-x.fr et les présentes dispositions sont régis par le droit français.
              </p>

              <p>
                Tout litige relève de la compétence exclusive des juridictions françaises.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}