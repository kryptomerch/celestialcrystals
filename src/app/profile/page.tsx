'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Settings, Package, Heart, Star, Edit2, Save, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  phone?: string;
  image?: string;
  newsletterSubscribed: boolean;
  marketingEmails: boolean;
  createdAt: string;
  _count: {
    orders: number;
    reviews: number;
    wishlistItems: number;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    phone: '',
    newsletterSubscribed: false,
    marketingEmails: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setEditData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          birthDate: data.user.birthDate ? data.user.birthDate.split('T')[0] : '',
          phone: data.user.phone || '',
          newsletterSubscribed: data.user.newsletterSubscribed,
          marketingEmails: data.user.marketingEmails,
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
        phone: profile.phone || '',
        newsletterSubscribed: profile.newsletterSubscribed,
        marketingEmails: profile.marketingEmails,
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <button
            onClick={() => router.push('/')}
            className="celestial-button"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>My Profile</h1>
          <p className={`mt-2 ${isDark ? 'text-white' : 'text-gray-600'}`}>Manage your account settings and preferences</p>
        </div>

        {/* Messages */}
        {error && (
          <div className={`mb-6 border rounded-lg p-4 ${isDark
            ? 'bg-red-900/50 border-red-700'
            : 'bg-red-50 border-red-200'
            }`}>
            <p className={`${isDark ? 'text-red-300' : 'text-red-800'}`}>{error}</p>
          </div>
        )}

        {success && (
          <div className={`mb-6 border rounded-lg p-4 ${isDark
            ? 'bg-green-900/50 border-green-700'
            : 'bg-green-50 border-green-200'
            }`}>
            <p className={`${isDark ? 'text-green-300' : 'text-green-800'}`}>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="celestial-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`flex items-center space-x-2 ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`flex items-center space-x-2 disabled:opacity-50 ${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className={`flex items-center space-x-2 ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.firstName || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.lastName || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900">{profile.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="(555) 123-4567"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birth Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.birthDate}
                      onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.birthDate
                        ? new Date(profile.birthDate).toLocaleDateString()
                        : 'Not set'
                      }
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send you special birthday discounts!
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Email Preferences</h3>

                  <label className="flex items-center space-x-3">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editData.newsletterSubscribed}
                        onChange={(e) => setEditData({ ...editData, newsletterSubscribed: e.target.checked })}
                        className="h-4 w-4 text-gray-900 focus:ring-gray-400 border-gray-300"
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${profile.newsletterSubscribed ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
                        }`}>
                        {profile.newsletterSubscribed && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                    <span className="text-sm text-gray-700">Subscribe to newsletter</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editData.marketingEmails}
                        onChange={(e) => setEditData({ ...editData, marketingEmails: e.target.checked })}
                        className="h-4 w-4 text-gray-900 focus:ring-gray-400 border-gray-300"
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${profile.marketingEmails ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
                        }`}>
                        {profile.marketingEmails && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                    <span className="text-sm text-gray-700">Receive marketing emails</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="space-y-6">
            <div className="celestial-card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Overview</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Orders</span>
                  </div>
                  <span className="font-medium text-gray-900">{profile._count.orders}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Reviews</span>
                  </div>
                  <span className="font-medium text-gray-900">{profile._count.reviews}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Wishlist Items</span>
                  </div>
                  <span className="font-medium text-gray-900">{profile._count.wishlistItems}</span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/orders')}
                className="w-full celestial-button-outline"
              >
                View Order History
              </button>

              <button
                onClick={() => router.push('/wishlist')}
                className="w-full celestial-button-outline"
              >
                View Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
