'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Clock, Send, AlertCircle, ArrowRight } from 'lucide-react';
import { seriesTestAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';

interface Question {
  question_id: number;
  question_text: string;
  expected_criteria?: string;
}

interface TestData {
  id: number;
  series_type: string;
  test_name: string;
  total_questions: number;
  total_modules: number;
  current_module: number;
  timer_per_module: number;
  break_duration: number;
  module_1_questions: Question[];
  module_1_status: string;
  module_2_questions?: Question[];
  module_2_status?: string;
  module_3_questions?: Question[];
  module_3_status?: string;
  is_completed: boolean;
}

// Series config for displaying info before test creation
const SERIES_CONFIG: { [key: string]: { name: string; displayName: string; sequences: string; duration: string; modules: number; break_minutes: number } } = {
  mono: { name: 'M1 Series', displayName: 'Série M1', sequences: '1 × 28 séquences', duration: '65 minutes', modules: 1, break_minutes: 0 },
  bi: { name: 'M2 Series', displayName: 'Série M2', sequences: '2 × 22 séquences', duration: '90 minutes', modules: 2, break_minutes: 15 },
  tri: { name: 'M3 Series', displayName: 'Série M3', sequences: '3 × 22 séquences', duration: '120 minutes', modules: 3, break_minutes: 15 },
  mt: { name: 'M1 Test Series', displayName: 'Série M1-T', sequences: '1 × 3 séquences', duration: '10 minutes', modules: 1, break_minutes: 0 },
  bt: { name: 'M2 Test Series', displayName: 'Série M2-T', sequences: '2 × 2 séquences', duration: '15 minutes', modules: 2, break_minutes: 2 },
  tt: { name: 'M3 Test Series', displayName: 'Série M3-T', sequences: '3 × 2 séquences', duration: '20 minutes', modules: 3, break_minutes: 2 },
};

type TestPhase = 'test' | 'break' | 'submitting';

export default function SeriesTestPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const idParam = params.id as string;
  const isNewTest = idParam === 'new';
  const seriesType = searchParams.get('type') || '';
  const skipInfo = searchParams.get('skipInfo') === 'true';

  const [testId, setTestId] = useState<number | null>(isNewTest ? null : parseInt(idParam));
  const [test, setTest] = useState<TestData | null>(null);
  const [currentModule, setCurrentModule] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(!isNewTest);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [moduleStartTime, setModuleStartTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Break state
  const [phase, setPhase] = useState<TestPhase>('test');
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);
  const [skipBreak, setSkipBreak] = useState(false);
  const breakTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Info modal state - show for new tests, skip if coming from guest registration
  const [showInfoModal, setShowInfoModal] = useState(isNewTest && !skipInfo);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (!isNewTest && testId) {
      fetchTestData();
    } else if (isNewTest && skipInfo) {
      // Guest already registered, create test immediately
      createAndStartTest();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breakTimerRef.current) clearInterval(breakTimerRef.current);
    };
  }, []);

  const fetchTestData = async () => {
    if (!testId) return;

    try {
      const storedTest = localStorage.getItem(`series_test_${testId}`);
      if (storedTest) {
        const testData = JSON.parse(storedTest) as TestData;
        setTest(testData);
        initializeModule(testData, 1);
      } else {
        const response = await seriesTestAPI.getTest(testId);
        setTest(response.data);
        localStorage.setItem(`series_test_${testId}`, JSON.stringify(response.data));
        initializeModule(response.data, 1);
      }
    } catch (err) {
      console.error('Failed to load test');
      toast.error('Failed to load test');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const createAndStartTest = async () => {
    setIsCreatingTest(true);
    try {
      const response = await seriesTestAPI.startTest(seriesType);
      const newTestId = response.data.id;
      const testData = response.data as TestData;

      setTestId(newTestId);
      setTest(testData);
      localStorage.setItem(`series_test_${newTestId}`, JSON.stringify(testData));

      // Update URL without full navigation
      window.history.replaceState({}, '', `/series-test/${newTestId}`);

      initializeModule(testData, 1);
      setShowInfoModal(false);
    } catch (err) {
      console.error('Failed to create test');
      toast.error('Failed to start test. Please try again.');
      router.push('/');
    } finally {
      setIsCreatingTest(false);
      setLoading(false);
    }
  };

  const initializeModule = async (testData: TestData, moduleNum: number) => {
    let moduleQuestions: Question[] = [];

    if (moduleNum === 1) {
      moduleQuestions = testData.module_1_questions;
    } else if (moduleNum === 2 && testData.module_2_questions) {
      moduleQuestions = testData.module_2_questions;
    } else if (moduleNum === 3 && testData.module_3_questions) {
      moduleQuestions = testData.module_3_questions;
    }

    setQuestions(moduleQuestions);
    setCurrentModule(moduleNum);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer('');
    setPhase('test');

    const timerMinutes = testData.timer_per_module;
    setTimeRemaining(timerMinutes * 60);
    setModuleStartTime(Date.now());

    try {
      await seriesTestAPI.startModule(testData.id, moduleNum);
    } catch (err) {
      console.error('Failed to mark module as started');
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) {
      setError('Please answer the question before proceeding');
      return;
    }

    setError('');
    const currentQuestion = questions[currentQuestionIndex];

    // Save answer
    const newAnswers = { ...answers, [currentQuestion.question_id]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer('');

    // Move to next question or submit
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question - submit module
      handleSubmitModule(newAnswers);
    }
  };

  const pollForAnalysisCompletion = async (testIdToPoll: number) => {
    const maxAttempts = 60; // Poll for up to 5 minutes (5 seconds * 60)
    let attempts = 0;

    const poll = async (): Promise<void> => {
      try {
        const response = await seriesTestAPI.getAnalysisStatus(testIdToPoll);

        if (response.data.is_completed) {
          // Analysis complete - redirect to results
          toast.success('Test completed! Results are ready.');
          router.push(`/series-result/${testIdToPoll}`);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          // Update status message based on time elapsed
          if (attempts > 24) {
            setAnalysisStatus('Finalizing analysis...');
          } else if (attempts > 12) {
            setAnalysisStatus('Processing results...');
          } else if (attempts > 4) {
            setAnalysisStatus('Analyzing responses...');
          }

          // Wait 5 seconds before next poll
          await new Promise(resolve => setTimeout(resolve, 5000));
          return poll();
        } else {
          // Max attempts reached - still redirect to results page
          // User can refresh there to see results when ready
          toast.success('Analysis in progress. You will receive results via email.');
          router.push(`/series-result/${testIdToPoll}`);
        }
      } catch (err) {
        console.error('Failed to check analysis status');
        // On error, still try to go to results page
        router.push(`/series-result/${testIdToPoll}`);
      }
    };

    await poll();
  };

  const handleSubmitModule = async (finalAnswers: { [key: number]: string }) => {
    if (!testId) return;

    const timeTakenSeconds = Math.floor((Date.now() - moduleStartTime) / 1000);
    const isLastModule = currentModule === test?.total_modules;

    // Show submitting modal for last module
    if (isLastModule) {
      setPhase('submitting');
      setAnalysisStatus('Saving your answers...');
    }

    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(finalAnswers).map(([questionId, answerText]) => ({
        question_id: parseInt(questionId),
        answer_text: answerText,
      }));

      const response = await seriesTestAPI.submitModule({
        test_id: testId,
        module_number: currentModule,
        answers: formattedAnswers,
        time_taken_seconds: timeTakenSeconds,
      });

      if (timerRef.current) clearInterval(timerRef.current);

      if (response.data.is_final) {
        // Analysis runs in background - poll for completion
        if (response.data.analysis_in_progress) {
          setAnalysisStatus('Analyzing responses...');
          await pollForAnalysisCompletion(testId);
        } else {
          // Fallback for immediate completion (shouldn't happen with background tasks)
          toast.success('Test completed!');
          router.push(`/series-result/${testId}`);
        }
      } else {
        toast.success(`Module ${currentModule} completed!`);
        startBreak();
      }
    } catch (err) {
      setError('Failed to submit module. Please try again.');
      toast.error('Submission failed');
      setPhase('test');
    } finally {
      setSubmitting(false);
    }
  };

  const startBreak = () => {
    setPhase('break');
    setSkipBreak(false);

    if (!test) return;

    const breakMinutes = test.break_duration;
    setBreakTimeRemaining(breakMinutes * 60);

    if (breakTimerRef.current) clearInterval(breakTimerRef.current);
    breakTimerRef.current = setInterval(() => {
      setBreakTimeRemaining((prev) => {
        if (prev <= 1) {
          if (breakTimerRef.current) clearInterval(breakTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleContinueToNextModule = () => {
    if (breakTimerRef.current) clearInterval(breakTimerRef.current);
    if (test) {
      initializeModule(test, currentModule + 1);
    }
  };

  const handleCancelTest = async () => {
    if (!testId) {
      router.push('/');
      return;
    }

    try {
      await seriesTestAPI.deleteTest(testId);
      localStorage.removeItem(`series_test_${testId}`);
      router.push('/');
      toast.success('Test cancelled successfully');
    } catch (err) {
      console.error('Failed to cancel test');
      toast.error('Failed to cancel test. Please try again.');
    }
  };

  const handleStartTest = async () => {
    // Create the test when user clicks Commencer
    await createAndStartTest();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeriesColor = (type: string): string => {
    switch (type) {
      case 'mono': case 'mt': return 'from-[#050E3C] to-[#050E3C]';
      case 'bi': case 'bt': return 'from-[#050E3C] to-[#050E3C]';
      case 'tri': case 'tt': return 'from-[#050E3C] to-[#050E3C]';
      default: return 'from-[#050E3C] to-[#050E3C]';
    }
  };

  // Info modal for new tests (before test is created)
  if (showInfoModal && isNewTest) {
    const config = SERIES_CONFIG[seriesType] || { name: 'Series Test', displayName: 'Série', sequences: '', duration: '', modules: 1, break_minutes: 0 };

    return (
      <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-30">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-[#050E3C] mb-2">
                INDX1000 – {config.displayName}
              </h1>
              <p className="text-md text-gray-700">
                {config.sequences} – {config.duration} (version bêta v1.0)
              </p>
            </div>

            {/* Main description */}
            <div className="space-y-4 text-md text-gray-900 leading-relaxed">
              <p>
                Vous allez débuter une session INDX1000.<br />
                Cette session consiste à observer, à travers une série de séquences, la conduite d'une interaction avec un système artificiel non déterministe.
              </p>

              <p>
                Il ne s'agit ni d'un test de connaissances ni d'une évaluation d'expertise : INDX1000 analyse une dynamique, non des réponses ponctuelles isolées. Il n'existe ni bon ni mauvais retour : répondez de manière concise, 10 lignes maximum (la clarté prime sur la longueur).
              </p>

              <div className="mt-6">
                <p className="font-semibold mb-2">Modalités :</p>
                <ul className="space-y-1 text-gray-900">
                  <li>Chaque séquence requiert une réponse.</li>
                  <li>Les réponses ne sont ni modifiables ni consultables après validation.</li>
                  <li>Le respect du temps imparti et le renseignement de toutes des séquences de la série conditionnent l'analyse.</li>
                  <li>Aucune limite de temps n'est fixée par séquence au sein de la série.</li>
                </ul>
              </div>

              <p className="mt-4">
                Vous pourrez accéder à l'issue de cette session à son analyse, en ligne dans un délai de 3 minutes.<br />
                Le compte rendu de cette analyse vous sera par ailleurs transmis par e-mail.
              </p>

              <p>
                Nous répondrons à tout retour sur cette session (capturable en fin de session).
              </p>

              {/* Checkbox for acceptance */}
              <label className="flex items-start space-x-3 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#050E3C] border-gray-300 rounded focus:ring-[#050E3C]"
                />
                <span className="text-gray-900">
                  J'ai lu et j'accepte les conditions d'utilisation d'INDX1000 – {config.displayName}.
                </span>
              </label>
            </div>

            <div className="pt-8 flex space-x-4">
              <button
                onClick={handleStartTest}
                disabled={isCreatingTest || !acceptedTerms}
                className="px-6 py-3 bg-[#050E3C] text-white text-md font-semibold hover:bg-[#050E3C]/90 transition-colors disabled:opacity-50"
              >
                {isCreatingTest ? 'Démarrage...' : 'Commencer'}
              </button>

              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 text-gray-500 text-md font-semibold underline cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || isCreatingTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C] mx-auto mb-4"></div>
          <p className="text-gray-600">{isCreatingTest ? 'Starting test...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600">Test not found</h2>
          <button onClick={() => router.push('/')} className="btn-primary mt-4">
            Back to Platform
          </button>
        </div>
      </div>
    );
  }

  // Break Phase
  if (phase === 'break') {
    const canContinue = breakTimeRemaining === 0 || skipBreak;

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Module {currentModule} Completed
            </h1>
            <p className="text-gray-600">
              Take a break before starting Module {currentModule + 1}
            </p>
          </div>

          <div className="bg-gray-50 p-6 mb-6">
            <p className="text-sm text-gray-500 text-center mb-2">Break Time Remaining</p>
            <p className="text-5xl font-bold text-center text-gray-900">
              {formatTime(breakTimeRemaining)}
            </p>
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={skipBreak}
                onChange={(e) => setSkipBreak(e.target.checked)}
                className="w-5 h-5 text-[#050E3C] border-gray-300 rounded focus:ring-[#050E3C]"
              />
              <span className="text-gray-700">Cancel break and start next module</span>
            </label>
          </div>

          <button
            onClick={handleContinueToNextModule}
            disabled={!canContinue}
            className={`w-full py-4 font-semibold text-white flex items-center justify-center space-x-2 transition-all ${canContinue
                ? `bg-linear-to-r ${getSeriesColor(test.series_type)} hover:opacity-90`
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            <span>Continue to Module {currentModule + 1}</span>
            <ArrowRight size={20} />
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Module {currentModule} of {test.total_modules} completed</p>
          </div>
        </div>
      </div>
    );
  }

  // Test Phase - One question at a time
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <>
      {/* Submitting Modal Overlay */}
      {phase === 'submitting' && (
        <div className="fixed inset-0 bg-gray-800/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C]"></div>
            <p className="text-lg font-semibold text-[#050E3C]">{analysisStatus}</p>
            <p className="text-sm text-gray-600 text-center">
              L'analyse prend environ 2-3 minutes. Vous pouvez quitter cette page -
              vous recevrez automatiquement vos résultats par e-mail.
            </p>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative bg-red-500 text-white px-6 py-2 hover:bg-red-700">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-1 right-1 bg-white text-black text-xs w-5 h-5 flex items-center justify-center border border-gray-300"
              aria-label="Close"
            >
              ✕
            </button>
            <button
              onClick={handleCancelTest}
              className="text-white text-lg font-medium px-3 py-1.5 leading-tight cursor-pointer me-2"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Test Name Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#050E3C]">
              {test.test_name}
            </h1>
            <div className="flex items-center space-x-2 text-[#050E3C]">
              <Clock size={20} />
              <span className={`text-xl font-bold ${timeRemaining < 300 ? 'text-red-500' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 flex items-center space-x-2 text-red-700 mb-6">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Question Card - matching old test format */}
          <div className="card mb-8 rounded-none">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-[#050E3C] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">{currentQuestionIndex + 1}</span>
              </div>
              <div className="grow">
                <h2 className="whitespace-pre-line text-lg text-[#050E3C]">
                  {currentQuestion?.question_text}
                </h2>
              </div>
            </div>

            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Saisissez votre réponse ici..."
              rows={12}
              className="input-field resize-none text-lg"
              autoFocus
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            {/* Cancel link */}
            <span
              onClick={() => setShowCancelModal(true)}
              className="text-xl text-gray-500 underline cursor-pointer"
            >
              Cancel
            </span>

            {/* Next/Submit Button */}
            <button
              onClick={handleNextQuestion}
              disabled={submitting || !currentAnswer.trim()}
              className="btn-primary flex items-center space-x-2 text-lg disabled:opacity-50"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : isLastQuestion ? (
                <>
                  <Send size={20} />
                  <span>Submit</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
