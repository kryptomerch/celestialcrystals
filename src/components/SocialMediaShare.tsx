'use client';

import { Share2, Facebook, Instagram } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

interface SocialMediaShareProps {
  title: string;
  content: string;
  image?: string;
  url?: string;
  hashtags?: string[];
}

export default function SocialMediaShare({ title, content, image, url, hashtags }: SocialMediaShareProps) {
  const { isDark } = useTheme();

  // Build share URLs for this article (ensure absolute URL with site origin)
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim().length)
    ? process.env.NEXT_PUBLIC_SITE_URL!
    : origin;
  const toAbsolute = (u: string) => {
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.startsWith('/')) return `${siteOrigin}${u}`;
    return `${siteOrigin}/${u}`;
  };
  const canonicalUrl = typeof window !== 'undefined' ? toAbsolute(url || window.location.href) : (url || '');
  const hashtagParam = hashtags && hashtags.length ? `&hashtags=${encodeURIComponent(hashtags.join(','))}` : '';
  const xText = encodeURIComponent(`${title} ${canonicalUrl}`);
  const X_SHARE_URL = `https://twitter.com/intent/tweet?text=${xText}&url=${encodeURIComponent(canonicalUrl)}${hashtagParam}`;
  const FB_SHARE_URL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}&quote=${encodeURIComponent(title)}`;
  const IG_APP_URL = 'https://www.instagram.com/';

  const openPopup = (href: string) => {
    if (typeof window !== 'undefined') {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const handleXShare = () => openPopup(X_SHARE_URL);
  const handleFacebookShare = () => openPopup(FB_SHARE_URL);

  const handleInstagramShare = () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      (navigator as any).share({ title, url: canonicalUrl }).catch(() => { });
    } else if (typeof window !== 'undefined') {
      openPopup(IG_APP_URL);
    }
  };

  // Latest X logo (inline SVG)
  const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M18.244 2H21l-6.564 7.51L22 22h-6.955l-4.53-5.89L4.977 22H2l7.033-8.044L2 2h7.045l4.06 5.43L18.244 2zm-1.227 18h2.06L7.06 4H4.94l12.077 16z" />
    </svg>
  );

  const items = [
    {
      name: 'X',
      href: X_SHARE_URL,
      icon: (className: string) => <XIcon className={className} />,
      bg: 'bg-black hover:bg-gray-900',
      onClick: () => openPopup(X_SHARE_URL),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (className: string) => <Instagram className={className} />,
      bg: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      onClick: handleInstagramShare,
    } as any,
    {
      name: 'Facebook',
      href: FB_SHARE_URL,
      icon: (className: string) => <Facebook className={className} />,
      bg: 'bg-blue-600 hover:bg-blue-700',
    },
  ];

  return (
    <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Share2 className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
        <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Share this article
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {items.map(({ name, href, icon, bg, onClick }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            onClick={(e) => {
              if (onClick) {
                e.preventDefault();
                onClick();
              }
            }}
            className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${isDark
              ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
              : 'bg-gray-50 hover:bg-gray-100 border border-gray-300'
              }`}
          >
            <div className={`p-2 rounded-full ${bg}`}>
              {icon('w-5 h-5 text-white')}
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
