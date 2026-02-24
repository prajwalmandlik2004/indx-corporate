'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { seriesTestAPI, authAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';

interface SeriesType {
  type: string;
  name: string;
  description: string;
  modules: number;
  questions: number;
  questions_per_module?: number;
  timer_minutes: number;
  break_minutes?: number;
  color: string;
}

export default function SeriesPlatform() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startTestType = searchParams.get('startTest');

  const [seriesTypes, setSeriesTypes] = useState<SeriesType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin test types that should be hidden from non-admin users
  const adminTestTypes = ['mt', 'bt', 'tt'];

  // Guest registration modal state
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [pendingSeries, setPendingSeries] = useState<SeriesType | null>(null);
  const [guestInfo, setGuestInfo] = useState({ email: '', fullName: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOkClicked, setIsOkClicked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Series info config for display
  const getSeriesDisplayInfo = (type: string) => {
    switch (type) {
      case 'mono':
        return { name: 'Série M1', sequences: '1 × 28 séquences', duration: '65 minutes' };
      case 'bi':
        return { name: 'Série M2', sequences: '2 × 22 séquences', duration: '90 minutes' };
      case 'tri':
        return { name: 'Série M3', sequences: '3 × 22 séquences', duration: '120 minutes' };
      case 'mt':
        return { name: 'Série M1-T', sequences: '1 × 3 séquences', duration: '10 minutes' };
      case 'bt':
        return { name: 'Série M2-T', sequences: '2 × 2 séquences', duration: '15 minutes' };
      case 'tt':
        return { name: 'Série M3-T', sequences: '3 × 2 séquences', duration: '20 minutes' };
      default:
        return { name: 'Série', sequences: '', duration: '' };
    }
  };

  useEffect(() => {
    fetchSeriesTypes();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/is-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIsAdmin(data.is_admin);
    } catch (error) {
      console.error('Failed to check admin status');
      setIsAdmin(false);
    }
  };

  // Handle startTest query param from navbar (for guest users)
  useEffect(() => {
    if (startTestType && seriesTypes.length > 0 && !loading) {
      const token = localStorage.getItem('token');
      if (!token) {
        // Find the series matching the startTest type
        const series = seriesTypes.find(s => s.type === startTestType);
        if (series) {
          setPendingSeries(series);
          setShowGuestModal(true);
        }
      } else {
        // User is logged in, redirect to test page directly
        router.push(`/series-test/new?type=${startTestType}`);
      }
    }
  }, [startTestType, seriesTypes, loading, router]);

  const fetchSeriesTypes = async () => {
    try {
      const response = await seriesTestAPI.getTypes();
      setSeriesTypes(response.data.series);
    } catch (err) {
      console.error('Failed to fetch series types');
      toast.error('Failed to load series types');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCardClick = (series: SeriesType) => {
    const token = localStorage.getItem('token');

    // If not logged in, show guest registration modal
    if (!token) {
      setPendingSeries(series);
      setShowGuestModal(true);
      return;
    }

    // If logged in, navigate immediately to info page (test created there)
    router.push(`/series-test/new?type=${series.type}`);
  };

  const handleGuestRegister = async () => {
    if (!guestInfo.email || !guestInfo.fullName) {
      toast.error('Veuillez entrer votre email et nom');
      return;
    }

    setIsRegistering(true);
    try {
      const response = await authAPI.guestLogin(guestInfo.email, guestInfo.fullName);
      localStorage.setItem('token', response.data.access_token);

      // Navigate immediately - test will be created on series-test page
      if (pendingSeries) {
        router.push(`/series-test/new?type=${pendingSeries.type}&skipInfo=true`);
      }
    } catch (error) {
      toast.error('Erreur. Veuillez réessayer.');
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050E3C]"></div>
      </div>
    );
  }

  return (
    <>
      {/* Guest Registration Modal */}
      {showGuestModal && pendingSeries && (
        <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-30">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold text-[#050E3C] mb-2">
                  INDX1000 – {getSeriesDisplayInfo(pendingSeries.type).name}
                </h1>
                <p className="text-md text-gray-700">
                  {getSeriesDisplayInfo(pendingSeries.type).sequences} – {getSeriesDisplayInfo(pendingSeries.type).duration} (version bêta v1.0)
                </p>
              </div>

              {/* Main description */}
              <div className="space-y-4 text-md text-gray-900 leading-relaxed">
                <p>
                  Vous allez débuter une session INDX1000.<br />
                  Cette session consiste à observer, à travers une série de séquences, la conduite d'une interaction avec un système artificiel non déterministe.
                </p>

                <p>
                  Il ne s'agit ni d'un test de connaissances ni d'une évaluation d'expertise : INDX1000 analyse une dynamique, non des réponses ponctuelles isolées. Il n'existe ni bon ni mauvais retour : répondez de manière concise, 10 lignes maximum (la clarté prime sur la longueur).
                </p>

                <div className="mt-6">
                  <p className="font-semibold mb-2">Modalités :</p>
                  <ul className="space-y-1 text-gray-900">
                    <li>Chaque séquence requiert une réponse.</li>
                    <li>Les réponses ne sont ni modifiables ni consultables après validation.</li>
                    <li>Le respect du temps imparti et le renseignement de toutes des séquences de la série conditionnent l'analyse.</li>
                    <li>Aucune limite de temps n'est fixée par séquence au sein de la série.</li>
                  </ul>
                </div>

                <p className="mt-4">
                  Vous pourrez accéder à l'issue de cette session à son analyse, en ligne dans un délai de 3 minutes.<br />
                  Le compte rendu de cette analyse vous sera par ailleurs transmis par e-mail.
                </p>

                <p>
                  Nous répondrons à tout retour sur cette session (capturable en fin de session).
                </p>

                {/* Checkbox for acceptance */}
                <label className="flex items-start space-x-3 mt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#050E3C] border-gray-300 rounded focus:ring-[#050E3C]"
                  />
                  <span className="text-gray-900">
                    J'ai lu et j'accepte les conditions d'utilisation d'INDX1000 – {getSeriesDisplayInfo(pendingSeries.type).name}.
                  </span>
                </label>
              </div>

              {/* Guest Info Form */}
              <div className="space-y-3">
                <h3 className="font-normal text-gray-900">Vos informations :</h3>
                <div className="flex flex-col md:flex-row items-start md:space-x-4 space-y-4 md:space-y-0">
                  <input
                    type="text"
                    placeholder="Prénom, Nom"
                    value={guestInfo.fullName}
                    onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                    className="w-80 px-3 py-2 border border-gray-300 focus:border-[#050E3C] outline-none"
                    disabled={isOkClicked && !isEditMode}
                    required
                  />
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Adresse mail"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      className="w-80 px-3 py-2 border border-gray-300 focus:border-[#050E3C] outline-none"
                      disabled={isOkClicked && !isEditMode}
                      required
                    />
                    <div className="absolute -bottom-14 right-0 flex space-x-2">
                      <button
                        onClick={() => {
                          setIsEditMode(true);
                          setIsOkClicked(false);
                        }}
                        disabled={!isOkClicked}
                        className={`px-3 py-1 font-semibold transition-colors ${isOkClicked
                          ? 'text-[#050E3C] underline'
                          : 'text-gray-500 cursor-not-allowed underline'
                          }`}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          setIsOkClicked(true);
                          setIsEditMode(false);
                        }}
                        disabled={!guestInfo.fullName || !isValidEmail(guestInfo.email) || (isOkClicked && !isEditMode)}
                        className={`px-3 py-1 font-semibold transition-colors ${guestInfo.fullName && isValidEmail(guestInfo.email) && (!isOkClicked || isEditMode)
                          ? 'bg-[#050E3C] text-white'
                          : 'bg-gray-400 text-white cursor-not-allowed'
                          }`}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex space-x-4">
                <button
                  onClick={handleGuestRegister}
                  disabled={isRegistering || !isOkClicked || !acceptedTerms}
                  className="px-6 py-3 bg-[#050E3C] text-white text-md font-semibold hover:bg-[#050E3C]/90 transition-colors disabled:opacity-50"
                >
                  {isRegistering ? 'Enregistrement...' : 'Commencer'}
                </button>

                <button
                  onClick={() => {
                    setShowGuestModal(false);
                    setPendingSeries(null);
                    setGuestInfo({ email: '', fullName: '' });
                    setIsOkClicked(false);
                    setIsEditMode(false);
                    setAcceptedTerms(false);
                  }}
                  className="px-6 py-3 text-gray-500 text-md font-semibold underline cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-left mb-12 space-y-4 animate-fade-in">
            <h1 className="text-5xl font-bold gradient-text">Series Test Platform</h1>
          </div>

          {/* Series Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {seriesTypes
              .filter((series) => isAdmin || !adminTestTypes.includes(series.type))
              .map((series) => (
              <div
                key={series.type}
                onClick={() => handleCardClick(series)}
                className="group cursor-pointer"
              >
                <div className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col justify-between">
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{series.name}</h2>
                  <p className="text-gray-600 mb-6">{series.description}</p>

                  {/* Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Modules</span>
                      <span className="font-semibold text-gray-900">{series.modules}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Total Questions</span>
                      <span className="font-semibold text-gray-900">{series.questions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Time per Module</span>
                      <span className="font-semibold text-gray-900">{series.timer_minutes} min</span>
                    </div>
                    {series.break_minutes && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Break Between Modules</span>
                        <span className="font-semibold text-gray-900">{series.break_minutes} min</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Start</span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
