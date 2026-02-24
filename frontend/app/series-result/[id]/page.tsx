'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, Download, Mail } from 'lucide-react';
import { seriesTestAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';

const getAIModels = (isAdmin: boolean) => {
  if (isAdmin) {
    return [
      { id: 'gpt4o', name: 'GPT-4o', color: 'from-black to-black' },
      { id: 'claude', name: 'Claude', color: 'from-orange-500 to-red-600' },
      { id: 'grok', name: 'Grok', color: 'from-green-500 to-emerald-600' },
      { id: 'groq', name: 'Gemini', color: 'from-blue-500 to-blue-600' },
      { id: 'mistral', name: 'Mistral', color: 'from-violet-500 to-violet-600' },
    ];
  } else {
    return [
      { id: 'gpt4o', name: 'INDX1000', color: 'from-[#050E3C] to-[#050E3C]' },
    ];
  }
};

export default function SeriesResultPage() {
  const router = useRouter();
  const params = useParams();
  const testId = parseInt(params.id as string);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModel, setActiveModel] = useState('gpt4o');
  const [isAdmin, setIsAdmin] = useState(false);
  const [analysisInProgress, setAnalysisInProgress] = useState(false);

  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloadingQAA, setDownloadingQAA] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    checkAdminStatus();
    fetchResult();
  }, [testId]);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/is-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIsAdmin(data.is_admin);
    } catch (error) {
      console.error('Failed to check admin status');
    }
  };

  const fetchResult = async () => {
    try {
      const response = await seriesTestAPI.getResult(testId);
      setResult(response.data);
      setAnalysisInProgress(false);
    } catch (err: any) {
      // Check if analysis is still in progress (400 = test not completed yet)
      if (err.response?.status === 400 && err.response?.data?.detail === 'Test not completed yet') {
        setAnalysisInProgress(true);
        // Poll for completion
        pollForCompletion();
      } else {
        console.error('Failed to fetch result');
        toast.error('Failed to load results');
      }
    } finally {
      setLoading(false);
    }
  };

  const pollForCompletion = async () => {
    const maxAttempts = 60; // Poll for up to 5 minutes
    let attempts = 0;

    const poll = async (): Promise<void> => {
      try {
        const statusResponse = await seriesTestAPI.getAnalysisStatus(testId);

        if (statusResponse.data.is_completed) {
          // Analysis complete - fetch full results
          setAnalysisInProgress(false);
          const response = await seriesTestAPI.getResult(testId);
          setResult(response.data);
          toast.success('Analysis complete!');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          // Wait 5 seconds before next poll
          await new Promise(resolve => setTimeout(resolve, 5000));
          return poll();
        } else {
          toast.error('Analysis is taking longer than expected. Please refresh the page.');
          setAnalysisInProgress(false);
        }
      } catch (err) {
        console.error('Failed to check analysis status');
        setAnalysisInProgress(false);
      }
    };

    await poll();
  };

  const handleDownloadQAA = async () => {
    setDownloadingQAA(true);
    try {
      const response = await seriesTestAPI.downloadQAAPDF(testId, activeModel);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `INDX1000_QAA_${activeModel.toUpperCase()}_${result.test_name.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('QAA PDF downloaded!');
    } catch (err) {
      toast.error('Failed to download QAA PDF');
    } finally {
      setDownloadingQAA(false);
    }
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      await seriesTestAPI.sendEmail(testId);
      toast.success('Result sent to email!');
      fetchResult(); // Refresh to show email_sent status
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to send email';
      toast.error(errorMsg);
    } finally {
      setSendingEmail(false);
    }
  };

  const formatTime = (seconds: number | null): string => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getSeriesColor = (type: string): string => {
    switch (type) {
      case 'mono':
        return 'from-[#050E3C] to-[#050E3C]';
      case 'bi':
        return 'from-[#050E3C] to-[#050E3C]';
      case 'tri':
        return 'from-[#050E3C] to-[#050E3C]';
      default:
        return 'from-[#050E3C] to-[#050E3C]';
    }
  };

  const handleCopyAnalysis = () => {
    const currentAnalysis = result?.analyses?.[activeModel];
    if (!currentAnalysis) return;

    const analysisText = `
Index de lecture:
${currentAnalysis.index?.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n')}

Analyse synthetique continue:
${currentAnalysis.analysis}

Projection operatoire:
${currentAnalysis.operational_projection}

Index intercognitif brut:
INDX1000 : ${result.score?.toFixed(0)}
    `.trim();

    navigator.clipboard
      .writeText(analysisText)
      .then(() => {
        toast.success('Analysis copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy analysis');
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  // Analysis still in progress
  if (analysisInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C] mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-[#050E3C] mb-2">Analyse en cours...</h2>
          <p className="text-gray-600 mb-4">
            L'analyse de vos réponses est en cours. Cette opération prend environ 2-3 minutes.
          </p>
          <p className="text-sm text-gray-500">
            Vous recevrez automatiquement vos résultats par e-mail une fois l'analyse terminée.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 text-gray-500 underline cursor-pointer"
          >
            Retourner à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600">Result not found</h2>
          <button onClick={() => router.push('/')} className="btn-primary mt-4">
            Back to Platform
          </button>
        </div>
      </div>
    );
  }

  const currentAnalysis = result.analyses?.[activeModel];

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-[#050E3C] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Platform</span>
        </button>

        {/* Header */}
        <div className={`bg-linear-to-r ${getSeriesColor(result.series_type)} text-white p-6 mb-8`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{result.test_name}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/20 text-sm">
                  {result.series_type.toUpperCase()} Series
                </span>
                <span className="px-3 py-1 bg-white/20 text-sm">
                  {result.total_modules} Modules
                </span>
                <span className="px-3 py-1 bg-white/20 text-sm">
                  {result.total_questions} Questions
                </span>
              </div>
            </div>
            {result.completed_at && (
              <div className="text-center">
                <p className="text-white/80 text-sm">Completed</p>
                <p className="font-semibold">{new Date(result.completed_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Time Tracking */}
        <div className="bg-white shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2" size={20} />
            Time Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">Module 1</p>
              <p className="text-xl font-bold text-gray-900">{formatTime(result.module_1_time_taken)}</p>
            </div>
            {result.total_modules >= 2 && (
              <div className="bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">Module 2</p>
                <p className="text-xl font-bold text-gray-900">{formatTime(result.module_2_time_taken)}</p>
              </div>
            )}
            {result.total_modules >= 3 && (
              <div className="bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">Module 3</p>
                <p className="text-xl font-bold text-gray-900">{formatTime(result.module_3_time_taken)}</p>
              </div>
            )}
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="text-xl font-bold text-gray-900">{formatTime(result.total_time_taken)}</p>
            </div>
          </div>
        </div>

        {/* AI Model Selector */}
        <div className="bg-white shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {getAIModels(isAdmin).map((model) => (
              <button
                key={model.id}
                onClick={() => setActiveModel(model.id)}
                className={`p-4 font-semibold transition-all ${
                  activeModel === model.id
                    ? `bg-linear-to-br ${model.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {model.name}
                {result.analyses?.[model.id]?.error && (
                  <span className="block text-xs mt-1 opacity-75">(Error)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons - Copy, QAA Download */}
        {isAdmin && !currentAnalysis?.error && currentAnalysis && (
          <div className="mb-6 flex space-x-3">
            <button
              onClick={handleCopyAnalysis}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
            >
              Copy Analysis
            </button>

            <button
              onClick={handleDownloadQAA}
              disabled={downloadingQAA}
              className="flex items-center space-x-2 px-4 py-2 bg-[#050E3C] hover:bg-[#050E3C]/90 text-white font-medium transition-colors disabled:opacity-50"
            >
              {downloadingQAA ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Download size={16} />
              )}
              <span>QAA</span>
            </button>
          </div>
        )}

        {/* Error Display */}
        {currentAnalysis?.error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-8">
            <p className="text-red-600">Error loading this analysis: {currentAnalysis.error}</p>
          </div>
        )}

        {/* Analysis Content */}
        {!currentAnalysis?.error && currentAnalysis && (
          <div className="space-y-6">
            {/* Index */}
            <div className="bg-white shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Index de lecture</h3>
              <ol className="list-decimal list-inside space-y-2">
                {currentAnalysis.index?.map((item: string, index: number) => (
                  <li key={index} className="text-gray-700 text-base pl-2">
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            {/* Analysis */}
            <div className="bg-white shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Analyse synthetique continue</h3>
              <div className="text-gray-700 leading-relaxed text-base space-y-4">
                {currentAnalysis.analysis?.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>
            </div>

            {/* Operational Projection */}
            <div className="bg-white shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Projection operatoire</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {currentAnalysis.operational_projection}
              </p>
            </div>

            {/* Score */}
            <div className="bg-white shadow-md border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-800 mb-2">
                Index intercognitif brut{' '}
                <span className="text-gray-600 font-normal">by</span>{' '}
                <span
                  className={`bg-linear-to-br ${
                    getAIModels(isAdmin).find((m) => m.id === activeModel)?.color
                  } text-white px-2 py-1 text-xs font-semibold`}
                >
                  {getAIModels(isAdmin).find((m) => m.id === activeModel)?.name}
                </span>
              </h3>
              <p className="text-2xl font-bold text-[#050E3C]">
                INDX<sub className="text-xl">1000</sub> :{' '}
                {currentAnalysis.overall_score
                  ? currentAnalysis.overall_score.toFixed(0)
                  : result.score?.toFixed(0) || 'N/A'}
              </p>
            </div>

            {/* Send Email Button */}
            {isAdmin && (
              <div className="bg-white shadow-md p-6">
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail || result.email_sent}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#050E3C] text-white font-semibold hover:bg-[#050E3C]/90 transition-colors disabled:opacity-50"
                >
                  {sendingEmail ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Mail size={20} />
                  )}
                  <span>
                    {sendingEmail ? 'Sending...' : result.email_sent ? 'Email Sent ✓' : 'Send analysis'}
                  </span>
                </button>
              </div>
            )}

            {/* Feedback Section */}
            <div className="bg-white shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Retour (Beta) :</h3>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Chaque retour est scrupuleusement etudie et recoit une reponse rapide."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 focus:border-[#050E3C] focus:ring-1 focus:ring-[#050E3C] outline-none resize-none"
              />
              <button
                onClick={async () => {
                  if (feedback.trim()) {
                    setSubmittingFeedback(true);
                    try {
                      await seriesTestAPI.submitFeedback(testId, feedback);
                      toast.success('Feedback submitted!');
                      setFeedback('');
                    } catch (error) {
                      toast.error('Failed to submit feedback');
                    } finally {
                      setSubmittingFeedback(false);
                    }
                  }
                }}
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
