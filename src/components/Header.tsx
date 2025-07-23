'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import CartButton from '@/components/CartButton';
import UserMenu from '@/components/UserMenu';
import ThemeToggle from '@/components/ThemeToggle';
import { checkAdminAccess } from '@/utils/admin';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: session, status } = useSession();
  const { isDark } = useTheme();

  useEffect(() => {
    if (status !== 'loading') {
      setIsAdmin(checkAdminAccess(session));
    }
  }, [session, status]);

  return (
    <>
      {/* Free Shipping Banner */}
      <div className={`${isDark
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
        } py-2 text-center`}>
        <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-medium">
          <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>🚚 FREE SHIPPING on orders over $75!</span>
        </div>
      </div>

      <header className={`${isDark
        ? 'bg-gray-950 border-b border-gray-700'
        : 'bg-white border-b border-gray-200'
        } sticky top-0 z-50 shadow-sm`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24 sm:h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center -space-x-2 sm:-space-x-3">
              <img
                src="/images/logo-design.png"
                alt="Celestial Crystals Logo"
                className={`w-20 h-20 sm:w-24 sm:h-24 object-contain ${isDark ? 'brightness-0 invert' : ''}`}
              />
              <img
                src="/images/logo-name.png"
                alt="Celestial"
                className={`h-32 sm:h-36 object-contain ${isDark ? 'brightness-0 invert' : ''}`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <Link href="/" className={`px-3 py-2 ${isDark
                ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                } rounded-md font-medium transition-all duration-200 text-sm uppercase tracking-wide`}>
                Home
              </Link>
              <Link href="/crystals" className={`px-3 py-2 ${isDark
                ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                } rounded-md font-medium transition-all duration-200 text-sm uppercase tracking-wide whitespace-nowrap`}>
                All Crystals
              </Link>
              <Link href="/categories" className={`px-3 py-2 ${isDark
                ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                } rounded-md font-medium transition-all duration-200 text-sm uppercase tracking-wide`}>
                Categories
              </Link>
              <Link href="/birthdate-guide" className={`px-3 py-2 ${isDark
                ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                } rounded-md font-medium transition-all duration-200 text-sm uppercase tracking-wide whitespace-nowrap`}>
                Birthdate Guide
              </Link>
              <Link href="/blog" className={`px-3 py-2 ${isDark
                ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                } rounded-md font-medium transition-all duration-200 text-sm uppercase tracking-wide`}>
                Blog
              </Link>
              <Link href="/crystal-care" className={`px-3 py-2 ${isDark
                ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                } rounded-md font-medium transition-all duration-200 text-sm uppercase tracking-wide whitespace-nowrap`}>
                Crystal Care
              </Link>
              <Link href="/about" className={`px-3 py-2 ${isDark
                ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                } rounded-md font-medium transition-all duration-200 text-sm uppercase tracking-wide`}>
                About
              </Link>

            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <CartButton />
              {isAdmin && (
                <Link href="/admin" className={`p-2 ${isDark
                  ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  } rounded-md transition-all duration-200`} title="Admin Dashboard">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </Link>
              )}
              <ThemeToggle size="md" variant="cosmic" />
              <UserMenu />
              <button
                className={`lg:hidden p-2 ${isDark
                  ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  } rounded-md transition-all duration-200`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className={`lg:hidden border-t ${isDark
              ? 'border-gray-700 bg-gray-900'
              : 'border-gray-200 bg-white'
              } shadow-lg`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className={`block px-3 py-2 ${isDark
                    ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    } font-medium transition-colors text-sm uppercase tracking-wide`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/crystals"
                  className={`block px-3 py-2 ${isDark
                    ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    } font-medium transition-colors text-sm uppercase tracking-wide`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Crystals
                </Link>
                <Link
                  href="/categories"
                  className={`block px-3 py-2 ${isDark
                    ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    } font-medium transition-colors text-sm uppercase tracking-wide`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/birthdate-guide"
                  className={`block px-3 py-2 ${isDark
                    ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    } font-medium transition-colors text-sm uppercase tracking-wide`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Birthdate Guide
                </Link>
                <Link
                  href="/blog"
                  className={`block px-3 py-2 ${isDark
                    ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    } font-medium transition-colors text-sm uppercase tracking-wide`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/crystal-care"
                  className={`block px-3 py-2 ${isDark
                    ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    } font-medium transition-colors text-sm uppercase tracking-wide`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Crystal Care
                </Link>
                <Link
                  href="/about"
                  className={`block px-3 py-2 ${isDark
                    ? 'text-white hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    } font-medium transition-colors text-sm uppercase tracking-wide`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>

              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
