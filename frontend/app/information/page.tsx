'use client';

import Link from 'next/link';
import { FileText, ArrowRight, Info } from 'lucide-react';

export default function InformationPage() {
  const informationPages = [
    {
      id: 1,
      title: 'General Overview',
      description: 'Understanding INDX - Adaptive Intelligence Steering evaluation framework',
      slug: 'general-overview',
      icon: '📊',
    },
    {
      id: 2,
      title: 'Origin and Necessity of AIS',
      description: 'Why traditional evaluation methods have become obsolete',
      slug: 'origin-and-necessity',
      icon: '🎯',
    },
    {
      id: 3,
      title: 'Scope of Measurement',
      description: 'What INDX measures and what it deliberately excludes',
      slug: 'scope-of-measurement',
      icon: '📏',
    },
    {
      id: 4,
      title: 'Methodological Principles',
      description: 'Core framework and evaluation methodology',
      slug: 'methodological-principles',
      icon: '⚙️',
    },
    {
      id: 5,
      title: 'Evaluation Logic',
      description: 'Understanding the distribution and scoring system',
      slug: 'evaluation-logic',
      icon: '📈',
    },
    {
      id: 6,
      title: 'Organizational Applications',
      description: 'How organizations implement and benefit from INDX',
      slug: 'organizational-applications',
      icon: '🏢',
    },
    {
      id: 7,
      title: 'Educational Institutions',
      description: 'INDX in academic and learning environments',
      slug: 'educational-institutions',
      icon: '🎓',
    },
    {
      id: 8,
      title: 'Public Institutions',
      description: 'Applications in government and complex organizations',
      slug: 'public-institutions',
      icon: '🏛️',
    },
    {
      id: 9,
      title: 'Scientific Foundations',
      description: 'Research basis and governance structure',
      slug: 'scientific-foundations',
      icon: '🔬',
    },
    {
      id: 10,
      title: 'Ethics & Limits',
      description: 'Ethical principles and scope boundaries',
      slug: 'ethics-limits',
      icon: '⚖️',
    },
    {
      id: 11,
      title: 'Cross-Sector Use Cases',
      description: 'Universal applications across different sectors',
      slug: 'cross-sector-use-cases',
      icon: '🌐',
    },
    {
      id: 12,
      title: 'Integration into Systems',
      description: 'Seamless integration with existing frameworks',
      slug: 'integration-systems',
      icon: '🔌',
    },
    {
      id: 13,
      title: 'Deployment Scenarios',
      description: 'Flexible implementation approaches',
      slug: 'deployment-scenarios',
      icon: '🚀',
    },
    {
      id: 14,
      title: 'Reading Results',
      description: 'How to interpret and understand INDX outcomes',
      slug: 'reading-results',
      icon: '📊',
    },
    {
      id: 15,
      title: 'General Questions',
      description: 'Frequently asked questions about INDX',
      slug: 'general-questions',
      icon: '❓',
    },
    {
      id: 16,
      title: 'About INDX',
      description: 'General positioning and future vision',
      slug: 'about-positioning',
      icon: '🎯',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-br from-blue-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center justify-center w-15 h-15 bg-gradient-to-br from-blue-500 to-[#050E3C] rounded-2xl mb-4">
            <Info className="text-white" size={30} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
            Information Center
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Explore comprehensive documentation about INDX - Adaptive Intelligence Steering and evaluation frameworks
          </p>
        </div>
      </section> */}

      {/* Information Cards Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {informationPages.map((page) => (
              <Link
                key={page.id}
                href={`/information/${page.slug}`}
                className="block group"
              >
                <div className="card hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-none border-blue-500 h-full">
                  <div className="flex flex-col h-full">
                    {/* Icon and Number */}
                    {/* <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-[#050E3C] rounded-xl flex items-center justify-center text-2xl">
                        {page.icon}
                      </div>
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                        {page.id}
                      </span>
                    </div> */}

                    {/* Content */}
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#050E3C] transition-colors mb-3">
                        {page.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-sm mb-4">
                        {page.description}
                      </p>
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center text-[#050E3C] font-semibold group-hover:translate-x-2 transition-transform mt-auto">
                      <span className="text-sm">Read More</span>
                      <ArrowRight className="ml-2" size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Additional Info Section */}
          {/* <div className="mt-16 bg-gradient-to-r from-[#050E3C] to-[#050E3C] rounded-2xl p-8 text-white">
            <div className="flex items-start space-x-4">
              <FileText size={32} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Need More Information?</h3>
                <p className="text-white/90 leading-relaxed mb-4">
                  These documents provide a comprehensive understanding of the INDX framework,
                  its methodology, and its application in evaluating human-AI interaction capabilities.
                </p>
                <Link
                  href="/about"
                  className="inline-block bg-white text-[#050E3C] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Learn About INDX
                </Link>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
}