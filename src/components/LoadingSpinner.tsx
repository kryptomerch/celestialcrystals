import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <Sparkles 
          className={`${sizeClasses[size]} text-purple-300 animate-pulse`} 
        />
        <div className="absolute inset-0 animate-spin">
          <div className={`${sizeClasses[size]} border-2 border-purple-200 border-t-purple-600 rounded-full`}></div>
        </div>
      </div>
      {text && (
        <p className={`mt-4 text-gray-600 ${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}
