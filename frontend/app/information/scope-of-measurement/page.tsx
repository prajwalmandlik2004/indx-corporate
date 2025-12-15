'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function ScopeOfMeasurementPage() {
  const measuredCapacities = [
    'Explicit structuring of an intention exploitable by an intelligent system',
    'Formulation and adjustment of relevant constraints',
    'Management of uncertainty and ambiguity',
    'Logical coherence of interactions over time',
    'Ability to analyze, correct, and redirect a cognitive trajectory',
  ];

  const excludedElements = [
    'Execution speed',
    'Stylistic or expressive creativity',
    'Technical mastery of a specific language or tool',
    'Knowledge of a specific domain',
    'Conformity to an expected result',
  ];

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
              📏
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 3
              </span>
              <h1 className="text-4xl font-bold gradient-text">Scope of Measurement and Exclusions</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <div className="card mb-8">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                INDX measures transversal cognitive capacities, independent of professional domains, academic 
                levels, or job functions. The framework is designed to evaluate universal human abilities that 
                apply across all contexts of AI interaction.
              </p>
            </div>

            {/* What INDX Measures */}
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle size={32} className="text-green-600" />
                <h2 className="text-2xl font-bold text-green-900 m-0">What INDX Measures</h2>
              </div>
              <p className="text-gray-700 mb-4">
                These capacities include in particular:
              </p>
              <ul className="space-y-4">
                {measuredCapacities.map((capacity, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={20} className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{capacity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What INDX Does NOT Measure */}
            <div className="card bg-red-50 border-2 border-red-200 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <XCircle size={32} className="text-red-600" />
                <h2 className="text-2xl font-bold text-red-900 m-0">What INDX Does NOT Measure</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Conversely, INDX deliberately excludes:
              </p>
              <ul className="space-y-4">
                {excludedElements.map((element, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle size={20} className="text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{element}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Note */}
            <div className="card bg-blue-50 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Important Distinction</h3>
              <p className="text-gray-700 leading-relaxed">
                These excluded elements may have operational value, but they do not constitute the core of 
                cognitive steering. INDX focuses exclusively on the structure of human–AI interaction.
              </p>
            </div>

            {/* Core Focus */}
            <div className="card bg-gradient-to-r from-green-600 to-emerald-600 text-white mt-8">
              <h3 className="text-2xl font-bold mb-4">Core Focus of INDX</h3>
              <p className="text-white/90 leading-relaxed text-lg">
                The framework evaluates how effectively an individual can structure, guide, and maintain 
                coherent interaction with non-deterministic AI systems—capabilities that transcend domain 
                expertise and technical knowledge.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t">
              <Link
                href="/information/origin-and-necessity"
                className="btn-secondary"
              >
                ← Back
            </Link>
              <Link href="/information/methodological-principles" className="btn-primary">
              Next  →
            </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}