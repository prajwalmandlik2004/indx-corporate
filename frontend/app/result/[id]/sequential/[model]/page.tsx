'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { demoAPI, resultAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';
import Tooltip from '@/src/components/Tooltip';

export default function SequentialAnalysisPage() {
    const router = useRouter();
    const params = useParams();
    const testId = parseInt(params.id as string);
    const modelName = params.model as string;

    const [result, setResult] = useState<any>(null);
    const [sequences, setSequences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const adminCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/is-admin`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const adminData = await adminCheck.json();
                setIsAdmin(adminData.is_admin);

                // Fetch test result
                const resultResponse = await resultAPI.getResult(testId);
                setResult(resultResponse.data);

                // Fetch test details (questions)
                const testResponse = await demoAPI.getTest(testId);  // Use existing endpoint
                const testQuestions = testResponse.data.questions;
                const testAnswers = testResponse.data.answers;

                // Combine questions with answers
                const combined = testQuestions.map((q: any, index: number) => ({
                    question_id: q.question_id,
                    question_text: q.question_text,
                    answer_text: testAnswers[index]?.answer_text || 'No answer'
                }));

                setResult((prev: any) => ({
                    ...prev,
                    combinedQA: combined
                }));

                // Fetch sequence analyses
                const sequencesResponse = await resultAPI.getSequenceAnalyses(testId, modelName);
                setSequences(sequencesResponse.data);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [testId, modelName]);

    const handleFieldChange = (sequenceIndex: number, fieldName: string, value: string) => {
        const newSequences = [...sequences];
        if (!newSequences[sequenceIndex]) {
            newSequences[sequenceIndex] = {
                test_id: testId,
                model_name: modelName,
                sequence_number: sequenceIndex + 1,
            };
        }
        newSequences[sequenceIndex][fieldName] = value;
        setSequences(newSequences);
    };

    const handleSave = async (sequenceNumber: number) => {
        const sequenceData = sequences[sequenceNumber - 1];
        if (!sequenceData) return;

        try {
            await resultAPI.saveSequenceAnalysis({
                ...sequenceData,
                test_id: testId,
                model_name: modelName,
                sequence_number: sequenceNumber,
            });
            toast.success(`Sequence ${sequenceNumber} saved`);
        } catch (err) {
            toast.error('Failed to save');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C]"></div>
            </div>
        );
    }

    const questions = result?.combinedQA || [];
    const totalQuestions = questions.length;

    const fieldHints = [
        `Respect du périmètre d'analyse
L'IA analyse-t-elle bien ce qu'elle est censée analyser ? Cad la trajectoire observable, et non la personne, ses intentions supposées, ou des éléments hors corpus.`,
        `Absence de déplacement d'objet
L'IA ne change-t-elle pas l'objet de son analyse en cours de route ?
Ex. : passer de « trajectoire cognitive » à « compétence », « niveau », « intelligence », « profil », etc.`,
        `Fidélité au matériau analysé
L'IA s'appuie-t-elle exclusivement sur les éléments réellement présents dans la séquence ? Pas d'ajout, pas d'inférence gratuite, pas de lecture de pensée.`,
        `Séparation stricte analyse / décision
L'IA reste-t-elle dans une posture analytique sans produire de jugement conclusif ou normatif ? Aucune décision, aucun score implicite, aucune sentence déguisée.`,
        `Cohérence interne de l'analyse
L'analyse est-elle logiquement cohérente avec elle-même ?
Pas de contradiction, pas de renversement silencieux, pas de conclusion incompatible avec les prémisses.`,
        `Non-appropriation de l'autorité
L'IA ne s'arroge-t-elle pas une position d'autorité interprétative finale ? Elle analyse. Elle n'arbitre pas. Elle ne "tranche" rien.`
    ];

    return (
        <div className="min-h-screen px-4 py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-[#050E3C] mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="bg-white p-6 mb-6 shadow">
                    <h1 className="text-2xl font-bold text-[#050E3C]">{result?.test_name}</h1>
                    <p className="text-gray-600 mt-1">Model: <span className="font-semibold">{modelName.toUpperCase()}</span></p>
                </div>

                {/* Sequence Cards */}
                <div className="space-y-8">
                    {questions.map((q: any, index: number) => {
                        const seqData = sequences.find((s) => s?.sequence_number === index + 1) || {};

                        return (
                            <div key={index} className="bg-white shadow-lg border-l-0 border-[#050E3C]">
                                {/* Sequence Header */}
                                <div className="bg-gray-50 px-6 py-3 border-b">
                                    <h3 className="font-bold bg-[#050E3C] w-8 h-8 text-white flex items-center justify-center">{index + 1}</h3>
                                </div>

                                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Question + Answer + Analysis */}
                                    <div className="lg:col-span-8 space-y-4">
                                        {/* Question */}
                                        <div>
                                            <h4 className="font-semibold text-md text-gray-700 mb-2">Question :</h4>
                                            <p className="text-gray-800 text-md leading-relaxed">{q.question_text}</p>
                                        </div>

                                        {/* Answer */}
                                        <div>
                                            <h4 className="font-semibold text-md text-gray-700 mb-2">Answer :</h4>
                                            <p className="text-gray-600 text-md leading-relaxed whitespace-pre-wrap">
                                                {q.answer_text}
                                            </p>
                                        </div>

                                        {/* AI Analysis */}
                                        <div>
                                            <h4 className="font-semibold text-md text-gray-700 mb-2">AI Analysis :</h4>
                                            <p className="text-gray-600 text-md leading-relaxed">
                                                {result?.analyses?.[modelName]?.question_feedback?.[index]?.feedback || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Admin Fields */}
                                    <div className="lg:col-span-4 space-y-3">
                                        {/* 6 Small Fields - Horizontal Grid */}
                                        <div className="grid grid-cols-3 gap-2">
                                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                                <div key={num} className="relative">
                                                    <div className="flex items-center mb-1">
                                                        <span className="text-xs font-semibold text-gray-600">{num}</span>
                                                        <Tooltip content={fieldHints[num - 1]} fieldNumber={num} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder=""
                                                        value={seqData[`field_${num}`] || ''}
                                                        onChange={(e) => handleFieldChange(index, `field_${num}`, e.target.value)}
                                                        disabled={!isAdmin}
                                                        className="w-full px-3 py-2 text-xs border border-gray-500 focus:border-[#050E3C] outline-none disabled:bg-gray-100"
                                                        list='yes-no-options'
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <datalist id="yes-no-options">
                                            <option value="Yes" />
                                            <option value="No" />
                                        </datalist>

                                        {/* 1 Large Field */}
                                        <textarea
                                            placeholder=""
                                            value={seqData.detailed_analysis || ''}
                                            onChange={(e) => handleFieldChange(index, 'detailed_analysis', e.target.value)}
                                            disabled={!isAdmin}
                                            rows={8}
                                            className="w-full px-3 py-2 text-xs border border-gray-500 focus:border-[#050E3C] outline-none resize-none disabled:bg-gray-100"
                                        />

                                        {/* Save Button */}
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleSave(index + 1)}
                                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#050E3C] text-white text-sm font-semibold hover:bg-[#050E3C]/90"
                                            >
                                                {/* <Save size={16} /> */}
                                                <span>Save</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}