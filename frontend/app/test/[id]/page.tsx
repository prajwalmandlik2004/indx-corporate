'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, Send, AlertCircle } from 'lucide-react';
import { testAPI } from '@/src/lib/api';

export default function TestPage() {
    const router = useRouter();
    const params = useParams();
    const testId = params.id as string;

    const [test, setTest] = useState<any>(null);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTestData();
    }, [testId]);

    const fetchTestData = async () => {
        try {
            const storedTest = localStorage.getItem(`test_${testId}`);
            if (storedTest) {
                setTest(JSON.parse(storedTest));
            }
        } catch (err) {
            console.error('Failed to load test');
        }
        setLoading(false);
    };

    useEffect(() => {
        setLoading(false);
    }, [testId]);

    const handleAnswerChange = (questionId: number, answer: string) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = async () => {
        setError('');

        // Validate all questions are answered
        if (Object.keys(answers).length < (test?.questions?.length || 5)) {
            setError('Please answer all questions before submitting');
            return;
        }

        setSubmitting(true);

        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answerText]) => ({
                question_id: parseInt(questionId),
                answer_text: answerText,
            }));

            await testAPI.submitTest({
                test_id: parseInt(testId),
                answers: formattedAnswers,
            });

            router.push(`/result/${testId}`);
        } catch (err) {
            setError('Failed to submit test. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="card mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold gradient-text">Test in Progress</h1>
                            <p className="text-gray-600 mt-2">Answer all questions to complete the test</p>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock size={20} />
                            <span className="font-semibold">No time limit</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-700 mb-8">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {test?.questions?.map((question: any) => (
                    <div key={question.question_id} className="card">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">{question.question_id}</span>
                            </div>
                            <div className="flex-grow space-y-4">
                                <h3 className="text-lg font-semibold">
                                    {question.question_text}
                                </h3>
                                <textarea
                                    value={answers[question.question_id] || ''}
                                    onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                                    placeholder="Type your answer here..."
                                    rows={6}
                                    className="input-field resize-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="btn-primary flex items-center space-x-2 text-lg disabled:opacity-50"
                    >
                        <Send size={20} />
                        <span>{submitting ? 'Submitting...' : 'Submit Test'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}