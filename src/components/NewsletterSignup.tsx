'use client';

import { useState } from 'react';
import { Mail, Sparkles, CheckCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface NewsletterSignupProps {
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export default function NewsletterSignup({
  className = '',
  showTitle = true,
  compact = false
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { isDark } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Send welcome email with discount
      const response = await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        setFirstName('');

        // In a real app, also save to newsletter subscribers database
        console.log('Newsletter signup successful');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`celestial-card p-6 text-center ${className}`}>
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome to the Family! ✨</h3>
        <p className={`mb-4 ${isDark ? 'text-white' : 'text-gray-600'}`}>
          Check your email for a special welcome gift and your first crystal wisdom newsletter.
        </p>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          You'll receive weekly crystal insights, moon phase guidance, and exclusive offers.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className={`flex-1 px-3 py-2 border focus:outline-none focus:ring-1 text-sm ${isDark
              ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
              : 'border-gray-300 text-gray-900 focus:ring-gray-400 focus:border-gray-400'
              }`}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="celestial-button text-sm px-4 py-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Joining...' : 'Join'}
          </button>
        </form>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`celestial-card p-6 ${className}`}>
      {showTitle && (
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <Mail className={`w-6 h-6 mr-2 ${isDark ? 'text-white' : 'text-gray-600'}`} />
            <Sparkles className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-600'}`} />
          </div>
          <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Join Our Crystal Community
          </h3>
          <p className={`${isDark ? 'text-white' : 'text-gray-600'}`}>
            Get weekly crystal wisdom, moon phase guidance, and exclusive offers delivered to your inbox.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={`w-full px-3 py-2 border focus:outline-none focus:ring-1 ${isDark
              ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
              : 'border-gray-300 text-gray-900 focus:ring-gray-400 focus:border-gray-400'
              }`}
            placeholder="Your first name"
          />
        </div>

        <div>
          <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-3 py-2 border focus:outline-none focus:ring-1 ${isDark
              ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
              : 'border-gray-300 text-gray-900 focus:ring-gray-400 focus:border-gray-400'
              }`}
            placeholder="your@email.com"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 font-medium transition-all duration-200 text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
            isDark 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Joining...</span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              <span>Join & Get 15% Off</span>
            </>
          )}
        </button>

        <p className={`text-xs text-center ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          By subscribing, you agree to receive weekly emails from Celestial Crystals.
          You can unsubscribe at any time.
        </p>
      </form>

      <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
        <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>What you'll receive:</h4>
        <ul className={`space-y-2 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
          <li className="flex items-center">
            <Sparkles className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-300' : 'text-gray-400'}`} />
            Weekly crystal wisdom and tips
          </li>
          <li className="flex items-center">
            <Sparkles className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-300' : 'text-gray-400'}`} />
            Moon phase guidance for crystal work
          </li>
          <li className="flex items-center">
            <Sparkles className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-300' : 'text-gray-400'}`} />
            Exclusive discounts and early access
          </li>
          <li className="flex items-center">
            <Sparkles className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-300' : 'text-gray-400'}`} />
            Featured crystal of the week
          </li>
        </ul>
      </div>
    </div>
  );
}
