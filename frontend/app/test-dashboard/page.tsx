'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Calendar, Award, Eye, Search, Trash2, LoaderCircle } from 'lucide-react';
import { resultAPI, testAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';

export default function TestDashboard() {
  const router = useRouter();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingTestId, setDeletingTestId] = useState<number | null>(null);
  const [editingRemarks, setEditingRemarks] = useState<{ [key: number]: string }>({});
  const [savingRemarks, setSavingRemarks] = useState<number | null>(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState('');

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  const [downloadingCertificate, setDownloadingCertificate] = useState<number | null>(null);
  const [downloadingQA, setDownloadingQA] = useState<number | null>(null);

  const handleOpenDetails = (test: any) => {
    setSelectedTest(test);
    setShowDetailsModal(true);
  };

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

      const remarksMap: { [key: number]: string } = {};
      response.data.forEach((test: any) => {
        remarksMap[test.id] = test.remarks || '';
      });
      setEditingRemarks(remarksMap);

    } catch (err) {
      console.error('Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const handleRemarksChange = (testId: number, value: string) => {
    setEditingRemarks({
      ...editingRemarks,
      [testId]: value
    });
  };

  const handleRemarksBlur = async (testId: number) => {
    const remarks = editingRemarks[testId] || '';
    const originalRemarks = tests.find(t => t.id === testId)?.remarks || '';

    if (remarks === originalRemarks) return;

    setSavingRemarks(testId);
    try {
      await testAPI.updateRemarks(testId, remarks);

      setTests(tests.map(test =>
        test.id === testId ? { ...test, remarks } : test
      ));

      setEditingRemarks({
        ...editingRemarks,
        [testId]: remarks
      });

      toast.success('Remarks saved');
    } catch (err) {
      console.error('Failed to save remarks');
      toast.error('Failed to save remarks');
      setEditingRemarks({
        ...editingRemarks,
        [testId]: originalRemarks
      });
    } finally {
      setSavingRemarks(null);
    }
  };

  const handleDownloadCertificate = async (testId: number, testName: string) => {
    setDownloadingCertificate(testId);
    try {
      const response = await resultAPI.downloadCertificate(testId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `INDX1000_Certificate_${testName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Certificate downloaded!');
    } catch (err) {
      toast.error('Failed to download certificate');
    } finally {
      setDownloadingCertificate(null);
    }
  };

  const handleDownloadQA = async (testId: number, testName: string) => {
    setDownloadingQA(testId);
    try {
      const response = await resultAPI.downloadQAPDF(testId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `INDX1000_QA_${testName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Q&A PDF downloaded!');
    } catch (err) {
      toast.error('Failed to download Q&A PDF');
    } finally {
      setDownloadingQA(null);
    }
  };

  // const filteredTests = tests.filter((test) =>
  //   test.test_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredTests = tests
    .filter((test) => test.completed !== null)
    .filter((test) =>
      test.test_name.toLowerCase().includes(searchTerm.toLowerCase())
    );


  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#050E3C]';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-blue-100 text-blue-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C]"></div>
      </div>
    );
  }

  const handleDeleteTest = async (testId: number) => {
    if (!window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      return;
    }

    setDeletingTestId(testId);
    try {
      await testAPI.deleteTest(testId);
      fetchTests();
      toast.success('Test deleted successfully');
    } catch (err) {
      console.error('Failed to delete test');
      alert('Failed to delete test. Please try again.');
    } finally {
      setDeletingTestId(null);
    }
  };

  const formatTestName = (testName: string) => {
    return testName
      .replace(/Série\s*/gi, 'S')
      .replace(/\s*-\s*/g, '-');
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-[1320px] mx-auto px-4">

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-4xl font-bold gradient-text">Test Dashboard</h1>
            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <Search className="absolute left-4 top-5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>
          </div>

        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">User Feedback</h3>
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedFeedback}</p>
                </div>
                {/* <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="mt-4 w-full px-4 py-2 bg-[#050E3C] text-white font-semibold hover:bg-[#050E3C]/90"
                >
                  Close
                </button> */}
              </div>
            </div>
          </div>
        )}

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
                onClick={() => router.push('/demo')}
                className="btn-primary"
              >
                Take a Test
              </button>
            )}
          </div>
        ) : (
          <div className="card overflow-hidden mt-[-15]">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">S.No</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">Test Name</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">Author</th>
                    {/* <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th> */}
                    {/* <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Level</th> */}
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">Date & Time</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">Answers</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">INDX1000</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">Analysis</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">Delete</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">Remarks</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">Feedback</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">Certificate</th>
                    <th className="px-2 py-4 text-left text-sm font-bold text-gray-700">QA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTests.map((test, index) => (
                    <tr
                      key={test.id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-2 py-2 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-2 py-2">
                        <div className="font-semibold text-gray-900"> {formatTestName(test.test_name)}</div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="text-sm text-gray-700">{test.user?.full_name || 'N/A'}</div>
                      </td>
                      {/* <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{test.user?.email || 'N/A'}</div>
                      </td> */}
                      {/* <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {test.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          {test.level.replace('_', ' ')}
                        </span>
                      </td> */}
                      <td className="px-2 py-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          {/* <Calendar size={16} /> */}
                          <span>
                            {new Date(test.completed || test.created_at).toLocaleString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </span>
                        </div>
                      </td>
                      {/* Add this new cell */}
                      <td className="px-2 py-2">
                        {test.completed ? (
                          <div className="flex justify-center">
                            <button
                              onClick={() => router.push(`/answers/${test.id}`)}
                              className="flex items-center space-x-2 text-[#050E3C] hover:text-blue-700 font-semibold transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        {test.score !== null ? (
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreBadge(test.score)}`}>
                              {/* <Award size={16} className="mr-1" /> */}
                              {test.score.toFixed(0)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        {test.completed ? (
                          <div className="flex justify-center">
                            <button
                              onClick={() => router.push(`/result/${test.id}`)}
                              className="flex items-center space-x-2 text-[#050E3C] hover:text-blue-700 font-semibold transition-colors"
                            >
                              <Eye size={18} />
                              {/* <span>View Result</span> */}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Incomplete</span>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDeleteTest(test.id)}
                            disabled={deletingTestId === test.id}
                            className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold transition-colors disabled:opacity-50"
                          >
                            {deletingTestId === test.id ? (
                              <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />

                            ) : (
                              <Trash2 size={18} />
                            )}
                            {/* <span>Delete</span> */}
                          </button>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={editingRemarks[test.id] || ''}
                            onChange={(e) => handleRemarksChange(test.id, e.target.value)}
                            onBlur={() => handleRemarksBlur(test.id)}
                            placeholder="Add remarks..."
                            className="w-48 px-3 py-2 text-sm border border-gray-300 rounded focus:border-[#050E3C] focus:ring-1 focus:ring-[#050E3C] outline-none"
                          />
                          {savingRemarks === test.id && (
                            <div className="absolute right-2 top-2">
                              <div className="h-4 w-4 border-2 border-[#050E3C] border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-2 py-2">
                        {test.feedback ? (
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                setSelectedFeedback(test.feedback);
                                setShowFeedbackModal(true);
                              }}
                              className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold"
                            >
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>View</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="text-gray-400 text-sm">N/A</span>
                          </div>
                        )}
                      </td>

                      <td className="px-2 py-2">
                        {test.completed && test.score ? (
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleDownloadCertificate(test.id, test.test_name)}
                              disabled={downloadingCertificate === test.id}
                              className="flex items-center space-x-2 text-[#050E3C] hover:text-blue-700 font-semibold transition-colors disabled:opacity-50"
                            >
                              {downloadingCertificate === test.id ? (
                                <div className="h-4 w-4 border-2 border-[#050E3C] border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download size={18} />
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="text-gray-400 text-sm">N/A</span>
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        {test.completed && test.answers && test.answers.length > 0 ? (
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleDownloadQA(test.id, test.test_name)}
                              disabled={downloadingQA === test.id}
                              className="flex items-center space-x-2 text-[#050E3C] hover:text-blue-700 font-semibold transition-colors disabled:opacity-50"
                            >
                              {downloadingQA === test.id ? (
                                <div className="h-4 w-4 border-2 border-[#050E3C] border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download size={18} />
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="text-gray-400 text-sm">N/A</span>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            {/* Mobile View */}
            <div className="mt-[-5] md:hidden -mx-4 max-h-[calc(100vh-250px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full text-xs">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-1 py-3 text-left font-bold text-gray-700">No.</th>
                    <th className="px-1 py-3 text-left font-bold text-gray-700">Test Name</th>
                    <th className="px-1 py-3 text-left font-bold text-gray-700">Author</th>
                    <th className="px-1 py-3 text-center font-bold text-gray-700">Indx</th>
                    <th className="px-1 py-3 text-center font-bold text-gray-700">Details</th>
                    <th className="px-1 py-3 text-center font-bold text-gray-700">Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTests.map((test, index) => (
                    <tr key={test.id} className="hover:bg-blue-50/50">
                      <td className="px-1 py-3">
                        <div className="text-gray-900 text-xs font-semibold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-1 py-3">
                        <div className="text-gray-900 text-xs break-words max-w-[100px]">
                          {formatTestName(test.test_name)}
                        </div>
                      </td>
                      <td className="px-1 py-3">
                        <div className="text-gray-700 text-xs break-words max-w-[70px]">
                          {test.user?.full_name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-1 py-3">
                        {test.score !== null ? (
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold`}>
                              {test.score.toFixed(0)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="text-gray-400 text-xs">N/A</span>
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleOpenDetails(test)}
                            className="text-[#050E3C] hover:text-blue-700"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-1 py-3">
                        {test.completed ? (
                          <div className="flex justify-center">
                            <button
                              onClick={() => router.push(`/result/${test.id}`)}
                              className="text-[#050E3C] hover:text-blue-700"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="text-gray-400 text-xs">N/A</span>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Details Modal for Mobile - Full Screen */}
            {showDetailsModal && selectedTest && (
              <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 md:hidden overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900">Test Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-gray-500">
                          #{filteredTests.findIndex(t => t.id === selectedTest.id) + 1}
                        </span>
                        <span className="font-bold text-gray-900">{selectedTest.test_name}</span>
                      </div>
                    </div>
                    {/* {selectedTest.score !== null && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreBadge(selectedTest.score)}`}>
                        {selectedTest.score.toFixed(0)}
                      </span>
                    )} */}
                  </div>

                  {/* Author */}
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-600">Author: </span>
                    <span className="text-sm text-gray-700">{selectedTest.user?.full_name || 'N/A'}</span>
                  </div>

                  {/* Score */}
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-600">INDX: </span>
                    <span className="text-sm text-gray-700"> {selectedTest.score.toFixed(0)}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <Calendar size={14} />
                    <span>
                      {new Date(selectedTest.completed || selectedTest.created_at).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                  </div>

                  {/* Remarks */}
                  <div className="mb-3">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Remarks:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editingRemarks[selectedTest.id] || ''}
                        onChange={(e) => handleRemarksChange(selectedTest.id, e.target.value)}
                        onBlur={() => handleRemarksBlur(selectedTest.id)}
                        placeholder="Add remarks..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-[#050E3C] focus:ring-1 focus:ring-[#050E3C] outline-none"
                      />
                      {savingRemarks === selectedTest.id && (
                        <div className="absolute right-2 top-2">
                          <div className="h-4 w-4 border-2 border-[#050E3C] border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {selectedTest.completed ? (
                      <>
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            router.push(`/answers/${selectedTest.id}`);
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-[#050E3C] hover:text-blue-700 border border-gray-300 rounded font-semibold text-sm"
                        >
                          <Eye size={16} />
                          <span>View Answers</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            router.push(`/result/${selectedTest.id}`);
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-[#050E3C] hover:text-blue-700 border border-gray-300 rounded font-semibold text-sm"
                        >
                          <Eye size={16} />
                          <span>View Analysis</span>
                        </button>
                      </>
                    ) : (
                      <div className="w-full px-4 py-2 text-center text-gray-400 text-sm border border-gray-200 rounded">
                        Incomplete
                      </div>
                    )}

                    {selectedTest.feedback ? (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setSelectedFeedback(selectedTest.feedback);
                          setShowFeedbackModal(true);
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-green-600 hover:text-green-700 border border-gray-300 rounded font-semibold text-sm"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>View Feedback</span>
                      </button>
                    ) : (
                      <div className="w-full px-4 py-2 text-center text-gray-400 text-sm border border-gray-200 rounded">
                        No Feedback
                      </div>
                    )}

                    {selectedTest.completed && selectedTest.score ? (
                      <button
                        onClick={() => handleDownloadCertificate(selectedTest.id, selectedTest.test_name)}
                        disabled={downloadingCertificate === selectedTest.id}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-[#050E3C] hover:text-blue-700 border border-gray-300 rounded font-semibold text-sm disabled:opacity-50"
                      >
                        {downloadingCertificate === selectedTest.id ? (
                          <div className="h-4 w-4 border-2 border-[#050E3C] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                        <span>Download Certificate</span>
                      </button>
                    ) : (
                      <div className="w-full px-4 py-2 text-center text-gray-400 text-sm border border-gray-200 rounded">
                        Certificate N/A
                      </div>
                    )}


                    {selectedTest.completed && selectedTest.answers && selectedTest.answers.length > 0 ? (
                      <button
                        onClick={() => handleDownloadQA(selectedTest.id, selectedTest.test_name)}
                        disabled={downloadingQA === selectedTest.id}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-[#050E3C] hover:text-blue-700 border border-gray-300 rounded font-semibold text-sm disabled:opacity-50"
                      >
                        {downloadingQA === selectedTest.id ? (
                          <div className="h-4 w-4 border-2 border-[#050E3C] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                        <span>Download Q&A</span>
                      </button>
                    ) : (
                      <div className="w-full px-4 py-2 text-center text-gray-400 text-sm border border-gray-200 rounded">
                        Q&A N/A
                      </div>
                    )}

                    <button
                      onClick={() => handleDeleteTest(selectedTest.id)}
                      disabled={deletingTestId === selectedTest.id}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 border border-gray-300 rounded font-semibold text-sm disabled:opacity-50"
                    >
                      {deletingTestId === selectedTest.id ? (
                        <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      <span>Delete Test</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}