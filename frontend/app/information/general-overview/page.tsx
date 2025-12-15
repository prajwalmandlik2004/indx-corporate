'use client';

import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';

export default function GeneralOverviewPage() {
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
              📊
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 1
              </span>
              <h1 className="text-4xl font-bold gradient-text">General Overview</h1>
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
                Artificial intelligence has profoundly altered the nature of decision-support, analysis, 
                and intellectual production systems. It no longer follows a strictly deterministic model in 
                which a given input produces a predictable and reproducible output. Contemporary systems rely 
                on probabilistic, contextual models capable of generating variable responses, sometimes 
                contradictory, often dependent on implicit formulations.
              </p>

              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                In this context, traditional evaluation frameworks prove inadequate. They continue to measure 
                technical performance, processing speed, and success rates on standardized datasets, without 
                taking into account a now central factor: the human capacity to structure, orient, and 
                stabilize interaction with these systems.
              </p>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center">
                  <Info size={24} className="mr-2" />
                  INDX - Adaptive Intelligence Steering
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  INDX is an evaluation framework designed to respond to this transformation. It aims to 
                  measure a specific capacity, largely ignored until now: the cognitive capacity of an 
                  individual to steer a non-deterministic artificial intelligence in a structured, coherent, 
                  and controlled manner.
                </p>
              </div>

              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                INDX is neither a tool for measuring artificial intelligence nor an indicator of technological 
                performance. It is an evaluation framework focused exclusively on the human cognitive posture 
                in interaction with an intelligent system.
              </p>
            </div>

            {/* Key Points */}
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-4 text-green-900">Key Takeaways</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">AI systems have evolved from deterministic to probabilistic models</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Traditional evaluation methods are no longer adequate</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">INDX measures human cognitive capacity to steer AI systems</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Focus is on human-AI interaction, not AI performance</span>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t">
              <Link
                href="/information"
                className="btn-secondary"
              >
                ← Back
              </Link>
              <Link
                href="/information/origin-and-necessity"
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