'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { resultAPI } from '@/src/lib/api';

// const AI_MODELS = [
//   { id: 'gpt4o', name: 'GPT-4o', color: 'from-green-500 to-emerald-600' },
//   { id: 'claude', name: 'Claude', color: 'from-orange-500 to-red-600' },
//   { id: 'grok', name: 'Grok', color: 'from-black to-black' },
//   { id: 'groq', name: 'Gemini', color: 'from-blue-500 to-blue-600' },
//   { id: 'mistral', name: 'Mistral', color: 'from-violet-500 to-violet-600' },
// ];

const getAIModels = (isAdmin: boolean) => {
  if (isAdmin) {
    return [
      { id: 'gpt4o', name: 'GPT-4o', color: 'from-green-500 to-emerald-600' },
      { id: 'grok', name: 'Claude', color: 'from-orange-500 to-red-600' },
      { id: 'grok', name: 'Grok', color: 'from-black to-black' },
      { id: 'groq', name: 'Gemini', color: 'from-blue-500 to-blue-600' },
      { id: 'mistral', name: 'Mistral', color: 'from-violet-500 to-violet-600' },
    ];
  } else {
    return [
      { id: 'gpt4o', name: 'INDX1000', color: 'from-[#050E3C] to-[#050E3C]' },
    ];
  }
};

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;
  const [isAdmin, setIsAdmin] = useState(false);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModel, setActiveModel] = useState('gpt4o');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/is-admin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setIsAdmin(data.is_admin);
      } catch (error) {
        console.error('Failed to check admin status');
      }
    };

    checkAdminStatus();
    fetchResult();
  }, [testId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchResult();
  }, [testId]);

  const fetchResult = async () => {
    try {
      const response = await resultAPI.getResult(parseInt(testId));
      setResult(response.data);
    } catch (err) {
      console.error('Failed to fetch result');
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

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-600">Result not found</h2>
          <button onClick={() => router.push('/demo')} className="btn-primary mt-4">
            Go to Tests
          </button>
        </div>
      </div>
    );
  }

  const currentAnalysis = result.analyses[activeModel];

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/demo')}
          className="flex items-center space-x-2 text-gray-600 hover:text-[#050E3C] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Tests</span>
        </button>

        {/* Header */}
        <div className="card mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">{result.test_name}</h1>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                {new Date(result.completed_at).toLocaleDateString()}
              </span>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-[#050E3C]">
                INDX1000: <span className="text-3xl">{result.score.toFixed(0)}</span> / 1000
              </p>
            </div>
          </div>
        </div>

        {/* AI Model Selector */}
        {/* <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Select AI Analysis:</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setActiveModel(model.id)}
                className={`p-4 rounded-lg font-semibold transition-all ${activeModel === model.id
                  ? `bg-gradient-to-br ${model.color} text-white shadow-lg scale-105`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {model.name}
                {result.analyses[model.id]?.error && (
                  <span className="block text-xs mt-1 opacity-75">(Error)</span>
                )}
              </button>
            ))}
          </div>
        </div> */}

        {/* AI Model Selector */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Select AI Analysis:</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {getAIModels(isAdmin).map((model) => (
              <button
                key={model.id}
                onClick={() => setActiveModel(model.id)}
                className={`p-4 font-semibold transition-all ${activeModel === model.id
                    ? `bg-gradient-to-br ${model.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {model.name}
                {result.analyses[model.id]?.error && (
                  <span className="block text-xs mt-1 opacity-75">(Error)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {currentAnalysis?.error && (
          <div className="card mb-8 bg-red-50 border-red-200">
            <p className="text-red-600">Error loading this analysis: {currentAnalysis.error}</p>
          </div>
        )}

        {/* Analysis Content */}
        {!currentAnalysis?.error && currentAnalysis && (
          <>
            {/* Performance Analysis */}
            <div className="card mb-8 animate-slide-up">
              <h2 className="text-2xl font-bold mb-4">Performance Analysis</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {currentAnalysis.detailed_analysis}
              </p>
            </div>

            {/* Question Feedback */}
            <div className="card mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h2 className="text-2xl font-bold mb-6">Complete Analysis</h2>
              <div className="space-y-4">
                {currentAnalysis.question_feedback?.map((feedback: any, index: number) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 p-6 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg">Sequence {feedback.question_number}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card animate-slide-up" style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-bold mb-4 text-[#050E3C]">Strengths</h2>
                <ul className="space-y-3">
                  {currentAnalysis.strengths?.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-[#050E3C]">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card animate-slide-up" style={{ animationDelay: '300ms' }}>
                <h2 className="text-2xl font-bold mb-4 text-[#050E3C]">Areas for Improvement</h2>
                <ul className="space-y-3">
                  {currentAnalysis.improvements?.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-[#050E3C]">⚠</span>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
              <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {currentAnalysis.recommendations?.[0] || currentAnalysis.recommendations}
              </p>

              {/* <div className="flex flex-wrap gap-4">
                <button onClick={() => router.push('/demo')} className="btn-primary">
                  Take Another Test
                </button>
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}