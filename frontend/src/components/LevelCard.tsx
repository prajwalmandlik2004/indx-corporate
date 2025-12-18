import { Lock, CheckCircle } from 'lucide-react';

interface LevelCardProps {
  level: number;
  title: string;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export default function LevelCard({ level, title, isCompleted, isLocked, onClick }: LevelCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`relative card transition-all duration-300 ${
        isLocked
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:scale-105 cursor-pointer'
      } ${isCompleted ? 'border-2 border-[#050E3C]' : ''}`}
    >
      {/* Level Number */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#050E3C] to-[#050E3C] rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">{level}</span>
      </div>

      {/* Status Icon */}
      <div className="flex justify-end mb-4">
        {isCompleted ? (
          <CheckCircle className="text-[#050E3C] animate-pulse" size={32} />
        ) : isLocked ? (
          <Lock className="text-gray-400" size={32} />
        ) : (
          <div className="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">
        {isCompleted ? 'Completed' : isLocked ? 'Complete previous level' : 'Start test'}
      </p>

      {/* Progress Bar */}
      {isCompleted && (
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#050E3C] to-[#050E3C] animate-pulse"></div>
        </div>
      )}
    </button>
  );
}