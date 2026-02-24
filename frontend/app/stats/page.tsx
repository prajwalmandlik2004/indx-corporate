'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Users, Mail, Award, ToggleLeft, ToggleRight } from 'lucide-react';
import { statsAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// SVG Icons for AI Companies
const OpenAIIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const ClaudeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2L4 22h4l1.5-4h5l1.5 4h4L12 2zm0 7l2 6h-4l2-6z"/>
  </svg>
);

const XAIIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GeminiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2L13.5 9L20 7L14 12L20 17L13.5 15L12 22L10.5 15L4 17L10 12L4 7L10.5 9L12 2Z"/>
  </svg>
);

const MistralIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <rect x="2" y="4" width="4" height="4"/>
    <rect x="18" y="4" width="4" height="4"/>
    <rect x="2" y="10" width="4" height="4"/>
    <rect x="6" y="10" width="4" height="4"/>
    <rect x="14" y="10" width="4" height="4"/>
    <rect x="18" y="10" width="4" height="4"/>
    <rect x="2" y="16" width="4" height="4"/>
    <rect x="10" y="16" width="4" height="4"/>
    <rect x="18" y="16" width="4" height="4"/>
  </svg>
);

// AI Model configuration with icons
const AI_MODELS = [
  {
    id: 'gpt4o',
    name: 'GPT-4o',
    company: 'OpenAI',
    color: '#10A37F',
    bgColor: '#10A37F',
    Icon: OpenAIIcon,
  },
  {
    id: 'claude',
    name: 'Claude',
    company: 'Anthropic',
    color: '#D97757',
    bgColor: '#D97757',
    Icon: ClaudeIcon,
  },
  {
    id: 'grok',
    name: 'Grok',
    company: 'xAI',
    color: '#000000',
    bgColor: '#000000',
    Icon: XAIIcon,
  },
  {
    id: 'groq',
    name: 'Gemini',
    company: 'Google',
    color: '#4285F4',
    bgColor: '#4285F4',
    Icon: GeminiIcon,
  },
  {
    id: 'mistral',
    name: 'Mistral',
    company: 'Mistral AI',
    color: '#FF7000',
    bgColor: '#FF7000',
    Icon: MistralIcon,
  },
];

interface OverviewStats {
  total_tests: number;
  series_tests: number;
  demo_tests: number;
  tests_by_type: Record<string, number>;
  average_score: number;
  total_users: number;
  emails_sent: number;
}

interface ScoreDistribution {
  distribution: Array<{ range: string; count: number }>;
  timeline: Array<{ date: string; avgScore: number; count: number; minScore: number; maxScore: number }>;
  scores: Array<{ date: string; score: number; series_type: string; test_id: number }>;
}

interface ModelStats {
  model: string;
  displayName: string;
  avgScore: number;
  minScore: number;
  maxScore: number;
  totalAnalyses: number;
  consistency: number;
}

interface AIModelAccuracy {
  models: ModelStats[];
  agreement_score: number;
  total_analyses: number;
}

interface SeriesBreakdown {
  breakdown: Array<{
    type: string;
    displayName: string;
    totalTests: number;
    avgScore: number;
    minScore: number;
    maxScore: number;
    avgTimeMinutes: number;
  }>;
}

