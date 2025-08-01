'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { isDark } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${isDark ? 'bg-purple-500' : 'bg-blue-400'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${isDark ? 'bg-indigo-500' : 'bg-purple-400'}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 ${isDark ? 'bg-pink-500' : 'bg-indigo-400'}`}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Image
              src={isDark ? "/images/logo-white.png" : "/images/logo-dark.png"}
              alt="Celestial Crystals"
              width={200}
              height={60}
              className="h-12 w-auto"
            />
          </div>
          <h2 className={`text-2xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Forgot Password?
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className={`p-8 rounded-2xl shadow-2xl backdrop-blur-sm border ${isDark
          ? 'bg-gray-800/80 border-gray-700/50 shadow-purple-900/20'
          : 'bg-white/80 border-gray-200/50 shadow-blue-900/10'
          }`}>
          
          {success ? (
            <div className="text-center space-y-6">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                <CheckCircle className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Check Your Email
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  If an account with that email exists, we've sent you a password reset link.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/auth/signin"
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] block text-center ${isDark
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                    }`}
                >
                  Back to Sign In
                </Link>
                
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 border ${isDark
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Send Another Email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className={`border px-4 py-3 text-sm rounded-lg ${isDark
                  ? 'bg-red-900/50 border-red-700 text-red-300'
                  : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 hover:bg-gray-700/70'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400'
                      }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] ${isDark
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                  }`}
              >
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className={`inline-flex items-center space-x-2 text-sm font-medium transition-colors ${isDark
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-indigo-600 hover:text-indigo-500'
                    }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
