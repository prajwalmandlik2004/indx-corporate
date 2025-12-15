'use client';

import Link from 'next/link';
import { ArrowLeft, Landmark, Network, UserCheck } from 'lucide-react';

export default function PublicInstitutionsPage() {
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
              🏛️
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 12-14
              </span>
              <h1 className="text-4xl font-bold gradient-text">Public & Complex Organizations</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* PAGE 12: Public Institutions */}
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Landmark size={32} className="text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">INDX and Public Institutions</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Public institutions increasingly integrate AI systems into sensitive domains: decision support, data analysis, 
              policy orientation, complex service management.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-6">
              <p className="text-lg leading-relaxed text-gray-700">
                In these contexts, risks are not only technological. They largely depend on how systems are steered, 
                interpreted, and integrated into human decision processes.
              </p>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX provides an analytical framework to evaluate the cognitive capacities of actors involved in these uses. 
              It helps identify maturity gaps that may have systemic consequences, regardless of tool quality.
            </p>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">For institutions, INDX may constitute:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">an instrument for reading cognitive risks;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">support for structuring responsibilities;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">a basis for reflection on AI governance.</span>
                </li>
              </ul>
            </div>
          </article>

          {/* PAGE 13: Complex Organizations */}
          <article className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <Network size={32} className="text-blue-600" />
              <h2 className="text-3xl font-bold text-blue-900">INDX and Complex Organizations</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              In large organizations, AI adoption is not merely a tool issue. It concerns coordination among multiple actors 
              with heterogeneous maturity levels interacting with shared systems.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">INDX enables analysis of these dynamics by highlighting:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">asymmetries in cognitive steering;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">zones of organizational fragility;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">risks of incoherent decisions arising from poor collective interpretation of systems.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                In this context, INDX becomes an organizational analysis tool beyond individual evaluation.
              </p>
            </div>
          </article>

          {/* PAGE 14: Experienced Professionals */}
          <article className="card bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck size={32} className="text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">INDX and Experienced Professionals</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              For professionals with deep domain expertise, AI does not negate the value of knowledge but modifies conditions 
              of its exercise.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX observes how expertise articulates with systems capable of producing analyses, syntheses, or recommendations. 
              It highlights the ability to maintain intellectual control and avoid excessive delegation or cognitive dependency.
            </p>

            <div className="bg-emerald-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                Here, INDX serves as a structuring and reading tool, not a sanction mechanism.
              </p>
            </div>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/educational-institutions" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/scientific-foundations" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}