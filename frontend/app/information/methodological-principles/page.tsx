'use client';

import Link from 'next/link';
import { ArrowLeft, Settings, Target } from 'lucide-react';

export default function MethodologicalPrinciplesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/information"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 font-semibold transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Information
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-3xl">
              ⚙️
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 4-5
              </span>
              <h1 className="text-4xl font-bold gradient-text">Methodological Principles & Framework</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* PAGE 4: Fundamental Methodological Principles */}
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Settings size={32} className="text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Fundamental Methodological Principles</h2>
            </div>
            
            <p className="text-lg leading-relaxed text-gray-700 mb-8">
              The INDX framework is based on a set of strict methodological principles ensuring its robustness and durability.
            </p>

            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3">Explicit recognition of non-determinism</h3>
                <p className="text-gray-700 leading-relaxed">
                  Evaluated systems produce variable responses. Any evaluation based on a single response is invalid by construction.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Primacy of the cognitive process</h3>
                <p className="text-gray-700 leading-relaxed">
                  The value of interaction lies in the intellectual trajectory, not in a single outcome.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-purple-900 mb-3">Technological independence</h3>
                <p className="text-gray-700 leading-relaxed">
                  The INDX framework is designed to remain valid regardless of the models, architectures, or interfaces used.
                </p>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-amber-900 mb-3">Cognitive invariance</h3>
                <p className="text-gray-700 leading-relaxed">
                  The evaluated axes are considered fundamental and non-substitutable. They do not depend on profession or sectoral context.
                </p>
              </div>
            </div>
          </article>

          {/* PAGE 5: The INDX Framework */}
          <article className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center space-x-3 mb-6">
              <Target size={32} className="text-green-600" />
              <h2 className="text-3xl font-bold text-green-900">The INDX Framework (Conceptual Level)</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX relies on a deliberately limited number of fundamental cognitive axes. This choice reflects a requirement 
              for non-redundancy and completeness. Each axis describes an essential dimension of cognitive steering.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">These axes include in particular:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">ability to explicate a structured intention,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">mastery of logical continuity between iterations,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">aptitude to integrate unforeseen feedback,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">ability to correct without cognitive rupture,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">maintenance of a stable intellectual orientation.</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                The ensemble forms a closed framework. No axis can be removed or replaced without compromising 
                the overall validity of the system.
              </p>
            </div>
          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/scope-of-measurement" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/evaluation-logic" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}