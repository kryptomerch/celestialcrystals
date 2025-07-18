import { Sparkles, Sun, Moon, Droplets, Wind, Shield, Heart, Zap, RefreshCw } from 'lucide-react';

export default function CrystalCarePage() {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-gray-600 mr-4" />
            <h1 className="text-4xl font-light text-gray-900">Crystal Care Guide</h1>
          </div>
          <p className="text-xl text-gray-600">
            Learn how to properly cleanse, charge, and care for your precious crystals
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="celestial-card p-8 mb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Why Crystal Care Matters</h2>
          <p className="text-gray-600 mb-6">
            Crystals absorb and store energy from their environment and the people who handle them. 
            Regular cleansing and charging helps maintain their natural vibrational frequency and ensures 
            they continue to work effectively for your spiritual and healing practices.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Energy Reset</h3>
              <p className="text-gray-600 text-sm">Remove accumulated negative energy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Power Boost</h3>
              <p className="text-gray-600 text-sm">Restore and amplify natural properties</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Longevity</h3>
              <p className="text-gray-600 text-sm">Preserve beauty and effectiveness</p>
            </div>
          </div>
        </div>

        {/* Care Methods */}
        {careCategories.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center mr-3">
                  <IconComponent className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-medium text-gray-900">{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.methods.map((method, methodIndex) => {
                  const MethodIcon = method.icon;
                  return (
                    <div key={methodIndex} className="celestial-card p-6">
                      <div className="flex items-center mb-4">
                        <MethodIcon className="w-6 h-6 text-gray-600 mr-3" />
                        <h3 className="text-lg font-medium text-gray-900">{method.name}</h3>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">{method.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-900 text-sm">Suitable for: </span>
                          <span className="text-gray-600 text-sm">{method.suitable}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 text-sm">Frequency: </span>
                          <span className="text-gray-600 text-sm">{method.frequency}</span>
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
          <h2 className="text-2xl font-medium text-gray-900 mb-8 text-center">Storage & Care Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storageGuidelines.map((guideline, index) => (
              <div key={index} className="celestial-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{guideline.title}</h3>
                <ul className="space-y-2">
                  {guideline.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-gray-600 text-sm flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Crystal-Specific Care */}
        <div className="celestial-card p-8 mb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Crystal-Specific Care Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Water-Sensitive Crystals</h3>
              <p className="text-gray-600 mb-3 text-sm">Avoid water cleansing for these crystals:</p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Selenite (dissolves in water)</li>
                <li>• Halite (salt crystal)</li>
                <li>• Pyrite (may rust)</li>
                <li>• Malachite (toxic when wet)</li>
                <li>• Turquoise (porous, may discolor)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sun-Sensitive Crystals</h3>
              <p className="text-gray-600 mb-3 text-sm">These crystals may fade in direct sunlight:</p>
              <ul className="space-y-1 text-gray-600 text-sm">
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
        <div className="celestial-card p-8 border-l-4 border-gray-400">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Quick Care Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Daily Care</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Handle with clean hands</li>
                <li>• Set positive intentions</li>
                <li>• Store safely when not in use</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Weekly Care</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Gentle cleansing (water or sage)</li>
                <li>• Charge on crystal cluster</li>
                <li>• Check for any damage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Need More Guidance?</h2>
          <p className="text-gray-600 mb-6">
            Our crystal experts are here to help you care for your precious stones.
          </p>
          <a
            href="/contact"
            className="celestial-button inline-flex items-center"
          >
            Contact Our Experts
          </a>
        </div>
      </div>
    </div>
  );
}
