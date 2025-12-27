'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Home, BookOpen, BarChart3, Info, Beaker, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [testSeries, setTestSeries] = useState([
    { id: 'series_a', name: 'Série 15 - S1' },
    { id: 'series_b', name: 'Série 15 - S2' },
    { id: 'series_c', name: 'Série 15 - S3' },
    { id: 'series_25_a', name: 'Série 25 - T1' },
    { id: 'series_25_b', name: 'Série 25 - T2' },
    { id: 'series_25_c', name: 'Série 25 - T3' },
  ]);

  const handleTestSelect = async (seriesId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demo/start/${seriesId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
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
    { href: '/demo', label: 'Plateforme', icon: Beaker },
    // { href: '/test-platform', label: 'Test Platform', icon: BookOpen },
    { href: '/test-dashboard', label: 'Dashboard', icon: BarChart3 },

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
            <span className="text-2xl font-bold text-white">INDX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
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
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  {testSeries.map((test) => (
                    <button
                      key={test.id}
                      onClick={() => handleTestSelect(test.id)}
                      className="w-full text-left px-4 py-2 text-[#050E3C] hover:bg-blue-50 transition-colors"
                    >
                      {test.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-white transition-colors duration-300"
                >
                  <User size={20} />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-white text-[#050E3C] px-4 py-2  transition-colors duration-300"
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary rounded-none">
                  Connexion
                </Link>
                <Link href="/signup" className="btn-primary rounded-none">
                  Inscription
                </Link>
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
            {navLinks.map((link) => (
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
                <div className="pl-4 mt-2 space-y-2">
                  {testSeries.map((test) => (
                    <button
                      key={test.id}
                      onClick={() => {
                        handleTestSelect(test.id);
                        setIsOpen(false);
                      }}
                      className="block w-full text-left text-white/80 py-1 text-sm"
                    >
                      {test.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-white py-2 w-full"
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link href="/login" className="block w-full btn-secondary text-center rounded-none" onClick={() => setIsOpen(false)}>
                  Connexion
                </Link>
                <Link href="/signup" className="block w-full btn-primary text-center rounded-none" onClick={() => setIsOpen(false)}>
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}