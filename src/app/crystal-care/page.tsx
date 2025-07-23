'use client';

import { Sparkles, Sun, Moon, Droplets, Wind, Shield, Heart, Zap, RefreshCw } from 'lucide-react';
import { getCrystalGlowClass } from '@/utils/crystal-glow';
import { useTheme } from '@/contexts/ThemeContext';

// Map care categories to crystal colors for glow effects
const getCareGlowClass = (title: string): string => {
  const careColors: { [key: string]: string[] } = {
    'Cleansing Methods': ['blue'], // water/cleansing = blue
    'Charging Methods': ['yellow'], // energy/sun = yellow
    'Storage Tips': ['green'], // protection/care = green
    'Handling Guidelines': ['purple'], // wisdom/knowledge = purple
    'Maintenance': ['white'], // purity/cleansing = white
    'Energy Work': ['purple'], // spiritual = purple
    'Programming': ['blue'], // mental/focus = blue
    'Activation': ['orange'], // energy/fire = orange
  };

  const colors = careColors[title] || ['green']; // default green for care
  return getCrystalGlowClass(colors);
};

export default function CrystalCarePage() {
  const { isDark } = useTheme();
  const careCategories = [
    {
      title: 'Cleansing Methods',
      icon: Droplets,
      methods: [
        {
          name: 'Running Water',
          description: 'Hold your crystal under cool running water for 1-2 minutes. Visualize negative energy washing away.',
          icon: Droplets,
          suitable: 'Most crystals (avoid soft stones like selenite)',
          frequency: 'Weekly or after heavy use'
        },
        {
          name: 'Moonlight',
          description: 'Place crystals outside or on a windowsill during a full moon overnight.',
          icon: Moon,
          suitable: 'All crystals',
          frequency: 'Monthly during full moon'
        },
        {
          name: 'Sage Smoke',
          description: 'Pass crystals through sage smoke while setting intention to cleanse.',
          icon: Wind,
          suitable: 'All crystals',
          frequency: 'As needed'
        },
        {
          name: 'Salt Bath',
          description: 'Bury crystals in sea salt for 24 hours. Use a bowl, not direct contact.',
          icon: Shield,
          suitable: 'Hard crystals only (avoid soft or porous stones)',
          frequency: 'Monthly for deep cleansing'
        }
      ]
    },
    {
      title: 'Charging Methods',
      icon: Zap,
      methods: [
        {
          name: 'Sunlight',
          description: 'Place crystals in direct sunlight for 4-6 hours to energize them.',
          icon: Sun,
          suitable: 'Most crystals (avoid amethyst, rose quartz - may fade)',
          frequency: 'Monthly or when energy feels low'
        },
        {
          name: 'Crystal Clusters',
          description: 'Place smaller crystals on large quartz or amethyst clusters overnight.',
          icon: Sparkles,
          suitable: 'All crystals',
          frequency: 'Weekly maintenance'
        },
        {
          name: 'Earth Connection',
          description: 'Bury crystals in earth for 24 hours to ground and recharge them.',
          icon: Heart,
          suitable: 'All crystals',
          frequency: 'Seasonally for deep grounding'
        },
        {
          name: 'Intention Setting',
          description: 'Hold crystal and focus your intention while visualizing white light filling it.',
          icon: RefreshCw,
          suitable: 'All crystals',
          frequency: 'Before each use'
        }
      ]
    }
  ];

  const storageGuidelines = [
    {
      title: 'Proper Storage',
      tips: [
        'Store crystals separately to prevent scratching',
        'Use soft cloth pouches or lined boxes',
        'Keep away from direct sunlight for fade-prone crystals',
        'Maintain stable temperature and humidity'
      ]
    },
    {
      title: 'Handling Care',
      tips: [
        'Handle with clean hands',
        'Avoid dropping or rough handling',
        'Clean gently with soft, dry cloth',
        'Be mindful of crystal hardness levels'
      ]
    },
    {
      title: 'Energy Maintenance',
      tips: [
        'Cleanse after each healing session',
        'Charge regularly to maintain potency',
        'Set clear intentions when working with crystals',
        'Trust your intuition about when care is needed'
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6 -space-x-1">
            <img
              src="/images/logo-design.png"
              alt="Celestial Crystals Logo"
              className={`w-18 h-18 object-contain ${isDark ? 'brightness-0 invert' : ''}`}
            />
            <h1 className={`text-4xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>Crystal Care Guide</h1>
          </div>
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-600'}`}>
            Learn how to properly cleanse, charge, and care for your precious crystals
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className={`celestial-card p-8 mb-12 ${getCareGlowClass('Cleansing Methods')}`}>
          <h2 className={`text-2xl font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Why Crystal Care Matters</h2>
          <p className={`mb-6 ${isDark ? 'text-white' : 'text-gray-600'}`}>
            Crystals absorb and store energy from their environment and the people who handle them.
            Regular cleansing and charging helps maintain their natural vibrational frequency and ensures
            they continue to work effectively for your spiritual and healing practices.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <RefreshCw className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Energy Reset</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>Remove accumulated negative energy</p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Zap className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Power Boost</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>Restore and amplify natural properties</p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Heart className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Longevity</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>Preserve beauty and effectiveness</p>
            </div>
          </div>
        </div>

        {/* Care Methods */}
        {careCategories.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center mb-8">
                <div className={`w-10 h-10 flex items-center justify-center mr-3 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <IconComponent className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h2 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.methods.map((method, methodIndex) => {
                  const MethodIcon = method.icon;
                  return (
                    <div key={methodIndex} className={`celestial-card p-6 ${getCareGlowClass(category.title)}`}>
                      <div className="flex items-center mb-4">
                        <MethodIcon className={`w-6 h-6 mr-3 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                        <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{method.name}</h3>
                      </div>
                      <p className={`mb-4 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>{method.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Suitable for: </span>
                          <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>{method.suitable}</span>
                        </div>
                        <div>
                          <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequency: </span>
                          <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>{method.frequency}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Storage & Care Guidelines */}
        <div className="mb-12">
          <h2 className={`text-2xl font-medium mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Storage & Care Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storageGuidelines.map((guideline, index) => (
              <div key={index} className={`celestial-card p-6 ${getCareGlowClass('Storage Tips')}`}>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{guideline.title}</h3>
                <ul className="space-y-2">
                  {guideline.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className={`text-sm flex items-start ${isDark ? 'text-white' : 'text-gray-600'}`}>
                      <span className={`mr-2 ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Crystal-Specific Care */}
        <div className={`celestial-card p-8 mb-12 ${getCareGlowClass('Handling Guidelines')}`}>
          <h2 className={`text-2xl font-medium mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Crystal-Specific Care Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Water-Sensitive Crystals</h3>
              <p className={`mb-3 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>Avoid water cleansing for these crystals:</p>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                <li>• Selenite (dissolves in water)</li>
                <li>• Halite (salt crystal)</li>
                <li>• Pyrite (may rust)</li>
                <li>• Malachite (toxic when wet)</li>
                <li>• Turquoise (porous, may discolor)</li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sun-Sensitive Crystals</h3>
              <p className={`mb-3 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>These crystals may fade in direct sunlight:</p>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                <li>• Amethyst (may turn clear)</li>
                <li>• Rose Quartz (may fade to white)</li>
                <li>• Citrine (may become pale)</li>
                <li>• Fluorite (colors may fade)</li>
                <li>• Kunzite (very light sensitive)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className={`celestial-card p-8 border-l-4 ${isDark ? 'border-purple-500' : 'border-gray-400'} ${getCareGlowClass('Maintenance')}`}>
          <h2 className={`text-2xl font-medium mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Care Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Care</h3>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                <li>• Handle with clean hands</li>
                <li>• Set positive intentions</li>
                <li>• Store safely when not in use</li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Weekly Care</h3>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                <li>• Gentle cleansing (water or sage)</li>
                <li>• Charge on crystal cluster</li>
                <li>• Check for any damage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <h2 className={`text-2xl font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Need More Guidance?</h2>
          <p className={`mb-6 ${isDark ? 'text-white' : 'text-gray-600'}`}>
            Our crystal experts are here to help you care for your precious stones.
          </p>
          <a
            href="/contact"
            className={`inline-flex items-center justify-center px-8 py-3 font-medium transition-all duration-200 text-sm uppercase tracking-wide ${
              isDark 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            Contact Our Experts
          </a>
        </div>
      </div>
    </div>
  );
}
