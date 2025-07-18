export interface Crystal {
  id: string;
  name: string;
  description: string;
  price: number;
  properties: string[];
  colors: string[];
  category: string;
  chakra: string;
  zodiacSigns: string[];
  birthMonths: number[];
  element: string;
  hardness: string;
  origin: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';
  image?: string;
}

export const crystalDatabase: Crystal[] = [
  {
    id: 'tiger-eye-1',
    name: 'Tiger Eye Bracelet',
    description: 'A powerful stone of protection and grounding, Tiger Eye helps you stay centered and calm while making important decisions. Known for its golden-brown bands that shimmer like a tiger\'s eye.',
    price: 35,
    properties: ['Protection', 'Grounding', 'Confidence', 'Mental Clarity', 'Courage'],
    colors: ['Golden', 'Brown', 'Black'],
    category: 'Protection',
    chakra: 'Solar Plexus',
    zodiacSigns: ['Leo', 'Capricorn'],
    birthMonths: [7, 8, 12, 1],
    element: 'Earth',
    hardness: '7',
    origin: 'South Africa, Australia',
    rarity: 'Common'
  },
  {
    id: 'amethyst-1',
    name: 'Amethyst Bracelet',
    description: 'The stone of spiritual wisdom and tranquility. Amethyst promotes inner peace, enhances intuition, and provides protection against negative energies.',
    price: 42,
    properties: ['Spiritual Protection', 'Intuition', 'Peace', 'Healing', 'Meditation'],
    colors: ['Purple', 'Lavender', 'Deep Purple'],
    category: 'Spiritual Protection',
    chakra: 'Crown',
    zodiacSigns: ['Pisces', 'Virgo', 'Aquarius', 'Capricorn'],
    birthMonths: [2, 6, 11, 12],
    element: 'Air',
    hardness: '7',
    origin: 'Brazil, Uruguay, Zambia',
    rarity: 'Common'
  },
  {
    id: 'rose-quartz-1',
    name: 'Rose Quartz Bracelet',
    description: 'The ultimate stone of unconditional love. Rose Quartz opens the heart chakra, promotes self-love, and attracts loving relationships into your life.',
    price: 38,
    properties: ['Love', 'Self-Love', 'Emotional Healing', 'Compassion', 'Heart Opening'],
    colors: ['Pink', 'Rose', 'Peach'],
    category: 'Love',
    chakra: 'Heart',
    zodiacSigns: ['Taurus', 'Libra'],
    birthMonths: [4, 5, 9, 10],
    element: 'Water',
    hardness: '7',
    origin: 'Brazil, Madagascar, India',
    rarity: 'Common'
  },
  {
    id: 'black-tourmaline-1',
    name: 'Black Tourmaline Bracelet',
    description: 'A powerful protective stone that shields against negative energies and electromagnetic radiation. Excellent for grounding and creating energetic boundaries.',
    price: 45,
    properties: ['Protection', 'Grounding', 'EMF Protection', 'Purification', 'Stress Relief'],
    colors: ['Black', 'Dark Gray'],
    category: 'Protection',
    chakra: 'Root',
    zodiacSigns: ['Scorpio', 'Capricorn'],
    birthMonths: [10, 11, 12, 1],
    element: 'Earth',
    hardness: '7-7.5',
    origin: 'Brazil, Afghanistan, USA',
    rarity: 'Common'
  },
  {
    id: 'citrine-1',
    name: 'Citrine Bracelet',
    description: 'Known as the "Merchant\'s Stone," Citrine attracts abundance, prosperity, and success. It energizes and motivates while promoting optimism and joy.',
    price: 48,
    properties: ['Abundance', 'Prosperity', 'Success', 'Motivation', 'Joy'],
    colors: ['Yellow', 'Golden', 'Orange'],
    category: 'Abundance',
    chakra: 'Solar Plexus',
    zodiacSigns: ['Gemini', 'Aries', 'Leo', 'Libra'],
    birthMonths: [3, 4, 5, 6, 7, 9, 10],
    element: 'Fire',
    hardness: '7',
    origin: 'Brazil, Bolivia, Spain',
    rarity: 'Uncommon'
  },
  {
    id: 'clear-quartz-1',
    name: 'Clear Quartz Bracelet',
    description: 'The "Master Healer" that amplifies energy and intention. Clear Quartz enhances clarity of thought, spiritual growth, and can be programmed for any purpose.',
    price: 32,
    properties: ['Amplification', 'Clarity', 'Healing', 'Purification', 'Spiritual Growth'],
    colors: ['Clear', 'White'],
    category: 'Chakra Healing',
    chakra: 'Crown',
    zodiacSigns: ['All Signs'],
    birthMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    element: 'All Elements',
    hardness: '7',
    origin: 'Brazil, Arkansas, Madagascar',
    rarity: 'Common'
  },
  {
    id: 'lapis-lazuli-1',
    name: 'Lapis Lazuli Bracelet',
    description: 'The stone of wisdom and truth. Lapis Lazuli enhances intellectual ability, stimulates the desire for knowledge, and aids in communication.',
    price: 52,
    properties: ['Wisdom', 'Truth', 'Communication', 'Intellectual Ability', 'Inner Vision'],
    colors: ['Deep Blue', 'Blue with Gold'],
    category: 'Communication',
    chakra: 'Throat',
    zodiacSigns: ['Sagittarius', 'Libra'],
    birthMonths: [9, 10, 11, 12],
    element: 'Water',
    hardness: '5-6',
    origin: 'Afghanistan, Chile, Russia',
    rarity: 'Uncommon'
  },
  {
    id: 'green-aventurine-1',
    name: 'Green Aventurine Bracelet',
    description: 'Known as the "Stone of Opportunity," Green Aventurine is thought to be the luckiest of all crystals. It promotes optimism, confidence, and attracts prosperity.',
    price: 36,
    properties: ['Luck', 'Opportunity', 'Prosperity', 'Optimism', 'Leadership'],
    colors: ['Green', 'Light Green'],
    category: 'Abundance',
    chakra: 'Heart',
    zodiacSigns: ['Aries', 'Leo'],
    birthMonths: [3, 4, 7, 8],
    element: 'Earth',
    hardness: '7',
    origin: 'India, Chile, Spain',
    rarity: 'Common'
  },
  {
    id: 'moonstone-1',
    name: 'Moonstone Bracelet',
    description: 'A stone of new beginnings and inner growth. Moonstone enhances intuition, promotes inspiration, and brings success in love and business.',
    price: 55,
    properties: ['Intuition', 'New Beginnings', 'Inner Growth', 'Feminine Energy', 'Emotional Balance'],
    colors: ['Cream', 'White', 'Peach', 'Gray'],
    category: 'Spiritual Protection',
    chakra: 'Crown',
    zodiacSigns: ['Cancer', 'Libra', 'Scorpio'],
    birthMonths: [6, 7, 9, 10, 11],
    element: 'Water',
    hardness: '6-6.5',
    origin: 'Sri Lanka, India, Madagascar',
    rarity: 'Uncommon'
  },
  {
    id: 'hematite-1',
    name: 'Hematite Bracelet',
    description: 'A powerful grounding stone that helps you stay connected to the Earth. Hematite absorbs negative energy and calms in times of stress or worry.',
    price: 28,
    properties: ['Grounding', 'Protection', 'Focus', 'Courage', 'Strength'],
    colors: ['Metallic Gray', 'Black'],
    category: 'Protection',
    chakra: 'Root',
    zodiacSigns: ['Aries', 'Aquarius'],
    birthMonths: [1, 2, 3, 4],
    element: 'Earth',
    hardness: '5-6',
    origin: 'Brazil, Venezuela, Canada',
    rarity: 'Common'
  },
  {
    id: 'sodalite-1',
    name: 'Sodalite Bracelet',
    description: 'The stone of logic and truth. Sodalite enhances rational thought, objectivity, and intuition. It calms the mind and eases mental confusion.',
    price: 40,
    properties: ['Logic', 'Truth', 'Rational Thought', 'Communication', 'Mental Clarity'],
    colors: ['Blue', 'Deep Blue', 'White'],
    category: 'Communication',
    chakra: 'Throat',
    zodiacSigns: ['Sagittarius'],
    birthMonths: [11, 12],
    element: 'Water',
    hardness: '5.5-6',
    origin: 'Brazil, Canada, India',
    rarity: 'Common'
  },
  {
    id: 'carnelian-1',
    name: 'Carnelian Bracelet',
    description: 'A stone of motivation and endurance. Carnelian stimulates creativity, gives courage, and promotes positive life choices.',
    price: 34,
    properties: ['Motivation', 'Creativity', 'Courage', 'Vitality', 'Confidence'],
    colors: ['Orange', 'Red', 'Brown'],
    category: 'Abundance',
    chakra: 'Sacral',
    zodiacSigns: ['Taurus', 'Cancer', 'Leo', 'Virgo'],
    birthMonths: [4, 5, 6, 7, 8, 9],
    element: 'Fire',
    hardness: '7',
    origin: 'Brazil, India, Uruguay',
    rarity: 'Common'
  },
  {
    id: 'labradorite-1',
    name: 'Labradorite Bracelet',
    description: 'A stone of transformation and magic. Labradorite awakens mystical abilities, enhances intuition, and provides protection during spiritual work.',
    price: 58,
    properties: ['Transformation', 'Magic', 'Intuition', 'Protection', 'Spiritual Awakening'],
    colors: ['Gray', 'Blue-Green', 'Teal'],
    category: 'Spiritual Protection',
    chakra: 'Third Eye',
    zodiacSigns: ['Leo', 'Scorpio', 'Sagittarius'],
    birthMonths: [7, 8, 10, 11, 12],
    element: 'Water',
    hardness: '6-6.5',
    origin: 'Madagascar, Finland, Canada',
    rarity: 'Rare'
  },
  {
    id: 'morganite-1',
    name: 'Morganite Bracelet',
    description: 'The stone of divine love and emotional healing. Morganite opens the heart to unconditional love and helps heal emotional trauma.',
    price: 65,
    properties: ['Divine Love', 'Emotional Healing', 'Compassion', 'Heart Opening', 'Peace'],
    colors: ['Peach', 'Pink', 'Rose'],
    category: 'Love',
    chakra: 'Heart',
    zodiacSigns: ['Libra', 'Taurus', 'Cancer'],
    birthMonths: [4, 5, 6, 7, 9, 10],
    element: 'Water',
    hardness: '7.5-8',
    origin: 'Brazil, Madagascar, Afghanistan',
    rarity: 'Uncommon'
  },
  {
    id: 'prehnite-1',
    name: 'Prehnite Bracelet',
    description: 'A stone of unconditional love and healing. Prehnite connects you to universal love and helps you love yourself and others without conditions.',
    price: 44,
    properties: ['Unconditional Love', 'Healing', 'Inner Peace', 'Spiritual Growth', 'Forgiveness'],
    colors: ['Light Green', 'Yellow-Green'],
    category: 'Love',
    chakra: 'Heart',
    zodiacSigns: ['Libra', 'Virgo'],
    birthMonths: [8, 9, 10],
    element: 'Earth',
    hardness: '6-6.5',
    origin: 'Australia, China, South Africa',
    rarity: 'Common'
  },
  {
    id: 'pyrite-1',
    name: 'Pyrite Bracelet',
    description: 'Known as "Fool\'s Gold," Pyrite is a powerful stone of manifestation and abundance. It attracts wealth, prosperity, and good luck.',
    price: 39,
    properties: ['Manifestation', 'Abundance', 'Prosperity', 'Confidence', 'Willpower'],
    colors: ['Golden', 'Metallic Gold'],
    category: 'Abundance',
    chakra: 'Solar Plexus',
    zodiacSigns: ['Leo', 'Virgo'],
    birthMonths: [7, 8, 9],
    element: 'Earth',
    hardness: '6-6.5',
    origin: 'Peru, Spain, Italy',
    rarity: 'Common'
  },
  {
    id: 'malachite-1',
    name: 'Malachite Bracelet',
    description: 'A powerful stone of transformation and protection. Malachite absorbs negative energies and helps you break through emotional blockages.',
    price: 52,
    properties: ['Transformation', 'Protection', 'Emotional Healing', 'Growth', 'Change'],
    colors: ['Green', 'Dark Green'],
    category: 'Protection',
    chakra: 'Heart',
    zodiacSigns: ['Scorpio', 'Capricorn'],
    birthMonths: [10, 11, 12, 1],
    element: 'Earth',
    hardness: '3.5-4',
    origin: 'Congo, Russia, Australia',
    rarity: 'Uncommon'
  }
];

