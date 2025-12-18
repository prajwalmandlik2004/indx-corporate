'use client';

import Link from 'next/link';
import { BookOpen, Brain, Trophy, Users, ArrowRight, CheckCircle, Zap, Target } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get detailed feedback and insights powered by GPT-4o for comprehensive learning.',
    },
    {
      icon: Target,
      title: 'Multiple Categories',
      description: 'Tests for schools, professionals, technical skills, and corporate assessments.',
    },
    {
      icon: Trophy,
      title: 'Progressive Levels',
      description: 'Five difficulty levels to challenge and track your improvement over time.',
    },
    {
      icon: Users,
      title: 'For Everyone',
      description: 'Perfect for students, professionals, and organizations of all sizes.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Tests Completed' },
    { number: '5K+', label: 'Active Users' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Available' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Compact with Contained Image */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="text-gray-600 text-sm">
                Home / Test Platform
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                Intelligent assessment solutions for modern education
              </h1>

              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  INDX delivers AI-powered testing and analytics for educational institutions and professional organizations.
                </p>
                <p>
                  From adaptive assessments to detailed performance insights, our platform supports measurable learning outcomes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup" className="bg-[#050E3C] text-white font-semibold py-3 px-6 rounded-none hover:bg-[#050E3C] transition-all duration-300 text-center">
                  Get Started
                </Link>
                <Link href="/about" className="bg-white text-gray-900 font-semibold py-3 px-6 rounded-none hover:bg-gray-100 transition-all duration-300 border border-gray-300 text-center">
                  Learn More
                </Link>
              </div>
            </div>

            {/* University Building Image */}
            <div className="relative h-[400px] lg:h-[500px] overflow-hidden shadow-xl">
              <img
                src="/home_two.jpg"
                alt="University Campus"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#050E3C]">
              About INDX
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of online testing with our intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:scale-105 transition-transform duration-300 animate-slide-up rounded-none"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-[#050E3C] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-white" size={28} />
                </div> */}
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#050E3C]">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Sign up for free and set up your profile in seconds',
                icon: Users,
              },
              {
                step: '02',
                title: 'Choose Test',
                description: 'Select from various categories and difficulty levels',
                icon: BookOpen,
              },
              {
                step: '03',
                title: 'Get Results',
                description: 'Receive AI-powered analysis and improve your skills',
                icon: Zap,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="card text-center space-y-4 rounded-none">
                  {/* <div className="text-6xl font-bold text-blue-100">{item.step}</div> */}
                  {/* <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-[#050E3C] rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="text-white" size={32} />
                  </div> */}
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {/* {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="text-blue-300" size={32} />
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#050E3C] to-[#050E3C]">
        <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl opacity-90">
            Join thousands of users improving their skills with AI-powered testing
          </p>
          <Link href="/signup" className="inline-block bg-white text-[#050E3C] font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            Create Free Account
          </Link>
        </div>
      </section> */}
    </div>
  );
}