'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  fieldNumber: number;
}

export default function Tooltip({ content, fieldNumber }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const lines = content.split('\n');
  const firstLine = lines[0];
  const secondLine = lines[1] || '';
  const remainingLines = lines.slice(2).join('\n');

  const firstQuestionIndex = firstLine.indexOf('?');
  const firstBold = firstQuestionIndex !== -1 ? firstLine.substring(0, firstQuestionIndex + 1) : firstLine;
  const firstNormal = firstQuestionIndex !== -1 ? firstLine.substring(firstQuestionIndex + 1) : '';

  const secondQuestionIndex = secondLine.indexOf('?');
  const secondBold = secondQuestionIndex !== -1 ? secondLine.substring(0, secondQuestionIndex + 1) : secondLine;
  const secondNormal = secondQuestionIndex !== -1 ? secondLine.substring(secondQuestionIndex + 1) : '';

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="ml-1 text-gray-400 hover:text-[#050E3C] focus:outline-none"
      >
        <Info size={14} />
      </button>

      {isVisible && (
        <div className="absolute z-50 w-64 p-3 text-xs bg-white border-2 border-[#050E3C] shadow-lg -top-2 left-6">
          <div className="text-[#050E3C] mb-1">
            <div>
              <span className="font-bold">{fieldNumber}. {firstBold}</span>
              {firstNormal && <span className="font-normal">{firstNormal}</span>}
            </div>
            {secondLine && (
              <div>
                <span className="font-bold">{secondBold}</span>
                {secondNormal && <span className="font-normal">{secondNormal}</span>}
              </div>
            )}
          </div>
          {remainingLines && (
            <div className="text-gray-700 whitespace-pre-wrap">
              {remainingLines}
            </div>
          )}
          <div className="absolute top-3 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#050E3C]"></div>
        </div>
      )}
    </div>
  );
}