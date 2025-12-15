'use client';

import Link from 'next/link';
import { ArrowLeft, Rocket, User, Users, Building, Globe } from 'lucide-react';

export default function DeploymentScenariosPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/information" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6 font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Information
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-3xl">
              🚀
            </div>
            <div>
              <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                Page 21
              </span>
              <h1 className="text-4xl font-bold gradient-text">Deployment and Usage Scenarios</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <article className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Rocket size={32} className="text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900">Flexible Deployment Modalities</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Deployment modalities vary according to objectives and contexts: experimental, progressive, or generalized.
            </p>

            <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg p-6">
              <p className="text-lg leading-relaxed">
                This flexibility is key for international deployment across diverse cultural and regulatory contexts.
              </p>
            </div>
          </article>

          <article className="card bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200">
            <div className="flex items-center space-x-3 mb-6">
              <Globe size={32} className="text-sky-600" />
              <h2 className="text-3xl font-bold text-sky-900">Usage Scenarios</h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              INDX may be used:
            </p>

            <div className="space-y-6">
              
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Individual Use</h3>
                    <p className="text-gray-700 mb-3">
                      For positioning or analysis of personal cognitive steering capabilities.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Example:</span> A researcher assessing their own ability to structure complex AI-assisted research projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Collective Use</h3>
                    <p className="text-gray-700 mb-3">
                      To observe team dynamics and collaborative cognitive patterns.
                    </p>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Example:</span> A design team evaluating how they coordinate their thinking when using AI tools for creative problem-solving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-emerald-500">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Building size={24} className="text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Organizational or Institutional Use</h3>
                    <p className="text-gray-700 mb-3">
                      For strategic purposes and organizational development.
                    </p>
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Example:</span> A government agency assessing cognitive maturity across departments to inform AI adoption strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </article>

          <div className="flex justify-between items-center pt-8 border-t">
            <Link href="/information/integration-systems" className="btn-secondary">
              ← Back
            </Link>
            <Link href="/information/reading-results" className="btn-primary">
              Next →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}