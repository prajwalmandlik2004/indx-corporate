'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Send } from 'lucide-react';
import { demoAPI } from '@/src/lib/api';

export default function DemoTestPage() {
    const router = useRouter();
    const params = useParams();
    const testId = parseInt(params.id as string);

    const [test, setTest] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(false);

    const currentQuestion = test?.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === (test?.questions.length - 1);
    const canProceed = answers[currentQuestion?.question_id]?.trim().length > 0;

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

    const handleSubmit = async () => {
        if (!canProceed) return;

        setLoading(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answerText]) => ({
                question_id: parseInt(questionId),
                answer_text: answerText,
            }));

            await demoAPI.submitTest(testId, formattedAnswers);
            router.push(`/demo/thank-you/${testId}`);
        } catch (err) {
            console.error('Failed to submit test');
            alert('Failed to submit test. Please try again.');
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
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C]"></div>
                        <p className="text-lg font-semibold text-[#050E3C]">Submitting test...</p>
                    </div>
                </div>
            )}

            <div className="min-h-screen px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Progress */}
                    <div className="mb-8">
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
                    </div>

                    {/* Question Card */}
                    <div className="card mb-8 rounded-none">
                        <div className="flex items-start space-x-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#050E3C] to-[#050E3C]  flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">{currentQuestionIndex + 1}</span>
                            </div>
                            <div className="flex-grow">
                                <h2 className="whitespace-pre-line text-lg text-[#050E3C] mb-4">
                                    {currentQuestion?.question_text.replace(/\n\s*/g, '\n\n')}
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
                    <div className="flex justify-end">
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
        </>
    );
}

