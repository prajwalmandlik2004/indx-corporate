'use client';

import Link from 'next/link';
import { ArrowLeft, GraduationCap, Building2, Landmark, Layers } from 'lucide-react';

export default function CrossSectorUseCasesPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/information" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6 font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Information
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-3xl">
              🌐
            </div>
            <div>
              <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 19
              </span>
              <h1 className="text-4xl font-bold gradient-text">Cross-Sector Use Cases</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Layers size={32} className="text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Universal Application Across Contexts</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX applies across contexts without sectoral limitation.
            </p>

            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                INDX does not prescribe uses. It provides an observation and analysis framework for previously hard-to-measure phenomena.
              </p>
            </div>
          </article>

          <div className="grid md:grid-cols-1 gap-6">
            
            <article className="card bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <GraduationCap size={28} className="text-purple-600" />
                <h3 className="text-2xl font-bold text-purple-900">Education and Research</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                In education and research, it clarifies reasoning structuring with AI. INDX helps understand how students and researchers organize their thinking when working with AI systems, providing insights into cognitive development and learning patterns.
              </p>
            </article>

            <article className="card bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Building2 size={28} className="text-blue-600" />
                <h3 className="text-2xl font-bold text-blue-900">Organizations</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                In organizations, it analyzes collective dynamics and maturity gaps. INDX reveals how teams coordinate their cognitive efforts, identifies areas for development, and helps optimize collaboration between humans and AI systems.
              </p>
            </article>

            <article className="card bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
              <div className="flex items-center space-x-3 mb-4">
                <Landmark size={28} className="text-emerald-600" />
                <h3 className="text-2xl font-bold text-emerald-900">Public Institutions</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                In public institutions, it reads human capacities within AI-assisted decisions. INDX provides critical insight into how decision-makers navigate complex policy choices with AI support, ensuring accountability and transparency.
              </p>
            </article>

          </div>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/ethics-limits" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/integration-systems" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}