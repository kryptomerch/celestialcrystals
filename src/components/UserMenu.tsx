'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, Settings, ShoppingBag, ChevronDown, Shield } from 'lucide-react';
import { checkAdminAccess } from '@/utils/admin';
import { useTheme } from '@/contexts/ThemeContext';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(checkAdminAccess(session));
  }, [session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setIsOpen(false);
  };

  if (status === 'loading') {
    return (
      <div className={`w-8 h-8 rounded-full animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    );
  }

  if (!session) {
    return (
      <Link
        href="/auth/signin"
        className={`p-2 transition-colors ${isDark
          ? 'text-white hover:text-gray-300'
          : 'text-gray-700 hover:text-gray-900'
          }`}
      >
        <User className="w-6 h-6" />
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 p-2 transition-colors ${isDark
          ? 'text-white hover:text-gray-300'
          : 'text-gray-700 hover:text-gray-900'
          }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={`${session.user.firstName || ''} ${session.user.lastName || ''}`.trim() || 'User'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 border shadow-lg z-50 ${isDark
          ? 'bg-gray-800 border-gray-600'
          : 'bg-white border-gray-200'
          }`}>
          <div className="py-2">
            <div className={`px-4 py-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-100'}`}>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {`${session.user?.firstName || ''} ${session.user?.lastName || ''}`.trim() || 'User'}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                {session.user?.email}
              </p>
            </div>

            <Link
              href="/profile"
              className={`flex items-center px-4 py-2 text-sm transition-colors ${isDark
                ? 'text-white hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3" />
              Profile Settings
            </Link>

            <Link
              href="/orders"
              className={`flex items-center px-4 py-2 text-sm transition-colors ${isDark
                ? 'text-white hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="w-4 h-4 mr-3" />
              My Orders
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center px-4 py-2 text-sm transition-colors border-t ${isDark
                  ? 'text-white hover:bg-gray-700 border-gray-600'
                  : 'text-gray-700 hover:bg-gray-50 border-gray-100'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <Shield className="w-4 h-4 mr-3" />
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${isDark
                ? 'text-white hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
