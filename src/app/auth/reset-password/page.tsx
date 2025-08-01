'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { isDark } = useTheme();

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
      setTokenValid(false);
      return;
    }

    // Verify token on page load
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setTokenValid(true);
          setUserEmail(data.user.email);
        } else {
          setTokenValid(false);
          setError(data.error || 'Invalid or expired reset link');
        }
      } catch (error) {
        setTokenValid(false);
        setError('Failed to verify reset link');
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="max-w-md w-full text-center space-y-6">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
            <XCircle className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          
          <div>
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Invalid Reset Link
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {error || 'This password reset link is invalid or has expired.'}
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/forgot-password"
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] block text-center ${isDark
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                }`}
            >
              Request New Reset Link
            </Link>
            
            <Link
              href="/auth/signin"
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 border block text-center ${isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            Reset Your Password
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter your new password for {userEmail}
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
                  Password Reset Successful
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>

              <Link
                href="/auth/signin"
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] block text-center ${isDark
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                  }`}
              >
                Sign In Now
              </Link>
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
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  New Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 hover:bg-gray-700/70'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 hover:bg-gray-700/70'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
