'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, Mail, Share2 } from 'lucide-react';
import { emailAPI, resultAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';

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
      { id: 'claude', name: 'Claude', color: 'from-orange-500 to-red-600' },
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

  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      await emailAPI.sendResult(parseInt(testId));
      toast.success('Result sent to your email!');
      fetchResult(); // Refresh to show email_sent status
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to send email';
      toast.error(errorMsg);
    } finally {
      setSendingEmail(false);
    }
  };

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

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter feedback');
      return;
    }

    setSubmittingFeedback(true);
    try {
      await resultAPI.submitFeedback(parseInt(testId), feedback);
      toast.success('Feedback submitted successfully!');
      setFeedback('');
    } catch (err) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleSequentialClick = () => {
    router.push(`/result/${testId}/sequential/${activeModel}`);
  };

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {isAdmin && (
          <button
            onClick={() => router.push('/test-dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#050E3C] transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        )}

        {/* Header */}
        <div className="card mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-2 md:mb-0 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{result.test_name}</h1>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                {new Date(result.completed_at).toLocaleDateString()}
              </span>
            </div>

            {/* <div className="text-center">
              <p className="text-2xl font-bold text-[#050E3C]">
                INDX1000: <span className="text-3xl">{result.score.toFixed(0)}</span> / 1000
              </p>
            </div> */}
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
          {/* <h2 className="text-xl font-bold mb-4">Select AI Analysis:</h2> */}
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
          <div className="space-y-6">

            {/* 1. INDEX - Numbered list with title */}
            <div className="card animate-slide-up">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Index de lecture</h3>
              <ol className="list-decimal list-inside space-y-2">
                {currentAnalysis.index?.map((item: string, index: number) => (
                  <li key={index} className="text-gray-700 text-base pl-2">
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            {/* 2. ANALYSIS - Title + Paragraphs with spacing */}
            <div className="card animate-slide-up" style={{ animationDelay: '100ms' }}>
              {/* <h3 className="text-lg font-semibold mb-4 text-gray-800">Analyse synthétique continue</h3> */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 inline">
                  Analyse synthétique continue
                  {isAdmin && (
                    <button
                      onClick={handleSequentialClick}
                      className="text-[#050E3C] font-medium text-lg ml-3 cursor-pointer hover:underline"
                    >
                      / Sequential
                    </button>
                  )}
                </h3>
              </div>
              <div className="text-gray-700 leading-relaxed text-base space-y-4">
                {currentAnalysis.analysis?.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>

            {/* 3. OPERATIONAL PROJECTION - With title */}
            <div className="card animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Projection opératoire</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {currentAnalysis.operational_projection}
              </p>
            </div>

            {/* 4. INDX SCORE - Compact format matching screenshot 2 */}
            <div className="card animate-slide-up bg-white border border-gray-200" style={{ animationDelay: '300ms' }}>
              <div className="py-4">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Index intercognitif brut</h3>
                <p className="text-2xl font-bold text-[#050E3C]">
                  INDX1000 : {result.score.toFixed(0)}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="card animate-slide-up" style={{ animationDelay: '350ms' }}>
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail || result.email_sent}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#050E3C] text-white font-semibold hover:bg-[#050E3C] transition-colors disabled:opacity-50"
                >
                  {sendingEmail ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Mail size={20} />
                  )}
                  <span>
                    {sendingEmail ? 'Sending...' : result.email_sent ? 'Email Sent ✓' : 'Send Result to Email'}
                  </span>
                </button>
              </div>
            )}

            {/* 5. FEEDBACK SECTION */}
            <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Retour (Beta) : </h3>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Chaque retour beta est scrupuleusement étudié et reçoit une réponse rapide."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:border-[#050E3C] focus:ring-1 focus:ring-[#050E3C] outline-none resize-none"
              />
              <button
                onClick={handleFeedbackSubmit}
                disabled={submittingFeedback || !feedback.trim()}
                className="mt-3 px-6 py-2 bg-[#050E3C] text-white font-semibold hover:bg-[#050E3C]/90 transition-colors disabled:opacity-50"
              >
                {submittingFeedback ? 'Sending...' : 'Send'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}