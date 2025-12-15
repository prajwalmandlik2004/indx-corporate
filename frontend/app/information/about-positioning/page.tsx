'use client';

import Link from 'next/link';
import { ArrowLeft, Target, Lightbulb, Network, Globe } from 'lucide-react';

export default function AboutPositioningPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/information" className="inline-flex items-center text-indigo-700 hover:text-indigo-800 mb-6 font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Information
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center text-3xl">
              🎯
            </div>
            <div>
              <span className="inline-block bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 24
              </span>
              <h1 className="text-4xl font-bold gradient-text">About INDX and General Positioning</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <article className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <Lightbulb size={32} className="text-blue-600" />
              <h2 className="text-3xl font-bold text-blue-900">Origins and Foundation</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX results from extensive work on the limits of existing evaluation frameworks in the AI era and the necessity to consider human cognitive steering as a subject of analysis in its own right.
            </p>

            <div className="bg-white rounded-lg p-6">
              <p className="text-lg leading-relaxed text-gray-700">
                This framework emerged from recognizing that traditional evaluation methods were insufficient for understanding how humans interact with and guide AI systems. INDX fills a critical gap in our ability to assess cognitive capabilities in the AI age.
              </p>
            </div>
          </article>

          <article className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <div className="flex items-center space-x-3 mb-6">
              <Target size={32} className="text-purple-600" />
              <h2 className="text-3xl font-bold text-purple-900">Ambition and Approach</h2>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                Its ambition is not to impose a de facto standard, but to offer a robust, rigorous, and open framework suitable for discussion, testing, and adoption across contexts.
              </p>
              <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-400">
                <p className="text-gray-700">
                  <span className="font-semibold text-purple-800">Open Framework:</span> INDX invites collaboration, critique, and refinement from diverse stakeholders, ensuring continuous improvement and relevance.
                </p>
              </div>
            </div>
          </article>

          <article className="card bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300">
            <div className="flex items-center space-x-3 mb-6">
              <Network size={32} className="text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">Strategic Positioning</h2>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                INDX positions itself as a structuring reference at the intersection of cognitive, technological, and institutional challenges raised by artificial intelligence.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Cognitive</h3>
                  <p className="text-sm text-gray-600">Understanding human reasoning and decision-making</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Technological</h3>
                  <p className="text-sm text-gray-600">Navigating AI systems and tools</p>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Institutional</h3>
                  <p className="text-sm text-gray-600">Addressing governance and policy needs</p>
                </div>
              </div>
            </div>
          </article>

          <article className="card bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Globe size={32} />
              <h2 className="text-3xl font-bold">The Future of Cognitive Evaluation</h2>
            </div>
            <p className="text-lg leading-relaxed mb-4">
              As artificial intelligence continues to transform how we work, learn, and make decisions, INDX provides the framework needed to understand and enhance human cognitive steering capabilities.
            </p>
            <p className="text-lg leading-relaxed">
              This is not just about measurement—it's about empowering individuals, organizations, and institutions to navigate the AI era with clarity, confidence, and competence.
            </p>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/general-questions" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}