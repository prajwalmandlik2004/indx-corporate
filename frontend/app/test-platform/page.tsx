'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Briefcase, Code, Building, BookOpen, ArrowLeft } from 'lucide-react';
import CategoryCard from '@/src/components/CategoryCard';
import LevelCard from '@/src/components/LevelCard';
import { testAPI } from '@/src/lib/api';

export default function TestPlatform() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchCategories();
    fetchCompletedLevels();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCompletedLevels(); 
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await testAPI.getCategories();
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const categoryIcons: { [key: string]: any } = {
    school: GraduationCap,
    professional: Briefcase,
    technical: Code,
    company: Building,
    general: BookOpen,
  };

  const levels = [
    { level: 1, title: 'Beginner', value: 'level_1' },
    { level: 2, title: 'Elementary', value: 'level_2' },
    { level: 3, title: 'Intermediate', value: 'level_3' },
    { level: 4, title: 'Advanced', value: 'level_4' },
    { level: 5, title: 'Expert', value: 'level_5' },
  ];

  const handleStartTest = async (levelValue: string) => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const response = await testAPI.startTest({
        category: selectedCategory,
        level: levelValue,
      });

      localStorage.setItem(`test_${response.data.id}`, JSON.stringify(response.data));

      router.push(`/test/${response.data.id}`);
    } catch (err) {
      console.error('Failed to start test');
      alert('Failed to start test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedLevels = async () => {
    try {
      const response = await testAPI.getDashboard();
      const completed = new Set<string>();

      response.data.forEach((test: any) => {
        if (test.completed && test.score !== null) {
          completed.add(`${test.category}-${test.level}`);
        }
      });

      setCompletedLevels(completed);
    } catch (err) {
      console.error('Failed to fetch completed levels');
    }
  };

  if (!selectedCategory) {
    return (
      <div className="min-h-screen px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4 animate-fade-in">
            <h1 className="text-5xl font-bold gradient-text">Choose Your Category</h1>
            <p className="text-xl text-gray-600">Select a test category to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const Icon = categoryIcons[category.value] || BookOpen;
              return (
                <CategoryCard
                  key={category.value}
                  icon={Icon}
                  title={category.label}
                  description={category.description}
                  onClick={() => setSelectedCategory(category.value)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#050E3C] transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Categories</span>
          </button>

          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold gradient-text">
              {categories.find((c) => c.value === selectedCategory)?.label} Tests
            </h1>
            <p className="text-xl text-gray-600">
              Complete all 5 levels to master this category
            </p>
          </div>
        </div>

        {/* Levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {levels.map((level, index) => {
            const isCompleted = completedLevels.has(`${selectedCategory}-${level.value}`);
            // const isLocked = index > 0 && !completedLevels.has(`${selectedCategory}-${levels[index - 1].value}`);
            const isLocked = index > 0 && !completedLevels.has(`${selectedCategory}-${levels[index - 1].value}`);

            return (
              <LevelCard
                key={level.value}
                level={level.level}
                title={level.title}
                isCompleted={isCompleted}
                isLocked={isLocked}
                onClick={() => !isLocked && handleStartTest(level.value)}
              />
            );
          })}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C] mx-auto"></div>
              <p className="text-gray-600 text-center">Generating your test...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}