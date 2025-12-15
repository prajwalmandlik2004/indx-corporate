'use client';

import Link from 'next/link';
import { ArrowLeft, HelpCircle, Award, Cpu, CheckCircle, XCircle } from 'lucide-react';

export default function GeneralQuestionsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-slate-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/information" className="inline-flex items-center text-slate-600 hover:text-slate-700 mb-6 font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Information
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center text-3xl">
              ❓
            </div>
            <div>
              <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 23
              </span>
              <h1 className="text-4xl font-bold gradient-text">General Questions</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <article className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Cpu size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">Does INDX measure artificial intelligence?</h2>
                  <XCircle size={32} className="text-red-500 flex-shrink-0 ml-4" />
                </div>
                <div className="bg-white rounded-lg p-5">
                  <p className="text-lg leading-relaxed text-gray-700 mb-3">
                    <span className="font-bold text-blue-700">No.</span> INDX measures the human capacity to steer artificial intelligence.
                  </p>
                  <p className="text-gray-600">
                    The focus is on human cognitive capabilities when working with AI, not on evaluating the AI systems themselves.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="card bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Award size={24} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">Does INDX replace diplomas or certifications?</h2>
                  <XCircle size={32} className="text-red-500 flex-shrink-0 ml-4" />
                </div>
                <div className="bg-white rounded-lg p-5">
                  <p className="text-lg leading-relaxed text-gray-700 mb-3">
                    <span className="font-bold text-purple-700">No.</span> It is complementary.
                  </p>
                  <p className="text-gray-600">
                    INDX works alongside traditional credentials and certifications, providing additional insights into cognitive steering capabilities that existing frameworks do not capture.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="card bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <HelpCircle size={24} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">Is INDX dependent on a specific technology or vendor?</h2>
                  <CheckCircle size={32} className="text-green-500 flex-shrink-0 ml-4" />
                </div>
                <div className="bg-white rounded-lg p-5">
                  <p className="text-lg leading-relaxed text-gray-700 mb-3">
                    <span className="font-bold text-emerald-700">No.</span> The framework is deliberately independent.
                  </p>
                  <p className="text-gray-600">
                    INDX maintains neutrality from any specific AI platform, vendor, or technology, ensuring it remains relevant across diverse technological ecosystems and over time.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle size={28} className="text-amber-600" />
              <h3 className="text-xl font-bold text-gray-900">Have more questions?</h3>
            </div>
            <p className="text-gray-700 mb-4">
              These are just a few of the most common questions. For more detailed information, please explore the other sections or contact us directly.
            </p>
            <Link href="/information" className="inline-flex items-center text-amber-700 hover:text-amber-800 font-semibold">
              Explore more topics →
            </Link>
          </div>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/reading-results" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/about-positioning" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}