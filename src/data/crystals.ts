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
  rarity: string;
  image?: string;
}

export const crystalDatabase: Crystal[] = [
  {
    id: 'triple-protection-1',
    name: 'Triple Protection Bracelet - Tiger Eye, Black Obsidian & Hematite',
    description: 'A powerful combination of three protective stones. Tiger Eye provides courage and confidence, Black Obsidian shields against negativity, and Hematite grounds and stabilizes energy.',
    price: 35,
    properties: ['Protection', 'Grounding', 'Courage', 'Confidence', 'Stability'],
    colors: ['Golden', 'Black', 'Metallic Gray'],
    category: 'Protection',
    chakra: 'Root',
    zodiacSigns: ['Leo', 'Capricorn', 'Aries'],
    birthMonths: [1, 7, 8, 12],
    element: 'Earth',
    hardness: '6-7',
    origin: 'South Africa, Mexico, Brazil',
    rarity: 'Common'
  },
  {
    id: 'blue-aquamarine-1',
    name: 'Blue Aquamarine Bracelet',
    description: 'The stone of courage and communication. Aquamarine enhances clear communication, reduces stress, and promotes emotional healing and tranquility.',
    price: 45,
    properties: ['Communication', 'Courage', 'Tranquility', 'Emotional Healing', 'Clarity'],
    colors: ['Light Blue', 'Blue-Green', 'Teal'],
    category: 'Communication',
    chakra: 'Throat',
    zodiacSigns: ['Pisces', 'Aries', 'Gemini'],
    birthMonths: [2, 3, 5],
    element: 'Water',
    hardness: '7.5-8',
    origin: 'Brazil, Madagascar, Nigeria',
    rarity: 'Uncommon'
  },
  {
    id: 'lava-7-chakra-1',
    name: 'Lava 7 Chakra Bracelet',
    description: 'A powerful grounding stone combined with seven chakra stones. Lava stone provides strength and courage while the chakra stones balance all energy centers.',
    price: 28,
    properties: ['Chakra Balancing', 'Grounding', 'Strength', 'Courage', 'Energy Balance'],
    colors: ['Black', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'],
    category: 'Chakra Healing',
    chakra: 'All Chakras',
    zodiacSigns: ['Taurus', 'Cancer'],
    birthMonths: [4, 5, 6, 7],
    element: 'Fire',
    hardness: '5-6',
    origin: 'Hawaii, Iceland, Italy',
    rarity: 'Common'
  },
  {
    id: 'tiger-eye-1',
    name: 'Tiger Eye Bracelet',
    description: 'A stone of protection and good luck. Tiger Eye enhances focus, willpower, and personal strength while providing grounding and stability.',
    price: 32,
    properties: ['Protection', 'Focus', 'Willpower', 'Good Luck', 'Grounding'],
    colors: ['Golden', 'Brown', 'Yellow'],
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
    id: 'howlite-1',
    name: 'Howlite Bracelet',
    description: 'A calming stone that reduces stress and anxiety. Howlite promotes peaceful sleep, patience, and helps quiet an overactive mind.',
    price: 25,
    properties: ['Calming', 'Stress Relief', 'Patience', 'Sleep', 'Peace'],
    colors: ['White', 'Cream'],
    category: 'Spiritual Protection',
    chakra: 'Crown',
    zodiacSigns: ['Gemini', 'Virgo'],
    birthMonths: [5, 6, 8, 9],
    element: 'Air',
    hardness: '3.5',
    origin: 'Canada, USA',
    rarity: 'Common'
  },
  {
    id: 'rhodochrosite-1',
    name: 'Rhodochrosite Bracelet',
    description: 'The stone of the compassionate heart. Rhodochrosite heals emotional wounds, promotes self-love, and attracts soulmate love.',
    price: 48,
    properties: ['Self-Love', 'Emotional Healing', 'Compassion', 'Heart Healing', 'Love'],
    colors: ['Pink', 'Rose', 'Red'],
    category: 'Love',
    chakra: 'Heart',
    zodiacSigns: ['Leo', 'Scorpio'],
    birthMonths: [7, 8, 10, 11],
    element: 'Fire',
    hardness: '3.5-4',
    origin: 'Argentina, Peru, USA',
    rarity: 'Rare'
  },
  {
    id: 'citrine-1',
    name: 'Citrine Bracelet',
    description: 'The merchant stone of abundance and prosperity. Citrine attracts wealth, success, and positive energy while boosting confidence and creativity.',
    price: 38,
    properties: ['Abundance', 'Prosperity', 'Success', 'Confidence', 'Creativity'],
    colors: ['Yellow', 'Golden', 'Orange'],
    category: 'Abundance',
    chakra: 'Solar Plexus',
    zodiacSigns: ['Gemini', 'Aries', 'Leo', 'Libra'],
    birthMonths: [3, 4, 5, 7, 8, 9, 10],
    element: 'Fire',
    hardness: '7',
    origin: 'Brazil, Madagascar, Russia',
    rarity: 'Common'
  },
  {
    id: 'tree-agate-1',
    name: 'Tree Agate Bracelet',
    description: 'A stone of inner peace and connection to nature. Tree Agate promotes growth, abundance, and helps you feel centered and grounded.',
    price: 30,
    properties: ['Inner Peace', 'Growth', 'Abundance', 'Grounding', 'Nature Connection'],
    colors: ['White', 'Green'],
    category: 'Abundance',
    chakra: 'Heart',
    zodiacSigns: ['Gemini', 'Virgo'],
    birthMonths: [5, 6, 8, 9],
    element: 'Earth',
    hardness: '6.5-7',
    origin: 'India, Brazil, USA',
    rarity: 'Common'
  },
  {
    id: 'rose-amethyst-clear-quartz-1',
    name: 'Rose Amethyst Clear Quartz Bracelet',
    description: 'A harmonious blend of love, spirituality, and clarity. This combination promotes emotional healing, spiritual growth, and mental clarity.',
    price: 42,
    properties: ['Love', 'Spiritual Growth', 'Clarity', 'Emotional Healing', 'Amplification'],
    colors: ['Pink', 'Purple', 'Clear'],
    category: 'Love',
    chakra: 'Heart',
    zodiacSigns: ['Taurus', 'Libra', 'Pisces'],
    birthMonths: [2, 4, 5, 9, 10],
    element: 'Water',
    hardness: '7',
    origin: 'Brazil, Madagascar, USA',
    rarity: 'Uncommon'
  },
  {
    id: 'turquoise-1',
    name: 'Turquoise Bracelet',
    description: 'A sacred stone of protection and healing. Turquoise promotes communication, wisdom, and provides protection during travel.',
    price: 40,
    properties: ['Protection', 'Communication', 'Wisdom', 'Healing', 'Travel Protection'],
    colors: ['Turquoise', 'Blue-Green', 'Blue'],
    category: 'Communication',
    chakra: 'Throat',
    zodiacSigns: ['Sagittarius', 'Pisces', 'Aquarius'],
    birthMonths: [11, 12, 1, 2],
    element: 'Earth',
    hardness: '5-6',
    origin: 'USA, Iran, China',
    rarity: 'Uncommon'
  },
  {
    id: 'green-jade-1',
    name: 'Green Jade Bracelet',
    description: 'The stone of luck and prosperity. Green Jade attracts good fortune, promotes harmony, and brings emotional balance and stability.',
    price: 35,
    properties: ['Good Luck', 'Prosperity', 'Harmony', 'Emotional Balance', 'Stability'],
    colors: ['Green', 'Light Green', 'Dark Green'],
    category: 'Abundance',
    chakra: 'Heart',
    zodiacSigns: ['Taurus', 'Libra', 'Aries'],
    birthMonths: [3, 4, 5, 9, 10],
    element: 'Earth',
    hardness: '6-7',
    origin: 'China, Myanmar, Guatemala',
    rarity: 'Common'
  },
  {
    id: 'green-aquamarine-1',
    name: 'Green Aquamarine Bracelet',
    description: 'A rare variety of aquamarine that promotes emotional healing, compassion, and connection with nature. Enhances communication and empathy.',
    price: 50,
    properties: ['Emotional Healing', 'Compassion', 'Communication', 'Empathy', 'Nature Connection'],
    colors: ['Light Green', 'Blue-Green', 'Teal'],
    category: 'Communication',
    chakra: 'Heart',
    zodiacSigns: ['Pisces', 'Gemini', 'Virgo'],
    birthMonths: [2, 3, 5, 6, 8, 9],
    element: 'Water',
    hardness: '7.5-8',
    origin: 'Brazil, Madagascar, Pakistan',
    rarity: 'Rare'
  },
  {
    id: 'moonstone-1',
    name: 'Moonstone Bracelet',
    description: 'The stone of new beginnings and intuition. Moonstone enhances psychic abilities, promotes emotional balance, and connects you to lunar energy.',
    price: 36,
    properties: ['Intuition', 'New Beginnings', 'Emotional Balance', 'Psychic Abilities', 'Lunar Energy'],
    colors: ['White', 'Cream', 'Peach', 'Gray'],
    category: 'Spiritual Protection',
    chakra: 'Crown',
    zodiacSigns: ['Cancer', 'Libra', 'Scorpio'],
    birthMonths: [6, 7, 9, 10, 11],
    element: 'Water',
    hardness: '6-6.5',
    origin: 'India, Sri Lanka, Madagascar',
    rarity: 'Common'
  },
  {
    id: 'blue-apatite-1',
    name: 'Blue Apatite Bracelet',
    description: 'A stone of manifestation and communication. Blue Apatite enhances psychic abilities, promotes clear communication, and aids in achieving goals.',
    price: 44,
    properties: ['Manifestation', 'Communication', 'Psychic Abilities', 'Goal Achievement', 'Clarity'],
    colors: ['Blue', 'Deep Blue', 'Light Blue'],
    category: 'Communication',
    chakra: 'Throat',
    zodiacSigns: ['Gemini', 'Pisces'],
    birthMonths: [2, 3, 5, 6],
    element: 'Air',
    hardness: '5',
    origin: 'Madagascar, Brazil, Mexico',
    rarity: 'Uncommon'
  },
  {
    id: 'rose-quartz-1',
    name: 'Rose Quartz Bracelet',
    description: 'The ultimate stone of unconditional love. Rose Quartz opens the heart chakra, promotes self-love, and attracts loving relationships.',
    price: 32,
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
    id: 'lapis-lazuli-1',
    name: 'Lapis Lazuli Bracelet',
    description: 'The stone of truth and wisdom. Lapis Lazuli enhances intellectual ability, stimulates desire for knowledge, and promotes honest communication.',
    price: 46,
    properties: ['Truth', 'Wisdom', 'Communication', 'Knowledge', 'Intellectual Ability'],
    colors: ['Deep Blue', 'Blue with Gold'],
    category: 'Communication',
    chakra: 'Throat',
    zodiacSigns: ['Sagittarius', 'Libra'],
    birthMonths: [9, 10, 11, 12],
    element: 'Air',
    hardness: '5-5.5',
    origin: 'Afghanistan, Chile, Russia',
    rarity: 'Uncommon'
  },
  {
    id: 'selenite-1',
    name: 'Selenite Bracelet',
    description: 'A high-vibration stone of purification and spiritual connection. Selenite cleanses energy, promotes mental clarity, and connects you to higher realms.',
    price: 38,
    properties: ['Purification', 'Mental Clarity', 'Spiritual Connection', 'Energy Cleansing', 'High Vibration'],
    colors: ['White', 'Clear'],
    category: 'Spiritual Protection',
    chakra: 'Crown',
    zodiacSigns: ['Taurus', 'Cancer'],
    birthMonths: [4, 5, 6, 7],
    element: 'Air',
    hardness: '2',
    origin: 'Morocco, Mexico, USA',
    rarity: 'Common'
  },
  {
    id: 'magnetic-1',
    name: 'Magnetic Bracelet',
    description: 'A therapeutic bracelet with magnetic properties. Promotes circulation, reduces inflammation, and provides natural pain relief while balancing energy.',
    price: 28,
    properties: ['Pain Relief', 'Circulation', 'Energy Balance', 'Healing', 'Therapeutic'],
    colors: ['Metallic Gray', 'Black'],
    category: 'Protection',
    chakra: 'Root',
    zodiacSigns: ['Capricorn', 'Virgo'],
    birthMonths: [8, 9, 12, 1],
    element: 'Earth',
    hardness: '5-6',
    origin: 'China, USA',
    rarity: 'Common'
  },
  {
    id: 'money-magnet-1',
    name: 'Money Magnet Bracelet',
    description: 'A powerful combination of abundance stones designed to attract wealth and prosperity. Features Citrine, Pyrite, and Green Aventurine for maximum manifestation.',
    price: 42,
    properties: ['Wealth Attraction', 'Prosperity', 'Abundance', 'Success', 'Manifestation'],
    colors: ['Golden', 'Green', 'Yellow'],
    category: 'Abundance',
    chakra: 'Solar Plexus',
    zodiacSigns: ['Leo', 'Aries', 'Gemini'],
    birthMonths: [3, 4, 5, 7, 8],
    element: 'Earth',
    hardness: '6-7',
    origin: 'Brazil, India, Peru',
    rarity: 'Uncommon'
  },
  {
    id: 'amethyst-1',
    name: 'Amethyst Bracelet',
    description: 'A powerful stone of spiritual protection and purification. Amethyst enhances intuition, promotes clarity of mind, and helps overcome negative patterns.',
    price: 34,
    properties: ['Spiritual Protection', 'Intuition', 'Clarity', 'Purification', 'Calm'],
    colors: ['Purple', 'Violet', 'Deep Purple'],
    category: 'Spiritual Protection',
    chakra: 'Crown',
    zodiacSigns: ['Pisces', 'Virgo', 'Aquarius', 'Capricorn'],
    birthMonths: [2, 6, 8, 12],
    element: 'Air',
    hardness: '7',
    origin: 'Brazil, Uruguay, Zambia',
    rarity: 'Common'
  },
  {
    id: 'dalmatian-jasper-1',
    name: 'Dalmatian Jasper Bracelet',
    description: 'A playful stone that brings joy and positivity. Dalmatian Jasper helps overcome depression, brings out your inner child, and promotes loyalty and friendship.',
    price: 26,
    properties: ['Joy', 'Positivity', 'Friendship', 'Loyalty', 'Inner Child'],
    colors: ['White', 'Black', 'Cream'],
    category: 'Protection',
    chakra: 'Root',
    zodiacSigns: ['Gemini', 'Virgo'],
    birthMonths: [5, 6, 8, 9],
    element: 'Earth',
    hardness: '6.5-7',
    origin: 'Mexico, India, Brazil',
    rarity: 'Common'
  }
];

// Helper functions for crystal recommendations
export function getZodiacSign(birthDate: Date): string {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  
  return 'Aries';
}

export function getRecommendedCrystals(birthDate: Date): Crystal[] {
  const zodiacSign = getZodiacSign(birthDate);
  const birthMonth = birthDate.getMonth() + 1;
  
  return crystalDatabase
    .filter(crystal => 
      crystal.zodiacSigns.includes(zodiacSign) || 
      crystal.birthMonths.includes(birthMonth)
    )
    .slice(0, 6);
}
