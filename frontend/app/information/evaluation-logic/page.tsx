'use client';

import Link from 'next/link';
import { ArrowLeft, Clipboard, Monitor } from 'lucide-react';

export default function EvaluationLogicPage() {
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
              📋
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 6-7
              </span>
              <h1 className="text-4xl font-bold gradient-text">Evaluation Logic & Distribution</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* PAGE 6: Evaluation Logic */}
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Clipboard size={32} className="text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Evaluation Logic and Nature of Tests</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX evaluations do not take the form of traditional exams, standardized questionnaires, or knowledge tests. 
              They rely on interactive situations designed to observe cognitive behaviors over time.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Tests aim to analyze:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">how an interaction is initiated,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">how results are interpreted,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">successive adjustments made,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">overall coherence of the approach.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed font-medium">
                There is no correct or incorrect answer. Evaluation focuses on the structure and stability of cognitive steering.
              </p>
            </div>
          </article>

          {/* PAGE 7: Distribution Modalities */}
          <article className="card bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
            <div className="flex items-center space-x-3 mb-6">
              <Monitor size={32} className="text-purple-600" />
              <h2 className="text-3xl font-bold text-purple-900">Distribution Modalities and Supports</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX can be deployed through various supports: digital platforms, dedicated applications, controlled evaluation 
              environments. These supports do not constitute the core of the system.
            </p>

            <div className="bg-white rounded-lg p-6">
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                The platform is designed as a neutral vector. It serves the method without altering its principles. 
                This separation guarantees the independence and durability of the AIS framework.
              </p>
            </div>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/methodological-principles" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/organizational-applications" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}