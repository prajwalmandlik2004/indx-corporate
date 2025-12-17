import { Brain, Target, Users, Zap, Award, Globe } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Leveraging GPT-4o for intelligent test generation and analysis',
    },
    {
      icon: Target,
      title: 'Personalized',
      description: 'Adaptive testing that matches your skill level and goals',
    },
    {
      icon: Users,
      title: 'Inclusive',
      description: 'Designed for students, professionals, and organizations',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Real-time analysis and detailed performance insights',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-br from-blue-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold gradient-text">
            About INDX
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Revolutionizing online testing with artificial intelligence
          </p>
        </div>
      </section> */}

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold gradient-text">About</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                INDX is dedicated to transforming the way people learn and assess their knowledge. 
                We believe that testing should be more than just a score—it should be a comprehensive 
                learning experience that provides meaningful insights and actionable feedback.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                By harnessing the power of GPT-4o, we create intelligent, adaptive tests that 
                understand context, provide detailed analysis, and help users identify their strengths 
                and areas for improvement.
              </p>
            </div>
            {/* <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-900 to-blue-900 rounded-3xl shadow-2xl flex items-center justify-center">
                <Globe className="text-white" size={120} />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold gradient-text">Platform Values</h2>
            <p className="text-xl text-gray-600">What drives us forward</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center space-y-4">
                {/* <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-900 rounded-xl flex items-center justify-center mx-auto">
                  <value.icon className="text-white" size={32} />
                </div> */}
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold gradient-text">Platform Features</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Multiple Test Categories',
                description: 'School, Professional, Technical, Company, and General Knowledge tests',
              },
              {
                title: '5 Progressive Levels',
                description: 'Start easy and progress through increasingly challenging questions',
              },
              {
                title: 'AI-Generated Questions',
                description: 'Fresh, relevant questions powered by GPT-4o for each test',
              },
              {
                title: 'Detailed Analytics',
                description: 'Comprehensive performance analysis with strengths and improvement areas',
              },
              {
                title: 'Personal Dashboard',
                description: 'Track your progress and view all your test history in one place',
              },
              {
                title: 'Instant Results',
                description: 'Get immediate feedback and detailed scoring after each test',
              },
            ].map((feature, index) => (
              <div key={index} className="card">
                <div className="flex items-start space-x-4">
                  {/* <div className="flex-shrink-0">
                    <Award className="text-blue-900" size={24} />
                  </div> */}
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}