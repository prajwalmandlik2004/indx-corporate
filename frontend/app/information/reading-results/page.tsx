'use client';

import Link from 'next/link';
import { ArrowLeft, Eye, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';

export default function ReadingResultsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/information" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Information
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-3xl">
              📊
            </div>
            <div>
              <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 22
              </span>
              <h1 className="text-4xl font-bold gradient-text">Reading and Interpreting Results</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Eye size={32} className="text-pink-600" />
              <h2 className="text-3xl font-bold text-gray-900">Rigor and Discernment Required</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX results must be read with rigor and discernment. They are neither academic grades, rankings, nor definitive verdicts.
            </p>

            <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                This approach avoids reductionism and promotes qualitative, responsible interpretation.
              </p>
            </div>
          </article>

          <article className="card bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen size={32} className="text-amber-600" />
              <h2 className="text-3xl font-bold text-amber-900">What INDX Results Represent</h2>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <p className="text-lg leading-relaxed text-gray-700 mb-4">
                An INDX result describes an <span className="font-bold text-amber-700">observed cognitive configuration</span> at a given time and context. It may evolve with practice, experience, and conditions.
              </p>
              <div className="flex items-start space-x-3 bg-amber-50 rounded-lg p-4">
                <TrendingUp size={24} className="text-amber-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  <span className="font-semibold">Dynamic Nature:</span> Results are not static measurements but snapshots that reflect current capabilities which can develop and change over time.
                </p>
              </div>
            </div>
          </article>

          <article className="card bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle size={32} className="text-red-600" />
              <h2 className="text-3xl font-bold text-red-900">What INDX Results Are NOT</h2>
            </div>

            <div className="space-y-4">
              
              <div className="bg-white rounded-lg p-5 border-l-4 border-red-400">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold text-lg">✗</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Not Academic Grades</h3>
                </div>
                <p className="text-gray-700 ml-11">
                  INDX does not evaluate knowledge acquisition or academic performance in traditional subjects.
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 border-l-4 border-orange-400">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-lg">✗</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Not Rankings</h3>
                </div>
                <p className="text-gray-700 ml-11">
                  Results should not be used to create hierarchies or compare individuals in competitive contexts.
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 border-l-4 border-rose-400">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-600 font-bold text-lg">✗</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Not Definitive Verdicts</h3>
                </div>
                <p className="text-gray-700 ml-11">
                  INDX provides insights, not final judgments about capability or potential. Context and evolution matter.
                </p>
              </div>

            </div>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/deployment-scenarios" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/general-questions" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}