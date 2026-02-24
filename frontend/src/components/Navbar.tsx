'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Home, BookOpen, BarChart3, Info, Beaker, Brain, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import AutoLanguageSelector from '@/src/components/AutoLanguageSelector';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [testSeries, setTestSeries] = useState<{ id: string; name: string; isNewSeries?: boolean }[]>([
    // { id: 'series_25_a', name: 'Série 25 - T1' },
    // { id: 'series_25_f', name: 'Série 25 - CTX1' },
    // { id: 'series_25_g', name: 'Série 25 - CTX2' },
    // { id: 'series_25_i', name: 'Série 25 - CTX2.5' },
    // { id: 'series_25_h', name: 'Série 25 - CTX3' },
    // { id: 'series_15_j', name: 'Série 15 - CTX4' },
    // { id: 'series_1_k', name: 'Série 1 - Admin' },
    { id: 'mono', name: 'M1 Series', isNewSeries: true },
    { id: 'bi', name: 'M2 Series', isNewSeries: true },
    { id: 'tri', name: 'M3 Series', isNewSeries: true },
    { id: 'mt', name: 'M1 Series Admin', isNewSeries: true },
    { id: 'bt', name: 'M2 Series Admin', isNewSeries: true },
    { id: 'tt', name: 'M3 Series Admin', isNewSeries: true },
  ]);

  useEffect(() => {
    if (isAdmin) {
      setTestSeries([
        // New Series Tests (v3.0)
        { id: 'mono', name: 'M1 Series', isNewSeries: true },
        { id: 'bi', name: 'M2 Series', isNewSeries: true },
        { id: 'tri', name: 'M3 Series', isNewSeries: true },
        { id: 'mt', name: 'M1 Series Admin', isNewSeries: true },
        { id: 'bt', name: 'M2 Series Admin', isNewSeries: true },
        { id: 'tt', name: 'M3 Series Admin', isNewSeries: true },

        // Divider label
        // { id: 'divider', name: '── Old Tests ──' },

        // Old Series Tests
        // { id: 'series_a', name: 'Série 15 - S1' },
        // { id: 'series_b', name: 'Série 15 - S2' },
        // { id: 'series_c', name: 'Série 15 - S3' },
        // { id: 'series_25_a', name: 'Série 25 - T1' },
        // { id: 'series_25_b', name: 'Série 25 - T2' },
        // { id: 'series_25_c', name: 'Série 25 - T3' },
        // { id: 'series_25_d', name: 'Série 25 - CTX' },
        // { id: 'series_25_e', name: 'Série 25 - CTX0' },
        // { id: 'series_25_f', name: 'Série 25 - CTX1' },
        // { id: 'series_25_g', name: 'Série 25 - CTX2' },
        // { id: 'series_25_i', name: 'Série 25 - CTX2.5' },
        // { id: 'series_25_h', name: 'Série 25 - CTX3' },
        // { id: 'series_15_j', name: 'Série 15 - CTX4' },
        // { id: 'series_1_k', name: 'Série 1 - Admin' },
      ]);
    } else {
      setTestSeries([
        // { id: 'series_25_a', name: 'Série 25 - T1' },
        // { id: 'series_25_f', name: 'Série 25 - CTX1' },
        // { id: 'series_25_g', name: 'Série 25 - CTX2' },
        // { id: 'series_25_i', name: 'Série 25 - CTX2.5' },
        // { id: 'series_25_h', name: 'Série 25 - CTX3' },
        // { id: 'series_15_j', name: 'Série 15 - CTX4' },
        // { id: 'series_1_k', name: 'Série 1 - Admin' },
        { id: 'mono', name: 'M1 Series', isNewSeries: true },
        { id: 'bi', name: 'M2 Series', isNewSeries: true },
        { id: 'tri', name: 'M3 Series', isNewSeries: true },
      ]);
    }
  }, [isAdmin]);


  // const handleTestSelect = async (seriesId: string) => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     setDropdownOpen(false);
  //     setIsOpen(false);
  //     router.push('/login');
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demo/start/${seriesId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (response.status === 401) {
  //       localStorage.removeItem('token');
  //       setIsLoggedIn(false);
  //       setDropdownOpen(false);
  //       setIsOpen(false);
  //       router.push('/login');
  //       return;
  //     }

  //     if (!response.ok) {
  //       throw new Error('Failed to start test');
  //     }

  //     const data = await response.json();
  //     router.push(`/demo/${data.id}?data=${encodeURIComponent(JSON.stringify(data))}`);
  //   } catch (error) {
  //     console.error('Failed to start test:', error);
  //     localStorage.removeItem('token');
  //     setIsLoggedIn(false);
  //     setDropdownOpen(false);
  //     setIsOpen(false);
  //     router.push('/login');
  //   }
  //   setDropdownOpen(false);
  //   setIsOpen(false);
  // };

  const handleTestSelect = async (test: { id: string; name: string; isNewSeries?: boolean }) => {
    // Skip divider items
    if (test.id === 'divider') return;

    // Handle new series tests (v3.0)
    if (test.isNewSeries) {
      setDropdownOpen(false);
      setIsOpen(false);

      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        // Logged in user - go directly to test info page
        router.push(`/series-test/new?type=${test.id}`);
      } else {
        // Guest user - redirect to series-platform with startTest param to show guest modal
        router.push(`/series-platform?startTest=${test.id}`);
      }
      return;
    }

    // Handle old demo tests
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demo/start/${test.id}`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),  // Only add if exists
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to start test');

      const data = await response.json();
      router.push(`/demo/${data.id}?data=${encodeURIComponent(JSON.stringify(data))}`);
    } catch (error) {
      console.error('Failed to start test:', error);
    }
    setDropdownOpen(false);
    setIsOpen(false);
  };



  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

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
      }
    };

    if (isLoggedIn) {
      checkAdminStatus();
    }
  }, [isLoggedIn]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/mission', label: 'Mission/Vision', icon: Home },
    // { href: '/informations', label: 'Information', icon: Info },
    { href: '/partnerships', label: 'Partenariats', icon: Info },
    // { href: '/demo', label: 'Plateforme', icon: Beaker },
    // { href: '/series-platform', label: 'Plateforme', icon: BarChart3 },
    // { href: '/test-platform', label: 'Test Platform', icon: BookOpen },
    // { href: '/test-dashboard', label: 'Dashboard', icon: BarChart3 },
    ...(isAdmin ? [{ href: '/test-dashboard', label: 'Dashboard', icon: BarChart3 }] : []),
    ...(isAdmin ? [{ href: '/stats', label: 'Stats', icon: TrendingUp }] : []),
    { href: '/about', label: "À propos d'INDX", icon: BarChart3 },
    { href: '/privacy', label: 'Légale', icon: BarChart3 },

  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest('.dropdown-container') && !isOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, isOpen]);

  return (
    <nav className="bg-[#050E3C] backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto pl-4 md:pl-0 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-[#050E3C] to-[#050E3C]  flex items-center justify-center">
              <span className="text-white font-bold text-xl"><Brain /></span>
            </div> */}
            <span className="text-3xl font-bold text-white">INDX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-1 text-white transition-colors duration-300 font-medium"
              >
                {/* <link.icon size={18} /> */}
                <span>{link.label}</span>
              </Link>
            ))}

            {/* INDX1000 Dropdown - Desktop */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 text-white transition-colors duration-300 font-medium"
              >
                <span>INDX1000</span>
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 max-h-96 overflow-y-auto">
                  {testSeries.map((test) => (
                    test.id === 'divider' ? (
                      <div key={test.id} className="px-4 py-2 text-xs text-gray-400 text-center">
                        {test.name}
                      </div>
                    ) : (
                      <button
                        key={test.id}
                        onClick={() => handleTestSelect(test)}
                        className={`w-full text-left px-4 py-2 text-[#050E3C] hover:bg-[#050E3C] hover:text-white transition-colors ${test.isNewSeries ? 'font-semibold' : ''}`}
                      >
                        {test.name}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Remaining links: Dashboard, À propos d'INDX */}
            {navLinks.slice(4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-1 text-white transition-colors duration-300 font-medium"
              >
                <span>{link.label}</span>
              </Link>
            ))}

          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-white transition-colors duration-300"
                >
                  <User size={20} />
                  <span>Profil</span>
                </Link> */}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 font-sm text-white px-4 py-2  transition-colors duration-300"
                >
                  {/* <LogOut size={18} /> */}
                  <span>Déconnexion</span>
                </button>
                <AutoLanguageSelector />
              </>
            ) : (
              <>
                <Link href="/login" className="text-white">
                  Connexion
                </Link>
                <AutoLanguageSelector />
                {/* <Link href="/signup" className="btn-primary rounded-none">
                  Inscription
                </Link> */}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2  text-white transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#050E3C] border-t animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-2 text-white py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {/* <link.icon size={18} /> */}
                <span>{link.label}</span>
              </Link>
            ))}

            {/* INDX1000 Dropdown - Mobile */}
            <div className="border-t">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-full text-white py-2"
              >
                <span>INDX1000</span>
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="pl-4 mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {testSeries.map((test) => (
                    test.id === 'divider' ? (
                      <div key={test.id} className="text-xs text-white/50 text-center py-1">
                        {test.name}
                      </div>
                    ) : (
                      <button
                        key={test.id}
                        onClick={() => {
                          handleTestSelect(test);
                          setIsOpen(false);
                        }}
                        className={`block w-full text-left text-white/80 py-1 text-sm ${test.isNewSeries ? 'font-semibold' : ''}`}
                      >
                        {test.name}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Remaining links: Dashboard, À propos d'INDX */}
            {navLinks.slice(4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-2 text-white py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span>{link.label}</span>
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                {/* <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} />
                  <span>Profil</span>
                </Link> */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-white py-2 w-full"
                >
                  {/* <LogOut size={18} /> */}
                  <span>Déconnexion</span>
                </button>
                <div className="flex items-center justify-left py-2">
                  {/* <span className="text-white">Language</span> */}
                  <AutoLanguageSelector />
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link href="/login" className="block w-full text-white" onClick={() => setIsOpen(false)}>
                  Connexion
                </Link>
                <div className="flex items-center justify-left py-2">
                  {/* <span className="text-white">Language</span> */}
                  <AutoLanguageSelector />
                </div>
                {/* <Link href="/signup" className="block w-full btn-primary text-center rounded-none" onClick={() => setIsOpen(false)}>
                  Inscription
                </Link> */}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}