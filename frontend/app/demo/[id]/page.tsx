'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Send } from 'lucide-react';
import { authAPI, demoAPI, testAPI } from '@/src/lib/api';
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
    const [guestInfo, setGuestInfo] = useState({ email: '', fullName: '' });
    const [isRegistering, setIsRegistering] = useState(false);

    const [isOkClicked, setIsOkClicked] = useState(false);

    // Add this handler
    const handleStartTest = async () => {
        const token = localStorage.getItem('token');

        // If already logged in, just start
        if (token) {
            setShowInfoModal(false);
            return;
        }

        // Guest login
        if (!guestInfo.email || !guestInfo.fullName) {
            alert('Veuillez entrer votre email et nom');
            return;
        }

        setIsRegistering(true);
        try {
            const response = await authAPI.guestLogin(guestInfo.email, guestInfo.fullName);
            localStorage.setItem('token', response.data.access_token);
            setShowInfoModal(false);
        } catch (error) {
            alert('Erreur. Veuillez réessayer.');
        } finally {
            setIsRegistering(false);
        }
    };


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
    //     setAnalysisStatus('Submitting your answers...');

    //     try {
    //         const formattedAnswers = Object.entries(answers).map(([questionId, answerText]) => ({
    //             question_id: parseInt(questionId),
    //             answer_text: answerText,
    //         }));

    //         const controller = new AbortController();
    //         const timeoutId = setTimeout(() => controller.abort(), 140000);

    //         // Show progress messages
    //         setTimeout(() => setAnalysisStatus('Analyzing ...'), 2000);
    //         setTimeout(() => setAnalysisStatus('Analyzing ...'), 20000);
    //         setTimeout(() => setAnalysisStatus('Analyzing ...'), 30000);
    //         setTimeout(() => setAnalysisStatus('Analyzing ...'), 40000);
    //         setTimeout(() => setAnalysisStatus('Analyzing ...'), 50000);
    //         setTimeout(() => setAnalysisStatus('Finalizing results...'), 60000);

    //         await demoAPI.submitTest(testId, formattedAnswers);

    //         clearTimeout(timeoutId);
    //         router.push(`/demo/thank-you/${testId}`);
    //     } catch (err: any) {
    //         console.error('Failed to submit test:', err);

    //         if (err.name === 'AbortError') {
    //             // alert('Analysis is taking longer than expected. Please check results page in a few moments.');
    //             router.push(`/demo/thank-you/${testId}`);
    //         } else {
    //             // alert('Analysis is taking longer than expected. Please check results page in a few moments.');
    //             router.push(`/demo/thank-you/${testId}`);
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async () => {
        if (!canProceed) return;

        setLoading(true);
        setAnalysisStatus('Saving your answers...');

        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answerText]) => ({
                question_id: parseInt(questionId),
                answer_text: answerText,
            }));

            // Show progress
            setTimeout(() => setAnalysisStatus('Analyzing responses...'), 2000);
            setTimeout(() => setAnalysisStatus('Processing results...'), 30000);
            setTimeout(() => setAnalysisStatus('Finalizing...'), 60000);

            // ✅ Submit (answers saved immediately, analysis happens on backend)
            await demoAPI.submitTest(testId, formattedAnswers);

            // Go to thank you page (even if analysis is still running)
            router.push(`/demo/thank-you/${testId}`);

        } catch (err: any) {
            console.error('Submission error:', err);
            // Even on error, try to go to thank you page
            // (answers might still be saved)
            router.push(`/demo/thank-you/${testId}`);
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

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-gray-800/20 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 max-w-md">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C]"></div>
                        <p className="text-lg font-semibold text-[#050E3C]">{analysisStatus}</p>
                        <p className="text-sm text-gray-600 text-center">
                            This may take up to 2-3 minutes. Please don't close this page.
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
                    <div className="max-w-4xl mx-auto px-6 py-30">
                        <div className="space-y-10">
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-bold text-[#050E3C] mb-3">
                                    INDX1000 – {test.test_name}
                                </h1>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Session d'évaluation – Beta test
                                </h2>
                            </div>


                            {/* Main description - with proper spacing */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-normal text-gray-900 mb-10 underline">
                                        Informations :
                                    </h3>

                                    <div className="space-y-4 text-md text-gray-900 leading-relaxed">
                                        <p>
                                            <span className="mr-2 text-yellow-800">●</span> Vous êtes sur le point de débuter une session INDX1000, destinée à observer votre manière de conduire une interaction cognitive avec un système artificiel non déterministe.
                                            <br />
                                            il ne s'agit ni d'un test de connaissances ni d'expertise, mais de l'analyse de la façon dont vous structurez, orientez et ajustez votre raisonnement au fil de l'échange.
                                        </p>

                                        <p>
                                            INDX1000 n'évalue pas des réponses isolées ni une performance ponctuelle, mais une dynamique de pilotage cognitif inscrite dans la durée (ici comprise entre 15 et 25 minutes pour les "Séries 15" ; 30 à 45 pour les "Séries 25").
                                        </p>

                                        <p>
                                            Il n'existe donc ni bonne ni mauvaise réponse : répondez sincèrement, sans chercher à anticiper une attente implicite, de façon concise (environ dix lignes), la clarté primant sur la longueur.
                                        </p>

                                        {/* Divider starting from center */}
                                        <div className="flex justify-center">
                                            <div className="w-3/4 border-t border-gray-400 m-5"></div>
                                        </div>

                                        <p>
                                            <span className="mr-2 text-yellow-800">●</span> En fin de test vous pourrez consulter et récupérer le compte-rendu d’analyse de cette session par e-mail à votre
                                            adresse à renseigner ci-dessous, utilisée exclusivement par INDX.
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* Guest Info Form - Only show if not logged in */}
                            {!localStorage.getItem('token') && (
                                <div className="space-y-3">
                                    <h3 className="font-normal text-gray-900">Vos informations :</h3>
                                    <div className='flex flex-col md:flex-row items-start md:space-x-4 space-y-4 md:space-y-0'>
                                        <input
                                            type="text"
                                            placeholder="Prénom, Nom"
                                            value={guestInfo.fullName}
                                            onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                                            className="w-80 px-3 py-2 border border-gray-300 focus:border-[#050E3C] outline-none"
                                            required
                                        />
                                        <div className="relative">
                                            <input
                                                type="email"
                                                placeholder="Adresse mail"
                                                value={guestInfo.email}
                                                onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                                className="w-80 px-3 py-2 border border-gray-300 focus:border-[#050E3C] outline-none"
                                                required
                                            />
                                            <button
                                                onClick={() => setIsOkClicked(true)}
                                                disabled={!guestInfo.fullName || !isValidEmail(guestInfo.email)}
                                                className={`absolute -bottom-14 right-0 px-3 py-1 font-semibold transition-colors ${guestInfo.fullName && isValidEmail(guestInfo.email)
                                                        ? 'bg-[#050E3C] text-white'
                                                        : 'bg-gray-400 text-white cursor-not-allowed'
                                                    }`}
                                            >
                                                OK
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modified start button */}
                            <div className="pt-8">
                                <button
                                    onClick={handleStartTest}
                                    disabled={isRegistering || (!localStorage.getItem('token') && !isOkClicked)}
                                    className="px-6 py-3 bg-[#050E3C] text-white text-md font-semibold hover:bg-[#050E3C]/90 transition-colors disabled:opacity-50"
                                >
                                    {isRegistering ? 'Enregistrement...' : 'Commencer le test'}
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

