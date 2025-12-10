'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Calendar, Award, Eye, Search } from 'lucide-react';
import { testAPI } from '@/src/lib/api';

export default function TestDashboard() {
  const router = useRouter();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await testAPI.getDashboard();
      setTests(response.data);
    } catch (err) {
      console.error('Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter((test) =>
    test.test_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-4">Test Dashboard</h1>
              <p className="text-xl text-gray-600">Track your progress and view all your test results</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{tests.length}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {tests.filter((t) => t.score >= 80).length}
                  </div>
                  <div className="text-sm text-gray-600">Excellent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
            />
          </div>
        </div>

        {/* Tests Table */}
        {filteredTests.length === 0 ? (
          <div className="card text-center py-20">
            <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Tests Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try a different search term' : 'Start taking tests to see your results here'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push('/test-platform')}
                className="btn-primary"
              >
                Take a Test
              </button>
            )}
          </div>
        ) : (
          <div className="card overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">S.No</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Test Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Level</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTests.map((test, index) => (
                    <tr
                      key={test.id}
                      className="hover:bg-green-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{test.test_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {test.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          {test.level.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>
                            {test.completed
                              ? new Date(test.completed).toLocaleString()
                              : 'In Progress'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {test.score !== null ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreBadge(test.score)}`}>
                            <Award size={16} className="mr-1" />
                            {test.score.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {test.completed ? (
                          <button
                            onClick={() => router.push(`/result/${test.id}`)}
                            className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                          >
                            <Eye size={18} />
                            <span>View Result</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">Incomplete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {filteredTests.map((test, index) => (
                <div key={test.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                        <span className="font-bold text-gray-900">{test.test_name}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {test.category}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          {test.level.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    {test.score !== null && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreBadge(test.score)}`}>
                        {test.score.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>
                        {test.completed
                          ? new Date(test.completed).toLocaleDateString()
                          : 'In Progress'}
                      </span>
                    </div>
                    {test.completed && (
                      <button
                        onClick={() => router.push(`/result/${test.id}`)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-semibold text-sm"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}