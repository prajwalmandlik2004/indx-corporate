'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  Share2,
} from 'lucide-react';
import { resultAPI } from '@/src/lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 


export default function ResultPage() {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-blue-500 to-blue-900';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-600">Result not found</h2>
          <button onClick={() => router.push('/test-dashboard')} className="btn-primary mt-4">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const downloadReport = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(34, 197, 94); 
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('INDX Test Platform', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Test Result Report', pageWidth / 2, 30, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let yPos = 50;

    doc.setFont('helvetica', 'bold');
    doc.text('Test Information', 20, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(`Test Name: ${result.test_name}`, 20, yPos);
    yPos += 7;
    doc.text(`Category: ${result.category}`, 20, yPos);
    yPos += 7;
    doc.text(`Level: ${result.level.replace('_', ' ')}`, 20, yPos);
    yPos += 7;
    doc.text(`Date: ${new Date(result.completed_at).toLocaleDateString()}`, 20, yPos);
    yPos += 15;

    const scoreColor = result.score >= 80 ? [34, 197, 94] : result.score >= 60 ? [234, 179, 8] : [239, 68, 68];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.roundedRect(pageWidth / 2 - 30, yPos - 5, 60, 25, 5, 5, 'F');

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(`${result.score.toFixed(0)}%`, pageWidth / 2, yPos + 10, { align: 'center' });
    doc.setFontSize(10);
    doc.text(getScoreLabel(result.score), pageWidth / 2, yPos + 18, { align: 'center' });

    yPos += 35;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Performance Analysis', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitAnalysis = doc.splitTextToSize(result.analysis.detailed_analysis, pageWidth - 40);
    doc.text(splitAnalysis, 20, yPos);
    yPos += splitAnalysis.length * 5 + 10;


    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Question-by-Question Feedback', 20, yPos);
    yPos += 8;

    const tableData = result.analysis.question_feedback.map((feedback: any) => [
      `Q${feedback.question_number}`,
      `${feedback.score}%`,
      feedback.feedback
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Question', 'Score', 'Feedback']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 'auto' }
      },
      margin: { left: 20, right: 20 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;


    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('✓ Strengths:', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    result.analysis.strengths.forEach((strength: string) => {
      const splitStrength = doc.splitTextToSize(`• ${strength}`, pageWidth - 50);
      doc.text(splitStrength, 25, yPos);
      yPos += splitStrength.length * 5 + 2;
    });
    yPos += 5;


    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(234, 179, 8);
    doc.text('⚠ Areas for Improvement:', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    result.analysis.improvements.forEach((improvement: string) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }
      const splitImprovement = doc.splitTextToSize(`• ${improvement}`, pageWidth - 50);
      doc.text(splitImprovement, 25, yPos);
      yPos += splitImprovement.length * 5 + 2;
    });
    yPos += 10;

    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('💡 Recommendations:', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const splitRecommendations = doc.splitTextToSize(result.analysis.recommendations, pageWidth - 40);
    doc.text(splitRecommendations, 20, yPos);

    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by INDX Test Platform', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Report generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, footerY + 5, { align: 'center' });

    doc.save(`INDX_Test_Report_${result.test_name.replace(/\s+/g, '_')}.pdf`);
  };

  const shareResult = () => {
    if (!result) return;

    const shareText = `I scored ${result.score.toFixed(0)}% on ${result.test_name} at INDX Test Platform! 🎉`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: 'My Test Result',
        text: shareText,
        url: shareUrl,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      const encodedText = encodeURIComponent(shareText);
      const encodedUrl = encodeURIComponent(shareUrl);

      const shareOptions = [
        {
          name: 'Twitter',
          url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
          color: '#1DA1F2'
        },
        {
          name: 'Facebook',
          url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
          color: '#4267B2'
        },
        {
          name: 'LinkedIn',
          url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          color: '#0077B5'
        },
        {
          name: 'WhatsApp',
          url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
          color: '#25D366'
        }
      ];

      const modal = document.createElement('div');
      modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 400px;
      width: 90%;
    `;

      modalContent.innerHTML = `
      <h3 style="margin: 0 0 20px 0; font-size: 24px; font-weight: bold; color: #16a34a;">Share Your Result</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        ${shareOptions.map(option => `
          <a href="${option.url}" target="_blank" rel="noopener noreferrer"
             style="display: flex; align-items: center; justify-content: center; padding: 12px; 
                    background: ${option.color}; color: white; text-decoration: none; 
                    border-radius: 8px; font-weight: 600; transition: opacity 0.2s;"
             onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
            ${option.name}
          </a>
        `).join('')}
      </div>
      <button onclick="this.closest('[style*=fixed]').remove()"
              style="width: 100%; padding: 12px; background: #e5e7eb; border: none; 
                     border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px;"
              onmouseover="this.style.background='#d1d5db'" onmouseout="this.style.background='#e5e7eb'">
        Close
      </button>
    `;

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
  };

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/test-dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Score Card */}
        <div className="card mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">{result.test_name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                  {result.category}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                  {result.level.replace('_', ' ')}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                  {new Date(result.completed_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* <div className="text-center">
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(
                  result.score
                )} flex items-center justify-center shadow-2xl mb-2`}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{result.score.toFixed(0)}</div>
                  <div className="text-sm text-white/90">Score</div>
                </div>
              </div>
              <div className="font-bold text-lg gradient-text">{getScoreLabel(result.score)}</div>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
            {/* <button onClick={downloadReport} className="btn-secondary flex items-center space-x-2">
              <Download size={18} />
              <span>Download Report</span>
            </button>
            <button onClick={shareResult} className="btn-secondary flex items-center space-x-2">
              <Share2 size={18} />
              <span>Share Result</span>
            </button> */}
          </div>
        </div>

        {/* Analysis Overview */}
        {/* <div className="card mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
            <Trophy className="text-blue-900" size={28} />
            <span>Performance Analysis</span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {result.analysis.detailed_analysis}
          </p>
        </div> */}

        {/* Question Feedback */}
        <div className="card mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Target className="text-blue-900" size={28} />
            <span>Complete Analysis</span>
          </h2>

          <div className="space-y-4">
            {result.analysis.question_feedback.map((feedback: any, index: number) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{feedback.question_number}</span>
                    </div>
                    <h3 className="font-bold text-lg">Question {feedback.question_number}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {feedback.score >= 70 ? (
                      <CheckCircle className="text-blue-900" size={24} />
                    ) : (
                      <XCircle className="text-red-600" size={24} />
                    )}
                    <span className="font-bold text-lg">{feedback.score}%</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="card animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2 text-blue-900">
              <TrendingUp size={28} />
              <span>Strengths</span>
            </h2>
            <ul className="space-y-3">
              {result.analysis.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="text-blue-900 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="card animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2 text-orange-600">
              <TrendingDown size={28} />
              <span>Areas for Improvement</span>
            </h2>
            <ul className="space-y-3">
              {result.analysis.improvements.map((improvement: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <Target className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-2xl font-bold mb-4 gradient-text">Personalized Recommendations</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            {result.analysis.recommendations}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/demo')}
              className="btn-primary"
            >
              Take Another Test
            </button>
            <button
              onClick={() => router.push('/test-dashboard')}
              className="btn-secondary"
            >
              View All Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
