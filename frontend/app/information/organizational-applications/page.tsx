'use client';

import Link from 'next/link';
import { ArrowLeft, Building2, Users, Briefcase } from 'lucide-react';

export default function OrganizationalApplicationsPage() {
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
              🏢
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 8-9
              </span>
              <h1 className="text-4xl font-bold gradient-text">Organizational Applications</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* PAGE 8: Companies & Organizations */}
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 size={32} className="text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">INDX and Companies / Organizations</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Organizations face growing heterogeneity in artificial intelligence usage. Gaps in cognitive maturity between 
              individuals and teams represent an often underestimated risk factor.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX makes it possible to objectify these gaps, identify effective steering capacities, and structure hybrid 
              human–AI work environments on solid foundations.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <p className="text-lg leading-relaxed text-gray-700">
                It is neither a human resources management tool nor a control instrument. INDX provides a strategic reading 
                of cognitive capacities mobilized in interaction with AI.
              </p>
            </div>
          </article>

          {/* PAGE 9: Recruitment & Talent Evaluation */}
          <article className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <Users size={32} className="text-blue-600" />
              <h2 className="text-3xl font-bold text-blue-900">INDX and Recruitment / Talent Evaluation</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Traditional talent evaluation systems rely on degrees, declared experience, technical tests, and interviews. 
              While still useful, these instruments struggle to capture a now decisive dimension: the ability of an individual 
              to interact effectively with non-deterministic AI systems.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              As AI intervenes earlier in analysis, selection, recommendation, and decision processes, the value of a profile 
              no longer lies solely in knowledge or technical skills, but in the capacity to structure a cognitive dialogue 
              with these systems, interpret their outputs, identify their limits, and correct their trajectories.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6">
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                INDX introduces a transversal evaluation framework, independent of academic and professional backgrounds, 
                allowing this capacity to be objectified. Unlike technical tests or job simulations, INDX does not seek 
                to measure specific performance, but a stable cognitive posture toward AI.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">This framework makes it possible in particular to:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">identify profiles capable of mediating between humans and intelligent systems;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">distinguish superficial tool mastery from genuine cognitive steering capacity;</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">reduce biases linked to self-presentation and declarative discourse.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                INDX does not replace existing tools. It provides a complementary reading of a strategic factor previously absent.
              </p>
            </div>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/evaluation-logic" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/educational-institutions" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}