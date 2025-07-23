'use client';

import { useState } from 'react';
import { getRecommendedCrystals, getZodiacSign, Crystal } from '@/data/crystals';
import { getCrystalGlowClass } from '@/utils/crystal-glow';
import { Calendar, Star, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CrystalModal from '@/components/CrystalModal';
import { useTheme } from '@/contexts/ThemeContext';

export default function BirthdateGuidePage() {
  const [birthDate, setBirthDate] = useState('');
  const [recommendations, setRecommendations] = useState<Crystal[]>([]);
  const [zodiacSign, setZodiacSign] = useState('');
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  const handleBirthDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthDate) {
      const date = new Date(birthDate);
      console.log('Birth date:', date);
      console.log('Birth month:', date.getMonth() + 1);

      const recommended = getRecommendedCrystals(date);
      const sign = getZodiacSign(date);

      console.log('Zodiac sign:', sign);
      console.log('Recommendations:', recommended);
      console.log('Number of recommendations:', recommended.length);

      setRecommendations(recommended);
      setZodiacSign(sign);
    }
  };

  // Test function for debugging
  const testRecommendations = () => {
    const testDate = new Date('1990-07-15'); // Leo, July
    console.log('=== TEST ===');
    console.log('Test date:', testDate);
    console.log('Test month:', testDate.getMonth() + 1);

    const testSign = getZodiacSign(testDate);
    const testRecs = getRecommendedCrystals(testDate);

    console.log('Test zodiac:', testSign);
    console.log('Test recommendations:', testRecs);
    console.log('Test count:', testRecs.length);

    setRecommendations(testRecs);
    setZodiacSign(testSign);
    setBirthDate('1990-07-15');
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
    <div className={`min-h-screen relative ${isDark
      ? 'bg-gray-950'
      : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
      {/* Glass blur background overlay */}
      <div className={`fixed inset-0 backdrop-blur-sm -z-10 ${isDark
        ? 'bg-gray-950/30'
        : 'bg-white/30'
        }`}></div>

      {/* Header */}
      <div className={`py-16 backdrop-blur-md border-b ${isDark
        ? 'bg-gray-900/20 border-gray-700/20'
        : 'bg-white/20 border-white/20'
        }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <h1 className={`text-4xl font-light ${isDark ? 'text-white' : 'text-black'}`}>Birthdate Crystal Guide</h1>
          </div>
          <p className={`text-xl mb-8 ${isDark ? 'text-white' : 'text-black'}`}>
            Discover crystals perfectly aligned with your zodiac sign and birth month
          </p>
        </div>
      </div>

      {/* Birth Date Form */}
      <div className="max-w-md mx-auto px-4 mb-12 -mt-8">
        <div className={`backdrop-blur-lg border rounded-2xl shadow-xl p-8 ${isDark
          ? 'bg-gray-900/40 border-gray-700/30'
          : 'bg-white/40 border-white/30'
          }`}>
          <div className="flex items-center justify-center mb-6">
            <Calendar className={`w-8 h-8 mr-3 ${isDark ? 'text-white' : 'text-gray-600'}`} />
            <h2 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-black'}`}>Enter Your Birth Date</h2>
          </div>

          <form onSubmit={handleBirthDateSubmit} className="space-y-6">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`w-full px-4 py-3 border focus:outline-none focus:ring-1 ${isDark
                ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                : 'border-gray-300 text-gray-900 focus:ring-gray-400 focus:border-gray-400'
                }`}
              required
            />
            <button
              type="submit"
              className={`w-full py-3 px-6 font-medium transition-all duration-200 text-sm uppercase tracking-wide ${
                isDark 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              Find My Crystals
            </button>

            <button
              type="button"
              onClick={testRecommendations}
              className="w-full bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
            >
              Test with July 15, 1990 (Leo)
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {zodiacSign && recommendations.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Zodiac Info */}
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-black mb-4">Your Zodiac Sign: {zodiacSign}</h2>
              <div className="flex items-center justify-center space-x-8 text-black">
                <div>
                  <span className="font-medium">Element:</span> {zodiacInfo[zodiacSign as keyof typeof zodiacInfo]?.element}
                </div>
                <div>
                  <span className="font-medium">Dates:</span> {zodiacInfo[zodiacSign as keyof typeof zodiacInfo]?.dates}
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-medium text-black mb-4">Key Traits</h3>
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
            <h2 className="text-3xl font-light text-black mb-4">Your Recommended Crystals</h2>
            <p className="text-black text-lg">
              These crystals are specially aligned with your zodiac sign ({zodiacSign}) and birth month
            </p>
            {recommendations.length === 0 && (
              <p className="text-red-600 mt-4">
                No specific recommendations found. Please try again or contact support.
              </p>
            )}
          </div>

          {recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((crystal) => (
                <div
                  key={crystal.id}
                  className={`bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl cursor-pointer h-full flex flex-col hover:bg-white/50 transition-all duration-300 ${getCrystalGlowClass(crystal.colors)}`}
                  onClick={() => setSelectedCrystal(crystal)}
                >
                  <div className="relative aspect-[3/2] bg-gray-100 flex-shrink-0">
                    {crystal.image ? (
                      <img
                        src={crystal.image}
                        alt={crystal.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {/* Fallback placeholder */}
                    <div className={`absolute inset-0 flex items-center justify-center ${crystal.image ? 'hidden' : ''}`}>
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
                    <h3 className="text-xl font-medium mb-2 text-black">{crystal.name}</h3>
                    <p className="text-black text-sm mb-4 line-clamp-2 flex-grow">{crystal.description}</p>

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
                      <span className="text-sm text-black">{crystal.chakra} Chakra</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          ...crystal,
                          rarity:
                            crystal.rarity === 'Common' ? 'Common' :
                              crystal.rarity === 'Uncommon' ? 'Uncommon' :
                                crystal.rarity === 'Rare' ? 'Rare' :
                                  crystal.rarity === 'Very Rare' ? 'Very Rare' :
                                    'Common'
                        });
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
          )}
        </div>
      )}

      {/* How It Works Section */}
      <div className={`backdrop-blur-md py-16 mt-16 border-t ${isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/20 border-white/20'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl font-light mb-12 ${isDark ? 'text-white' : 'text-black'}`}>How Crystal Matching Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`w-16 h-16 backdrop-blur-lg border rounded-xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-800/60 border-gray-600' : 'bg-white/40 border-white/30'}`}>
                <Star className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-gray-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Zodiac Alignment</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>Each zodiac sign has specific crystals that resonate with its energy and characteristics.</p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 backdrop-blur-lg border rounded-xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-800/60 border-gray-600' : 'bg-white/40 border-white/30'}`}>
                <Calendar className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-gray-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Birth Month Power</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>Your birth month influences which crystals will be most beneficial for your personal growth.</p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 backdrop-blur-lg border rounded-xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-800/60 border-gray-600' : 'bg-white/40 border-white/30'}`}>
                <Sparkles className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-gray-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Personal Resonance</h3>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>The combination creates a unique crystal profile that enhances your natural abilities.</p>
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
            addToCart({
              ...crystal,
              rarity:
                crystal.rarity === 'Common' ? 'Common' :
                  crystal.rarity === 'Uncommon' ? 'Uncommon' :
                    crystal.rarity === 'Rare' ? 'Rare' :
                      crystal.rarity === 'Very Rare' ? 'Very Rare' :
                        'Common'
            });
            setSelectedCrystal(null);
          }}
        />
      )}
    </div>
  );
}
