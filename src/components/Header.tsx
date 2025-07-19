'use client';

import { useState } from 'react';
import { User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import CartButton from '@/components/CartButton';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/images/logo-design.png"
              alt="Celestial Crystals Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <img
              src="/images/logo-name.png"
              alt="Celestial"
              className="h-15 sm:h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm uppercase tracking-wide">
              Home
            </Link>
            <Link href="/crystals" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm uppercase tracking-wide">
              All Crystals
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm uppercase tracking-wide">
              Categories
            </Link>
            <Link href="/birthdate-guide" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm uppercase tracking-wide">
              Birthdate Guide
            </Link>
            <Link href="/crystal-care" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm uppercase tracking-wide">
              Crystal Care
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm uppercase tracking-wide">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm uppercase tracking-wide">
              Contact
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <CartButton />
            <Link href="/auth/signin" className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors text-sm uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/crystals"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors text-sm uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Crystals
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors text-sm uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/birthdate-guide"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors text-sm uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Birthdate Guide
              </Link>
              <Link
                href="/crystal-care"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors text-sm uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Crystal Care
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors text-sm uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors text-sm uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
