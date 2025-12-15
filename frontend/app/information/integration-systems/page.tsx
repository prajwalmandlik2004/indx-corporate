'use client';

import Link from 'next/link';
import { ArrowLeft, Puzzle, Blocks, CheckCircle, Network } from 'lucide-react';

export default function IntegrationSystemsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/information" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Information
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl">
              🔌
            </div>
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 20
              </span>
              <h1 className="text-4xl font-bold gradient-text">Integration into Existing Systems</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Puzzle size={32} className="text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Seamless Integration Without Disruption</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX is designed to integrate into existing institutional environments without organizational disruption. It can function autonomously or as a complementary component.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <p className="text-lg leading-relaxed text-gray-700">
                INDX thus coexists with academic evaluations, certifications, competency management, and public governance frameworks.
              </p>
            </div>
          </article>

          <article className="card bg-gradient-to-br from-violet-50 to-fuchsia-50 border-2 border-violet-200">
            <div className="flex items-center space-x-3 mb-6">
              <Blocks size={32} className="text-violet-600" />
              <h2 className="text-3xl font-bold text-violet-900">Integration Foundations</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              This integration relies on:
            </p>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                    <Network size={20} className="text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Technological Neutrality</h3>
                    <p className="text-gray-700">
                      INDX works independently of specific platforms, tools, or vendors, ensuring compatibility across diverse technological ecosystems.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Blocks size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Modular Evaluation Modalities</h3>
                    <p className="text-gray-700">
                      Flexible assessment approaches allow organizations to implement INDX in ways that fit their specific needs and contexts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Clarity of Produced Results</h3>
                    <p className="text-gray-700">
                      Clear, interpretable outputs ensure that stakeholders can understand and act on INDX insights without specialized training.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/cross-sector-use-cases" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/deployment-scenarios" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}