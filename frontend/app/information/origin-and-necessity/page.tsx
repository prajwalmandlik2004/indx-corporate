'use client';

import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function OriginAndNecessityPage() {
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
              🎯
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 2
              </span>
              <h1 className="text-4xl font-bold gradient-text">Origin and Necessity of AIS</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">The Evolution of Evaluation</h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Existing evaluation methods are historically based on assumptions that have become obsolete: 
                stability of responses, transparency of reasoning, and a clear separation between tool and user. 
                These assumptions no longer withstand the reality of current systems.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-lg">
                <h3 className="text-xl font-bold text-amber-900 mb-3 flex items-center">
                  <AlertTriangle size={24} className="mr-2" />
                  Critical Observation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  When responses become non-deterministic, when internal reasoning is partially opaque, and 
                  when produced value depends on human interpretation, evaluation can no longer focus solely 
                  on observable results.
                </p>
              </div>

              <h3 className="text-xl font-bold mb-4 text-gray-900">The Birth of INDX</h3>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                INDX was born from this observation: in a non-deterministic environment, the critical variable 
                is no longer system performance, but the human capacity to ensure cognitive steering. This 
                capacity conditions the relevance of results, the robustness of decisions, and the long-term 
                stability of usage.
              </p>

              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                INDX thus addresses a methodological gap: the absence of a rigorous framework to evaluate 
                human cognitive maturity in the face of artificial intelligence.
              </p>
            </div>

            {/* Obsolete Assumptions */}
            <div className="card bg-red-50 border-2 border-red-200 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-red-900">Obsolete Assumptions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Stability of Responses</h4>
                  <p className="text-sm text-gray-600">Same input no longer guarantees same output</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Transparency of Reasoning</h4>
                  <p className="text-sm text-gray-600">Internal processes are often opaque</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Tool-User Separation</h4>
                  <p className="text-sm text-gray-600">Boundaries have become blurred</p>
                </div>
              </div>
            </div>

            {/* What INDX Addresses */}
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-4 text-green-900">What INDX Addresses</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Measures human capacity for cognitive steering</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Evaluates relevance of results through human lens</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Assesses robustness of human-AI decisions</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Ensures long-term stability of AI usage patterns</span>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t">
              <Link
                href="/information/general-overview"
                className="btn-secondary"
              >
                ← Back
              </Link>
              <Link
                href="/information/scope-of-measurement"
                className="btn-primary"
              >
                Next →
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}