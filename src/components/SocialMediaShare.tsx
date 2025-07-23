'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Instagram, Copy, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface SocialMediaShareProps {
  title: string;
  content: string;
  image?: string;
  url?: string;
  hashtags?: string[];
}

export default function SocialMediaShare({ 
  title, 
  content, 
  image, 
  url = window.location.href,
  hashtags = []
}: SocialMediaShareProps) {
  const { isDark } = useTheme();
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const formatContentForPlatform = (platform: string) => {
    const baseContent = `${title}\n\n${content}`;
    const hashtagString = hashtags.length > 0 ? `\n\n${hashtags.map(tag => `#${tag}`).join(' ')}` : '';
    
    switch (platform) {
      case 'twitter':
        // Twitter has 280 character limit
        const twitterContent = baseContent.length > 200 
          ? baseContent.substring(0, 200) + '...' 
          : baseContent;
        return `${twitterContent}${hashtagString}\n\n${url}`;
        
      case 'facebook':
        return `${baseContent}${hashtagString}\n\n${url}`;
        
      case 'instagram':
        return `${baseContent}${hashtagString}\n\nLink in bio: ${url}`;
        
      default:
        return `${baseContent}${hashtagString}\n\n${url}`;
    }
  };

  const copyToClipboard = async (platform: string) => {
    try {
      const formattedContent = formatContentForPlatform(platform);
      
      // If image is provided, create a more complete sharing package
      let shareContent = formattedContent;
      
      if (image) {
        shareContent += `\n\n[Image: ${image}]`;
      }
      
      await navigator.clipboard.writeText(shareContent);
      setCopiedPlatform(platform);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedPlatform(null), 2000);
      
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const openNativeShare = async (platform: string) => {
    const formattedContent = formatContentForPlatform(platform);
    
    // Try native sharing first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: formattedContent,
          url: url
        });
        return;
      } catch (error) {
        // Fall back to copy to clipboard
        copyToClipboard(platform);
      }
    } else {
      // Desktop - copy to clipboard
      copyToClipboard(platform);
    }
  };

  const shareButtons = [
    {
      platform: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      platform: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-600'
    },
    {
      platform: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Share2 className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
        <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Share on Social Media
        </h3>
      </div>
      
      <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        Click a platform to copy the formatted content to your clipboard, then paste it on your social media.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {shareButtons.map((button) => {
          const Icon = button.icon;
          const isCopied = copiedPlatform === button.platform;
          
          return (
            <button
              key={button.platform}
              onClick={() => openNativeShare(button.platform)}
              className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
                isDark 
                  ? 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-2 rounded-full ${button.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {button.name}
                </span>
                <div className="flex items-center space-x-1">
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className={`w-4 h-4 ${button.textColor}`} />
                      <span className={`text-xs ${button.textColor}`}>Copy</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Preview Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Content Preview:
        </h4>
        <div className={`p-3 rounded border text-sm font-mono ${
          isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          <div className="whitespace-pre-wrap">
            {formatContentForPlatform('instagram')}
          </div>
        </div>
      </div>
    </div>
  );
}
