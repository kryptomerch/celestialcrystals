'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'minimal' | 'cosmic';
}

export default function ThemeToggle({
  className = '',
  size = 'md',
  showLabel = false,
  variant = 'default'
}: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getButtonStyles = () => {
    const baseStyles = `
      ${sizeClasses[size]}
      relative rounded-full
      transition-all duration-300 ease-in-out
      transform hover:scale-110 active:scale-95
      focus:outline-none focus:ring-2 focus:ring-offset-2
      focus:ring-offset-transparent
    `;

    switch (variant) {
      case 'minimal':
        return `${baseStyles} ${isDark
            ? 'bg-white/10 hover:bg-white/20 text-yellow-300 focus:ring-yellow-400/50'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-400/50'
          }`;

      case 'cosmic':
        return `${baseStyles} ${isDark
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 focus:ring-purple-400'
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 focus:ring-blue-400'
          }`;

      default:
        return `${baseStyles} ${isDark
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/25 focus:ring-yellow-400'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 focus:ring-indigo-400'
          }`;
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <span className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-white/80' : 'text-gray-700'
          }`}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}

      <button
        onClick={toggleTheme}
        className={getButtonStyles()}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Sun Icon */}
          <SunIcon
            className={`
              ${iconSizes[size]}
              absolute transition-all duration-500 ease-in-out
              ${isDark
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 rotate-180 scale-0'
              }
            `}
          />

          {/* Moon Icon */}
          <MoonIcon
            className={`
              ${iconSizes[size]}
              absolute transition-all duration-500 ease-in-out
              ${isDark
                ? 'opacity-0 -rotate-180 scale-0'
                : 'opacity-100 rotate-0 scale-100'
              }
            `}
          />
        </div>

        {/* Glow effect for cosmic variant */}
        {variant === 'cosmic' && (
          <div className={`
            absolute inset-0 rounded-full transition-opacity duration-300 -z-10
            ${isDark
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-md'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 opacity-30 blur-md'
            }
          `} />
        )}
      </button>
    </div>
  );
}

// Floating theme toggle for fixed positioning
export function FloatingThemeToggle() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle size="lg" />
    </div>
  );
}

// Theme toggle for navigation
export function NavThemeToggle() {
  return <ThemeToggle size="md" className="ml-4" />;
}

// Theme toggle with label for settings
export function SettingsThemeToggle() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose your preferred color scheme
        </p>
      </div>
      <ThemeToggle size="md" showLabel />
    </div>
  );
}