// Zodiac sign mappings for birth date recommendations
const zodiacSigns = {
  'Aries': { start: [3, 21], end: [4, 19] },
  'Taurus': { start: [4, 20], end: [5, 20] },
  'Gemini': { start: [5, 21], end: [6, 20] },
  'Cancer': { start: [6, 21], end: [7, 22] },
  'Leo': { start: [7, 23], end: [8, 22] },
  'Virgo': { start: [8, 23], end: [9, 22] },
  'Libra': { start: [9, 23], end: [10, 22] },
  'Scorpio': { start: [10, 23], end: [11, 21] },
  'Sagittarius': { start: [11, 22], end: [12, 21] },
  'Capricorn': { start: [12, 22], end: [1, 19] },
  'Aquarius': { start: [1, 20], end: [2, 18] },
  'Pisces': { start: [2, 19], end: [3, 20] }
};

export function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const [sign, dates] of Object.entries(zodiacSigns)) {
    const { start, end } = dates;

    if (start[0] === end[0]) {
      // Same month
      if (month === start[0] && day >= start[1] && day <= end[1]) {
        return sign;
      }
    } else {
      // Spans two months
      if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) {
        return sign;
      }
    }
  }

  return 'Unknown';
}

export function getRecommendedCrystals(birthDate: Date): Crystal[] {
  const zodiacSign = getZodiacSign(birthDate);
  const birthMonth = birthDate.getMonth() + 1;

  // Filter crystals based on zodiac sign and birth month
  const recommendations = crystalDatabase.filter(crystal => {
    const matchesZodiac = crystal.zodiacSigns.includes(zodiacSign) || crystal.zodiacSigns.includes('All Signs');
    const matchesBirthMonth = crystal.birthMonths.includes(birthMonth);

    return matchesZodiac || matchesBirthMonth;
  });

  // If no specific matches, return some popular crystals
  if (recommendations.length === 0) {
    return crystalDatabase.slice(0, 3);
  }

  // Sort by relevance (zodiac match first, then birth month)
  return recommendations.sort((a, b) => {
    const aZodiacMatch = a.zodiacSigns.includes(zodiacSign) ? 1 : 0;
    const bZodiacMatch = b.zodiacSigns.includes(zodiacSign) ? 1 : 0;

    if (aZodiacMatch !== bZodiacMatch) {
      return bZodiacMatch - aZodiacMatch;
    }

    const aBirthMatch = a.birthMonths.includes(birthMonth) ? 1 : 0;
    const bBirthMatch = b.birthMonths.includes(birthMonth) ? 1 : 0;

    return bBirthMatch - aBirthMatch;
  }).slice(0, 6);
}
