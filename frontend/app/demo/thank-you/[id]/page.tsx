'use client';

import { useRouter, useParams } from 'next/navigation';
import { CheckCircle, BarChart3 } from 'lucide-react';

export default function ThankYouPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        {/* <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#050E3C] to-[#050E3C] rounded-full mb-4">
          <CheckCircle className="text-white" size={56} />
        </div> */}

        <h1 className="text-3xl sm:text-5xl text-gray-700">
          Thank You
        </h1>

          <p className="text-xl text-gray-700 leading-relaxed mb-2">
            Your answers have been recorded.
          </p>
          <p className="text-lg text-gray-600">
            The analysis focuses on the overall reasoning trajectory.
          </p>

        <button
          onClick={() => router.push(`/result/${testId}`)}
          className="btn-primary flex items-center space-x-2 text-lg mx-auto"
        >
          <span>View Analysis</span>
        </button>
      </div>
    </div>
  );
}