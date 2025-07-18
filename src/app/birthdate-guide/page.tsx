'use client';

import { useState } from 'react';
import { getRecommendedCrystals, getZodiacSign, Crystal } from '@/data/crystals';
import { Calendar, Star, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CrystalModal from '@/components/CrystalModal';

export default function BirthdateGuidePage() {
  const [birthDate, setBirthDate] = useState('');
  const [recommendations, setRecommendations] = useState<Crystal[]>([]);
  const [zodiacSign, setZodiacSign] = useState('');
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const { addToCart } = useCart();

  const handleBirthDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthDate) {
      const date = new Date(birthDate);
      const recommended = getRecommendedCrystals(date);
      const sign = getZodiacSign(date);
      setRecommendations(recommended);
      setZodiacSign(sign);
    }
  };

  const zodiacInfo = {
    'Aries': { element: 'Fire', traits: ['Courageous', 'Energetic', 'Leadership'], dates: 'March 21 - April 19' },
    'Taurus': { element: 'Earth', traits: ['Reliable', 'Patient', 'Practical'], dates: 'April 20 - May 20' },
    'Gemini': { element: 'Air', traits: ['Adaptable', 'Curious', 'Communicative'], dates: 'May 21 - June 20' },
    'Cancer': { element: 'Water', traits: ['Intuitive', 'Emotional', 'Protective'], dates: 'June 21 - July 22' },
    'Leo': { element: 'Fire', traits: ['Confident', 'Generous', 'Creative'], dates: 'July 23 - August 22' },
    'Virgo': { element: 'Earth', traits: ['Analytical', 'Practical', 'Helpful'], dates: 'August 23 - September 22' },
    'Libra': { element: 'Air', traits: ['Balanced', 'Diplomatic', 'Harmonious'], dates: 'September 23 - October 22' },
    'Scorpio': { element: 'Water', traits: ['Intense', 'Passionate', 'Mysterious'], dates: 'October 23 - November 21' },
    'Sagittarius': { element: 'Fire', traits: ['Adventurous', 'Optimistic', 'Philosophical'], dates: 'November 22 - December 21' },
    'Capricorn': { element: 'Earth', traits: ['Ambitious', 'Disciplined', 'Responsible'], dates: 'December 22 - January 19' },
    'Aquarius': { element: 'Air', traits: ['Independent', 'Innovative', 'Humanitarian'], dates: 'January 20 - February 18' },
    'Pisces': { element: 'Water', traits: ['Compassionate', 'Intuitive', 'Artistic'], dates: 'February 19 - March 20' }
  };

  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Black': '#000000', 'Brown': '#8B4513', 'Golden': '#FFD700', 'Light Blue': '#87CEEB',
      'Blue-Green': '#0D98BA', 'Blue': '#0000FF', 'Red': '#FF0000', 'Orange': '#FFA500',
      'Yellow': '#FFFF00', 'Green': '#008000', 'Light Green': '#90EE90', 'Indigo': '#4B0082',
      'Violet': '#8A2BE2', 'White': '#FFFFFF', 'Cream': '#F5F5DC', 'Pink': '#FFC0CB',
      'Rose': '#FF69B4', 'Purple': '#800080', 'Lavender': '#E6E6FA', 'Deep Purple': '#663399',
      'Clear': '#F0F8FF', 'Deep Blue': '#00008B', 'Blue with Gold': '#1E90FF',
      'Metallic Gray': '#C0C0C0', 'Dark Green': '#006400', 'Peach': '#FFCBA4',
      'Gray': '#808080', 'Teal': '#008080'
    };
    return colorMap[colorName] || '#9CA3AF';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl font-light text-gray-900">Birthdate Crystal Guide</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Discover crystals perfectly aligned with your zodiac sign and birth month
          </p>
        </div>
      </div>

      {/* Birth Date Form */}
      <div className="max-w-md mx-auto px-4 mb-12 -mt-8">
        <div className="celestial-card p-8">
          <div className="flex items-center justify-center mb-6">
            <Calendar className="w-8 h-8 text-gray-600 mr-3" />
            <h2 className="text-2xl font-medium text-gray-900">Enter Your Birth Date</h2>
          </div>

          <form onSubmit={handleBirthDateSubmit} className="space-y-6">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              required
            />
            <button
              type="submit"
              className="celestial-button w-full"
            >
              Find My Crystals
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {zodiacSign && recommendations.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Zodiac Info */}
          <div className="celestial-card p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Your Zodiac Sign: {zodiacSign}</h2>
              <div className="flex items-center justify-center space-x-8 text-gray-600">
                <div>
                  <span className="font-medium">Element:</span> {zodiacInfo[zodiacSign as keyof typeof zodiacInfo]?.element}
                </div>
                <div>
                  <span className="font-medium">Dates:</span> {zodiacInfo[zodiacSign as keyof typeof zodiacInfo]?.dates}
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Traits</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {zodiacInfo[zodiacSign as keyof typeof zodiacInfo]?.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm border border-gray-200"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Crystal Recommendations */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Your Recommended Crystals</h2>
            <p className="text-gray-600 text-lg">
              These crystals are specially aligned with your zodiac sign and birth month
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((crystal) => (
              <div
                key={crystal.id}
                className="celestial-card cursor-pointer h-full flex flex-col"
                onClick={() => setSelectedCrystal(crystal)}
              >
                <div className="relative h-48 bg-gray-100 flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-gray-600" />
                  </div>
                  <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 text-xs font-medium">
                    Perfect Match
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white border border-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
                    ${crystal.price}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-medium mb-2 text-gray-900">{crystal.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{crystal.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {crystal.properties.slice(0, 2).map((property, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 text-xs border border-gray-200"
                      >
                        {property}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {crystal.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: getColorHex(color) }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{crystal.chakra} Chakra</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(crystal);
                    }}
                    className="celestial-button w-full flex items-center justify-center space-x-2 mt-auto"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-12">How Crystal Matching Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Zodiac Alignment</h3>
              <p className="text-gray-600 text-sm">Each zodiac sign has specific crystals that resonate with its energy and characteristics.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Birth Month Power</h3>
              <p className="text-gray-600 text-sm">Your birth month influences which crystals will be most beneficial for your personal growth.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Resonance</h3>
              <p className="text-gray-600 text-sm">The combination creates a unique crystal profile that enhances your natural abilities.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crystal Modal */}
      {selectedCrystal && (
        <CrystalModal
          crystal={selectedCrystal}
          isOpen={!!selectedCrystal}
          onClose={() => setSelectedCrystal(null)}
          onAddToCart={(crystal) => {
            addToCart(crystal);
            setSelectedCrystal(null);
          }}
        />
      )}
    </div>
  );
}
