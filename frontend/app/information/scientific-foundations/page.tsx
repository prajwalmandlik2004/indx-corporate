'use client';

import Link from 'next/link';
import { ArrowLeft, Microscope, Shield, Clock } from 'lucide-react';

export default function ScientificFoundationsPage() {
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
              🔬
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 15-17
              </span>
              <h1 className="text-4xl font-bold gradient-text">Scientific Foundations & Governance</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* PAGE 15: Cognitive and Scientific Foundations */}
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Microscope size={32} className="text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Cognitive and Scientific Foundations</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX is grounded in interdisciplinary research on human reasoning, decision-making in complex environments, 
              and interaction between heterogeneous cognitive agents. It lies at the intersection of cognitive sciences, 
              reasoning psychology, cognitive ergonomics, and socio-technical systems studies.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Unlike approaches focused on observable performance or technical conformity, INDX examines the structure of 
              cognitive steering: how objectives are formulated, information organized, uncertainty managed, and coherence 
              maintained in the presence of systems producing elaborate but non-guaranteed responses.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
              <p className="text-lg leading-relaxed text-gray-700">
                INDX does not propose a unified model of human cognition. It relies on a deliberately limited set of cognitive 
                dimensions considered fundamental because they are observable, transversal, and relatively invariant.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                Its positioning is pragmatic: it does not seek to explain cognition, but to evaluate certain operational 
                properties in a specific context — interaction with AI systems.
              </p>
            </div>
          </article>

          {/* PAGE 16: Independence, Neutrality, and Governance */}
          <article className="card bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
            <div className="flex items-center space-x-3 mb-6">
              <Shield size={32} className="text-purple-600" />
              <h2 className="text-3xl font-bold text-purple-900">Independence, Neutrality, and Governance</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              The independence of INDX is a structuring principle. It conditions institutional credibility, international 
              portability, and adoption by actors with divergent interests.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6">
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                INDX is affiliated with no technology vendor, AI model, or specific industrial actor. This neutrality ensures 
                evaluations are not biased by implementation choices or commercial strategies.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Governance is designed to preserve this independence over time, through clear separation between:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">conceptual and methodological framework,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">diffusion and implementation modalities,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">institutional or operational uses.</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                This separation enables INDX to function as a common reference in environments with multiple technologies and doctrines.
              </p>
            </div>
          </article>

          {/* PAGE 17: Durability and Technological Invariance */}
          <article className="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
            <div className="flex items-center space-x-3 mb-6">
              <Clock size={32} className="text-amber-600" />
              <h2 className="text-3xl font-bold text-amber-900">Durability and Technological Invariance</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              A core objective of INDX is long-term relevance despite rapid AI evolution. This requirement guided all 
              conceptual choices.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX relies on no specific algorithms, interfaces, or interaction modes. It focuses exclusively on human 
              cognitive dimensions considered stable over time.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">This invariance enables:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">comparability over time,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">international portability,</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">independence from technological cycles.</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                INDX positions itself as a durable reference capable of accompanying future AI transformations without 
                conceptual overhaul.
              </p>
            </div>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/public-institutions" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/ethics-limits" className="btn-primary">
              Next  →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}