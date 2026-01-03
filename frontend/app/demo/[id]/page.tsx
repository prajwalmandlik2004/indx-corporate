'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Send } from 'lucide-react';
import { demoAPI, testAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function DemoTestPage() {
    const router = useRouter();
    const params = useParams();
    const testId = parseInt(params.id as string);

    const [test, setTest] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(false);
    const [analysisStatus, setAnalysisStatus] = useState('');

    const currentQuestion = test?.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === (test?.questions.length - 1);
    const canProceed = answers[currentQuestion?.question_id]?.trim().length > 0;

    const [showCancelModal, setShowCancelModal] = useState(false);

    const [showInfoModal, setShowInfoModal] = useState(true);

    const handleCancelTest = async () => {
        try {
            await testAPI.deleteTest(testId);
            router.push('/demo');
            toast.success('Test cancelled successfully');
        } catch (err) {
            console.error('Failed to cancel test');
            alert('Failed to cancel test. Please try again.');
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const data = searchParams.get('data');

        if (data) {
            setTest(JSON.parse(decodeURIComponent(data)));
        } else {
            const fetchTest = async () => {
                try {
                    const response = await demoAPI.getTest(testId);
                    setTest(response.data);
                } catch (err) {
                    console.error('Failed to fetch test');
                    router.push('/demo');
                }
            };
            fetchTest();
        }
    }, [testId]);

    const handleNext = () => {
        if (canProceed && !isLastQuestion) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // const handleSubmit = async () => {
    //     if (!canProceed) return;

    //     setLoading(true);
    //     try {
    //         const formattedAnswers = Object.entries(answers).map(([questionId, answerText]) => ({
    //             question_id: parseInt(questionId),
    //             answer_text: answerText,
    //         }));

    //         await demoAPI.submitTest(testId, formattedAnswers);
    //         router.push(`/demo/thank-you/${testId}`);
    //     } catch (err) {
    //         console.error('Failed to submit test');
    //         alert('Failed to submit test. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async () => {
        if (!canProceed) return;

        setLoading(true);
        setAnalysisStatus('Submitting your answers...');

        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answerText]) => ({
                question_id: parseInt(questionId),
                answer_text: answerText,
            }));

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 140000);

            // Show progress messages
            setTimeout(() => setAnalysisStatus('Analyzing with GPT-4o...'), 2000);
            setTimeout(() => setAnalysisStatus('Analyzing with Claude...'), 20000);
            setTimeout(() => setAnalysisStatus('Analyzing with Grok...'), 30000);
            setTimeout(() => setAnalysisStatus('Analyzing with Gemini...'), 40000);
            setTimeout(() => setAnalysisStatus('Analyzing with Mistral...'), 50000);
            setTimeout(() => setAnalysisStatus('Finalizing results...'), 60000);

            await demoAPI.submitTest(testId, formattedAnswers);

            clearTimeout(timeoutId);
            router.push(`/demo/thank-you/${testId}`);
        } catch (err: any) {
            console.error('Failed to submit test:', err);

            if (err.name === 'AbortError') {
                alert('Analysis is taking longer than expected. Please check results page in a few moments.');
                router.push(`/demo/thank-you/${testId}`);
            } else {
                alert('Analysis is taking longer than expected. Please check results page in a few moments.');
                router.push(`/demo/thank-you/${testId}`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!test) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C]"></div>
            </div>
        );
    }

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-gray-800/20 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 max-w-md">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C]"></div>
                        <p className="text-lg font-semibold text-[#050E3C]">{analysisStatus}</p>
                        <p className="text-sm text-gray-600 text-center">
                            This may take up to 5 minutes. Please don't close this page.
                        </p>
                    </div>
                </div>
            )}

            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="relative bg-red-500 text-white px-6 py-2 hover:bg-red-700">

                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="absolute top-1 right-1 
                   bg-white text-black text-xs w-5 h-5 flex items-center 
                   justify-center border border-gray-300"
                            aria-label="Close"
                        >
                            ✕
                        </button>

                        <button
                            onClick={handleCancelTest}
                            className="text-white 
                   text-lg font-medium px-3 py-1.5 leading-tight cursor-pointer me-2"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {showInfoModal && (
                <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 py-25">
                        <div className="space-y-8">
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-bold text-[#050E3C] mb-3">
                                    INDX1000 – {test.test_name}
                                </h1>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Session d'évaluation – Informations préalables
                                </h2>
                            </div>

                            {/* Main description - with proper spacing */}
                            <div className="space-y-5">
                                <p className="text-gray-700 leading-relaxed">
                                    Vous allez débuter une session d'évaluation INDX1000, conçue pour observer votre
                                    trajectoire d'interaction cognitive avec un système artificiel.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    Cette évaluation ne mesure ni vos connaissances, ni votre expertise technique, ni votre
                                    familiarité avec l'intelligence artificielle.
                                    Elle se concentre exclusivement sur la manière dont vous structurez, orientez et ajustez une
                                    interaction avec un système non déterministe.
                                </p>
                            </div>

                            {/* Before you begin section */}
                            <div>
                                <h3 className="text-lg font-bold text-[#050E3C] mb-3">
                                    Avant de commencer
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Il n'existe ni bonne ni mauvaise réponse.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Il ne s'agit pas d'un test de connaissances.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                            Ce qui est observé n'est pas ce que vous savez, mais la façon dont vous
                                            raisonnez et réajustez votre approche.
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                            Les réponses doivent rester concises, dans une limite d'environ dix lignes.
                                            La clarté prime sur la longueur.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Test mindset section */}
                            <div>
                                <h3 className="text-lg font-bold text-[#050E3C] mb-3">
                                    Esprit du test
                                </h3>
                                <div className="space-y-3 text-gray-700">
                                    <p>Prenez le temps de lire chaque énoncé avec attention.
                                        Répondez de manière sincère, sans chercher à anticiper ce qui pourrait être attendu,
                                        ni à « performer ».
                                    </p>
                                    <p>
                                        INDX1000 observe des dynamiques d'interaction dans la durée, et non des réponses isolées.
                                        Il évalue une dynamique de pilotage cognitif, et non une performance ponctuelle.
                                    </p>
                                </div>
                            </div>

                            {/* Start button */}
                            <div className="pt-6">
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="w-full px-8 py-4 bg-[#050E3C] text-white font-semibold hover:bg-[#050E3C]/90 transition-colors"
                                >
                                    Commencer le test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}





            <div className="min-h-screen px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Progress */}
                    {/* <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-600">
                                Question {currentQuestionIndex + 1} sur {test.questions.length}
                            </span>
                            <span className="text-sm font-semibold text-[#050E3C]">
                                {Math.round(((currentQuestionIndex + 1) / test.questions.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-[#050E3C] to-[#050E3C] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div> */}

                    {/* Test Name */}
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-[#050E3C]">
                            {test.test_name}
                        </h1>
                    </div>

                    {/* Question Card */}
                    <div className="card mb-8 rounded-none">
                        <div className="flex items-start space-x-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#050E3C] to-[#050E3C]  flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">{currentQuestionIndex + 1}</span>
                            </div>
                            <div className="flex-grow">
                                <h2 className="whitespace-pre-line text-lg text-[#050E3C] mb-4">
                                    {currentQuestion?.question_text}
                                </h2>
                            </div>
                        </div>

                        <textarea
                            value={answers[currentQuestion?.question_id] || ''}
                            onChange={(e) =>
                                setAnswers({ ...answers, [currentQuestion?.question_id]: e.target.value })
                            }
                            placeholder="Saisissez votre réponse ici..."
                            rows={12}
                            className="input-field resize-none text-lg"
                        />
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                        {/* Cancel Button */}
                        <h1
                            onClick={() => setShowCancelModal(true)}
                            className="text-xl text-gray-500 underline cursor-pointer"
                        >
                            Cancel
                        </h1>

                        {/* Next/Submit Button */}
                        <div>
                            {isLastQuestion ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canProceed || loading}
                                    className="btn-primary flex items-center space-x-2 text-lg disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            <span>Submit</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed}
                                    className="btn-primary flex items-center space-x-2 text-lg disabled:opacity-50"
                                >
                                    <span>Next</span>
                                    <ArrowRight size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

