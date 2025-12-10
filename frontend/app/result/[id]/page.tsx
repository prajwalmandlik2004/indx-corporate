'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  Share2,
} from 'lucide-react';
import { resultAPI } from '@/src/lib/api';

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-600">Result not found</h2>
          <button onClick={() => router.push('/test-dashboard')} className="btn-primary mt-4">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/test-dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Score Card */}
        <div className="card mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">{result.test_name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                  {result.category}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                  {result.level.replace('_', ' ')}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                  {new Date(result.completed_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(
                  result.score
                )} flex items-center justify-center shadow-2xl mb-2`}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{result.score.toFixed(0)}</div>
                  <div className="text-sm text-white/90">Score</div>
                </div>
              </div>
              <div className="font-bold text-lg gradient-text">{getScoreLabel(result.score)}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
            <button className="btn-secondary flex items-center space-x-2">
              <Download size={18} />
              <span>Download Report</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Share2 size={18} />
              <span>Share Result</span>
            </button>
          </div>
        </div>

        {/* Analysis Overview */}
        <div className="card mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
            <Trophy className="text-green-600" size={28} />
            <span>Performance Analysis</span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {result.analysis.detailed_analysis}
          </p>
        </div>

        {/* Question Feedback */}
        <div className="card mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Target className="text-green-600" size={28} />
            <span>Question-by-Question Feedback</span>
          </h2>

          <div className="space-y-4">
            {result.analysis.question_feedback.map((feedback: any, index: number) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{feedback.question_number}</span>
                    </div>
                    <h3 className="font-bold text-lg">Question {feedback.question_number}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {feedback.score >= 70 ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <XCircle className="text-red-600" size={24} />
                    )}
                    <span className="font-bold text-lg">{feedback.score}%</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="card animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2 text-green-600">
              <TrendingUp size={28} />
              <span>Strengths</span>
            </h2>
            <ul className="space-y-3">
              {result.analysis.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="card animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2 text-orange-600">
              <TrendingDown size={28} />
              <span>Areas for Improvement</span>
            </h2>
            <ul className="space-y-3">
              {result.analysis.improvements.map((improvement: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <Target className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-2xl font-bold mb-4 gradient-text">Personalized Recommendations</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            {result.analysis.recommendations}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/test-platform')}
              className="btn-primary"
            >
              Take Another Test
            </button>
            <button
              onClick={() => router.push('/test-dashboard')}
              className="btn-secondary"
            >
              View All Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
