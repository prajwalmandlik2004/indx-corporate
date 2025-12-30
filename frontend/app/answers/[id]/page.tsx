'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { resultAPI } from '@/src/lib/api';

export default function AnswersPage() {
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
                    <p className="text-gray-600">Your Answers</p>
                </div>

                {/* Answers List */}
                <div className="space-y-6">
                    {result.analyses?.gpt4o?.question_feedback?.map((feedback: any, index: number) => (
                        <div key={index} className="card">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#050E3C] to-[#050E3C] flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">{feedback.question_number}</span>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg mb-2">Sequence {feedback.question_number}</h3>

                                    {/* User's Answer */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        {/* <p className="text-sm font-semibold text-gray-600 mb-2">Your Answer:</p> */}
                                        <p className="text-gray-800 whitespace-pre-line">
                                            {result.answers?.find((ans: any) => ans.question_id === feedback.question_number)?.answer_text || 'No answer provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) || <p className="text-gray-600">No answers available</p>}
                </div>
            </div>
        </div>
    );
}