'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Beaker, ArrowRight, Users } from 'lucide-react';
import { demoAPI } from '@/src/lib/api';

export default function DemoPage() {
  const router = useRouter();
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const response = await demoAPI.getSeries();
      setSeries(response.data.series);
    } catch (err) {
      console.error('Failed to fetch series');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (seriesId: string) => {
    setLoading(true);
    try {
      const response = await demoAPI.startTest(seriesId);
      // router.push(`/demo/${response.data.id}`);
      router.push(`/demo/${response.data.id}?data=${encodeURIComponent(JSON.stringify(response.data))}`);
    } catch (err) {
      console.error('Failed to start test');
      alert('Failed to start test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#050E3C] to-[#050E3C] rounded-2xl mb-4">
            <Beaker className="text-white" size={40} />
          </div> */}
          <h1 className="text-4xl sm:text-6xl font-bold gradient-text">
            Series Test
          </h1>
          {/* <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Évaluez vos capacités de pilotage cognitif avec nos séries de démonstration
          </p> */}
        </div>
      </section>

      {/* Series Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {series.map((s, index) => (
              <div
                key={s.id}
                className="card hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer rounded-none"
                onClick={() => handleStartTest(s.id)}
              >
                <div className="flex flex-col h-full">
                  {/* <div className="w-16 h-16 bg-gradient-to-br from-[#050E3C] to-[#050E3C] rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-2xl font-bold">
                      {s.title.split(' ')[1] || s.title.charAt(0)}
                    </span>
                  </div> */}

                  <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
                  <p className="text-gray-600 mb-4 flex-grow">{s.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>{s.question_count} questions</span>
                    </div>
                    <ArrowRight className="text-[#050E3C]" size={20} />
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