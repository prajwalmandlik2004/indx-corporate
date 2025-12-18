'use client';

import Link from 'next/link';

export default function GeneralOverviewPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-blue-50 border-b border-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/information"
            className="text-[#050E3C] hover:underline mb-4 inline-block"
          >
            ← Back to Information
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">General Overview</h1>
          {/* <p className="text-sm text-gray-900 mt-1">Page 1</p> */}
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="text-gray-800">
            <div className="mb-8">
              <p className="text-base leading-7 mb-4">
                Artificial intelligence has profoundly altered the nature of decision-support, analysis, 
                and intellectual production systems. It no longer follows a strictly deterministic model in 
                which a given input produces a predictable and reproducible output. Contemporary systems rely 
                on probabilistic, contextual models capable of generating variable responses, sometimes 
                contradictory, often dependent on implicit formulations.
              </p>

              <p className="text-base leading-7 mb-4">
                In this context, traditional evaluation frameworks prove inadequate. They continue to measure 
                technical performance, processing speed, and success rates on standardized datasets, without 
                taking into account a now central factor: the human capacity to structure, orient, and 
                stabilize interaction with these systems.
              </p>

              <div className="bg-gray-50 border border-gray-300 p-6 my-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  INDX - Adaptive Intelligence Steering
                </h3>
                <p className="text-base leading-7">
                  INDX is an evaluation framework designed to respond to this transformation. It aims to 
                  measure a specific capacity, largely ignored until now: the cognitive capacity of an 
                  individual to steer a non-deterministic artificial intelligence in a structured, coherent, 
                  and controlled manner.
                </p>
              </div>

              <p className="text-base leading-7 mb-4">
                INDX is neither a tool for measuring artificial intelligence nor an indicator of technological 
                performance. It is an evaluation framework focused exclusively on the human cognitive posture 
                in interaction with an intelligent system.
              </p>
            </div>

            {/* Key Points */}
            <div className="bg-gray-50 border border-gray-300 p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Key Takeaways</h3>
              <ul className="list-disc list-inside space-y-2 text-base">
                <li>AI systems have evolved from deterministic to probabilistic models</li>
                <li>Traditional evaluation methods are no longer adequate</li>
                <li>INDX measures human cognitive capacity to steer AI systems</li>
                <li>Focus is on human-AI interaction, not AI performance</li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-300">
              <Link
                href="/information"
                className="text-[#050E3C] hover:underline"
              >
                ← Back
              </Link>
              <Link
                href="/information/origin-and-necessity"
                className="text-[#050E3C] hover:underline"
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