export default function StatsPage() {
  const router = useRouter();

  const [initialLoading, setInitialLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [chartType, setChartType] = useState<'curve' | 'bar'>('curve');

  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [scoreDistribution, setScoreDistribution] = useState<ScoreDistribution | null>(null);
  const [aiModelAccuracy, setAiModelAccuracy] = useState<AIModelAccuracy | null>(null);
  const [seriesBreakdown, setSeriesBreakdown] = useState<SeriesBreakdown | null>(null);

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Check admin status first
      const adminResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/is-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const adminData = await adminResponse.json();

      if (!adminData.is_admin) {
        toast.error('Admin access required');
        router.push('/');
        return;
      }

      setIsAdmin(true);
      setInitialLoading(false);

      // Fetch stats data in parallel - each updates UI as soon as it resolves
      statsAPI.getOverview().then(res => setOverview(res.data)).catch(() => {});
      statsAPI.getScoreDistribution().then(res => setScoreDistribution(res.data)).catch(() => {});
      statsAPI.getAIModelAccuracy().then(res => setAiModelAccuracy(res.data)).catch(() => {});
      statsAPI.getSeriesBreakdown().then(res => setSeriesBreakdown(res.data)).catch(() => {});
    } catch (error) {
      console.error('Failed to fetch stats');
      toast.error('Failed to load statistics');
      setInitialLoading(false);
    }
  };

  const getModelInfo = (modelId: string) => {
    return AI_MODELS.find((m) => m.id === modelId) || AI_MODELS[0];
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            
            <div>
              <h1 className="text-3xl font-bold text-[#050E3C]">Statistics Dashboard</h1>
            </div>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-3 bg-white px-4 py-2 shadow">
            <span className={`text-sm font-medium ${chartType === 'curve' ? 'text-[#050E3C]' : 'text-gray-400'}`}>
              Curve
            </span>
            <button
              onClick={() => setChartType(chartType === 'curve' ? 'bar' : 'curve')}
              className="text-[#050E3C]"
            >
              {chartType === 'curve' ? <ToggleLeft size={32} /> : <ToggleRight size={32} />}
            </button>
            <span className={`text-sm font-medium ${chartType === 'bar' ? 'text-[#050E3C]' : 'text-gray-400'}`}>
              Bar
            </span>
          </div>
        </div>

        {/* Overview Cards */}
        {overview ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6  shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50">
                  <BarChart3 className="text-[#050E3C]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.total_tests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6  shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-50">
                  <TrendingUp className="text-[#050E3C]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.average_score}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6  shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-50">
                  <Users className="text-[#050E3C]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.total_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6  shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-50">
                  <Mail className="text-[#050E3C]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emails Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{overview.emails_sent}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6  shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-50">
                  <Award className="text-[#050E3C]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">AI Agreement</p>
                  <p className="text-2xl font-bold text-gray-900">{aiModelAccuracy?.agreement_score || 0}%</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 shadow animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gray-200 rounded w-12 h-12"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Score Distribution & Timeline Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Distribution */}
          <div className="bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
            {scoreDistribution ? (
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'bar' ? (
                  <BarChart data={scoreDistribution.distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#050E3C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={scoreDistribution.distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#050E3C" fill="#050E3C" fillOpacity={0.3} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#050E3C]"></div>
              </div>
            )}
          </div>

          {/* Score Timeline */}
          <div className="bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Trends Over Time</h3>
            {scoreDistribution ? (
              scoreDistribution.timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === 'bar' ? (
                    <BarChart data={scoreDistribution.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 1000]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgScore" name="Avg Score" fill="#050E3C" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="count" name="Tests" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={scoreDistribution.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 1000]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgScore" name="Avg Score" stroke="#050E3C" strokeWidth={2} dot={{ fill: '#050E3C' }} />
                      <Line type="monotone" dataKey="minScore" name="Min" stroke="#EF4444" strokeWidth={1} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="maxScore" name="Max" stroke="#22C55E" strokeWidth={1} strokeDasharray="5 5" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No timeline data available yet
                </div>
              )
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#050E3C]"></div>
              </div>
            )}
          </div>
        </div>

        {/* AI Model Accuracy Section */}
        <div className="bg-white p-6 shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Model Performance</h3>

          {aiModelAccuracy && aiModelAccuracy.models.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiModelAccuracy.models.map((model) => {
                  const modelInfo = getModelInfo(model.model);
                  const IconComponent = modelInfo.Icon;
                  return (
                    <div
                      key={model.model}
                      className="border p-4 hover:shadow-md transition-shadow"
                      style={{ borderColor: modelInfo.color }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: modelInfo.bgColor }}
                        >
                          <IconComponent />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{modelInfo.name}</h4>
                          <p className="text-xs text-gray-500">{modelInfo.company}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Avg Score</span>
                          <span className="font-semibold" style={{ color: modelInfo.color }}>
                            {model.avgScore}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Range</span>
                          <span className="text-gray-700">
                            {model.minScore} - {model.maxScore}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Consistency</span>
                          <span className="text-gray-700">{model.consistency}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Analyses</span>
                          <span className="text-gray-700">{model.totalAnalyses}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Model Comparison Chart */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === 'bar' ? (
                    <BarChart
                      data={aiModelAccuracy.models.map((m) => ({
                        name: getModelInfo(m.model).name,
                        avgScore: m.avgScore,
                        consistency: m.consistency,
                        fill: getModelInfo(m.model).color,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgScore" name="Avg Score" fill="#050E3C" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="consistency" name="Consistency %" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <RadarChart
                      data={aiModelAccuracy.models.map((m) => ({
                        model: getModelInfo(m.model).name,
                        score: m.avgScore / 10, // Scale to 0-100 for radar
                        consistency: m.consistency,
                      }))}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="model" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Score (scaled)" dataKey="score" stroke="#050E3C" fill="#050E3C" fillOpacity={0.3} />
                      <Radar name="Consistency" dataKey="consistency" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          ) : !aiModelAccuracy ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#050E3C]"></div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No AI model data available yet</div>
          )}
        </div>

        {/* Series Breakdown */}
        <div className="bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Series Breakdown</h3>

          {seriesBreakdown && seriesBreakdown.breakdown.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Series Stats Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Series</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Tests</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Avg Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seriesBreakdown.breakdown.map((series) => (
                      <tr key={series.type} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{series.displayName}</span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700">{series.totalTests}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-[#050E3C]">{series.avgScore}</span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700">{series.avgTimeMinutes} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Series Chart */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === 'bar' ? (
                    <BarChart data={seriesBreakdown.breakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="displayName" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalTests" name="Tests" fill="#050E3C" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="avgScore" name="Avg Score" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={seriesBreakdown.breakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="displayName" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgScore" name="Avg Score" stroke="#050E3C" strokeWidth={2} dot={{ fill: '#050E3C', r: 6 }} />
                      <Line type="monotone" dataKey="minScore" name="Min Score" stroke="#EF4444" strokeWidth={1} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="maxScore" name="Max Score" stroke="#22C55E" strokeWidth={1} strokeDasharray="5 5" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          ) : !seriesBreakdown ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#050E3C]"></div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No series data available yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
