'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Home, BookOpen, BarChart3, Info, Beaker, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

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
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/demo', label: 'Test Platform', icon: Beaker },
    // { href: '/test-platform', label: 'Test Platform', icon: BookOpen },
    { href: '/test-dashboard', label: 'Test Dashboard', icon: BarChart3 },
    { href: '/information', label: 'Information', icon: Info },
  ];

  return (
    <nav className="bg-[#050E3C] backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-white text-[#050E3C] px-4 py-2  transition-colors duration-300"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary rounded-none">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary rounded-none">
                  Sign Up
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
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-white py-2 w-full"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link href="/login" className="block w-full btn-secondary text-center rounded-none" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="block w-full btn-primary text-center rounded-none" onClick={() => setIsOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}