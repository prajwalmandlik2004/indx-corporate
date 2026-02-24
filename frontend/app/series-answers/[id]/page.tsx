'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { seriesTestAPI } from '@/src/lib/api';

export default function SeriesAnswersPage() {
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

        fetchAnswers();
    }, [testId]);

    const fetchAnswers = async () => {
        try {
            const response = await seriesTestAPI.getAnswers(parseInt(testId));
            setResult(response.data);
        } catch (err) {
            console.error('Failed to fetch answers');
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
                    <h2 className="text-2xl font-bold text-gray-600">Answers not found</h2>
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
                    className="flex items-center space-x-2 text-gray-600 hover:text-[#050E3C] transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>

                {/* Header */}
                <div className="card mb-8">
                    <h1 className="text-3xl font-bold mb-2">{result.test_name}</h1>
                    <p className="text-gray-600">Your Answers - {result.series_type?.toUpperCase()} Series</p>
                </div>

                {/* Answers List */}
                <div className="space-y-6">
                    {result.questions?.map((question: any, index: number) => {
                        const answer = result.answers?.find((a: any) => a.question_id === question.question_id);
                        return (
                            <div key={index} className="card">
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-10 h-10 bg-linear-to-br from-[#050E3C] to-[#050E3C] flex items-center justify-center shrink-0">
                                        <span className="text-white font-bold">{question.question_id}</span>
                                    </div>
                                    <div className="grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-lg">Sequence {question.question_id}</h3>
                                            {question.module && (
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    Module {question.module}
                                                </span>
                                            )}
                                        </div>

                                        {/* Question Text */}
                                        <p className="text-gray-600 text-sm mb-3 whitespace-pre-line">{question.question_text}</p>

                                        {/* User's Answer */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-800 whitespace-pre-line">
                                                {answer?.answer_text || 'No answer provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) || <p className="text-gray-600">No answers available</p>}
                </div>
            </div>
        </div>
    );
}
