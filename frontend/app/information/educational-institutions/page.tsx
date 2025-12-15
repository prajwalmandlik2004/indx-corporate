'use client';

import Link from 'next/link';
import { ArrowLeft, GraduationCap, Award, School } from 'lucide-react';

export default function EducationalInstitutionsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/information" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Information
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-3xl">
              🎓
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 10-11
              </span>
              <h1 className="text-4xl font-bold gradient-text">Educational Institutions</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* PAGE 10: Universities & Higher Education */}
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <GraduationCap size={32} className="text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">INDX and Universities / Higher Education</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Universities and higher education institutions face a structural transformation of evaluation modalities. 
              Widespread access to AI challenges the relevance of many traditional systems based on restitution, individual 
              production, or closed problem solving.
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-6">
              <p className="text-lg leading-relaxed text-gray-700">
                In this context, the primary risk is not fraud, but the inability to measure what now constitutes intellectual 
                differentiation: the ability to structure reasoning in interaction with systems capable of producing elaborate, 
                but non-guaranteed, responses.
              </p>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX provides a complementary framework to degrees and curricula for evaluating specific cognitive maturity toward AI. 
              This maturity is distinct from academic level or disciplinary specialization. It refers to the ability to maintain 
              intellectual coherence, manage uncertainty, and exercise critical judgment in an AI-assisted environment.
            </p>

            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">For academic institutions, INDX may serve as:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">a transversal positioning tool at end of cycle;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">a reference within programs structurally integrating AI;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">a basis for reflection on evolving criteria of academic excellence.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed font-medium">
                INDX is not intended to replace academic evaluations. It illuminates a dimension they do not cover.
              </p>
            </div>
          </article>

          {/* PAGE 11: Certification Bodies */}
          <article className="card bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
            <div className="flex items-center space-x-3 mb-6">
              <Award size={32} className="text-purple-600" />
              <h2 className="text-3xl font-bold text-purple-900">INDX and Certification Bodies</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Certification bodies face rapid obsolescence of many competency frameworks. Tools, languages, and practices 
              evolve faster than evaluation frameworks.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX stands out through its independence from taught content and used technologies. It does not certify an 
              operational skill, but a transversal cognitive capacity, applicable across contexts and durable over time.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Within certification systems, INDX may be used:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">as a complementary indicator of cognitive maturity;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">as a differentiation tool between advanced levels;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">as a coherence element among heterogeneous certifications.</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                Its conceptual stability allows long-term integration without technological dependency.
              </p>
            </div>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/organizational-applications" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/public-institutions" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}