'use client';

import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Scale, Shield } from 'lucide-react';

export default function EthicsLimitsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-red-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/information" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Information
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-3xl">
              ⚖️
            </div>
            <div>
              <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 18
              </span>
              <h1 className="text-4xl font-bold gradient-text">Ethics, Limits, and Scope</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Scale size={32} className="text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900">INDX is an Evaluation Tool, Not a Normative Judgment</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX is an evaluation tool, not a normative judgment instrument. It does not predict future behavior nor assess intrinsic value of individuals or groups.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Results must be interpreted within a specific context and time, alongside other analytical elements. INDX provides targeted insight into a single dimension: cognitive steering of intelligent systems.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle size={24} className="text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Context is Critical</h3>
                  <p className="text-gray-700">
                    Results must be interpreted within a specific context and time, alongside other analytical elements. INDX provides targeted insight into a single dimension: cognitive steering of intelligent systems.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <Shield size={32} className="text-blue-600" />
              <h2 className="text-3xl font-bold text-blue-900">Ethical Principles</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              These serve as safeguards for responsible use:
            </p>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Methodological Transparency</h3>
                <p className="text-gray-700">
                  Clear documentation of methods, processes, and evaluation criteria ensures accountability and understanding.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border-l-4 border-indigo-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Proportionality of Use</h3>
                <p className="text-gray-700">
                  INDX results should be applied appropriately to the context and should not exceed their intended purpose.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Refusal of Automated or Decontextualized Interpretations</h3>
                <p className="text-gray-700">
                  Results require human judgment and contextual understanding. Automated decision-making based solely on INDX is inappropriate.
                </p>
              </div>
            </div>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/scientific-foundations" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/cross-sector-use-cases" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}