import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export default function CategoryCard({ icon: Icon, title, description, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="card hover:scale-105 transition-transform duration-300 text-left w-full group"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-[#050E3C] to-[#050E3C] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="text-white" size={32} />
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-[#050E3C] transition-colors">
        {title}
      </h3>
      <p className="text-gray-600">{description}</p>
    </button>
  );
}