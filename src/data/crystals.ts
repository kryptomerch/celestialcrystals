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
  images?: string[];
  // Optional detailed information for special crystals like Lava 7 Chakra
  chakraStones?: {
    [chakraName: string]: {
      stone: string;
      color: string;
      properties: string[];
      benefits: string;
    };
  };
  lavaStoneProperties?: {
    origin: string;
    properties: string[];
    benefits: string;
    aromatherapy?: string;
  };
}

export const crystalDatabase: Crystal[] = [
  {
    id: 'triple-protection-1',
    name: 'Triple Protection Bracelet - Tiger Eye, Black Obsidian & Hematite',
    description: 'A powerful combination of three protective stones. Tiger Eye provides courage and confidence, Black Obsidian shields against negativity, and Hematite grounds and stabilizes energy.',
    price: 35,
    image: '/images/TRIPLE PROTECTION /TP1.png',
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
    rarity: 'Uncommon',
    image: '/images/crystals/AQUAMARINE/AQ1.png',
    images: [
      '/images/crystals/AQUAMARINE/AQ1.png',
      '/images/crystals/AQUAMARINE/AQ2.png',
      '/images/crystals/AQUAMARINE/AQ3.png',
      '/images/crystals/AQUAMARINE/AQ4.png',
      '/images/crystals/AQUAMARINE/AQ5.png'
    ]
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
    rarity: 'Common',
    image: '/images/crystals/7 CHAKRA/LV1.png',
    images: [
      '/images/crystals/7 CHAKRA/LV1.png',
      '/images/crystals/7 CHAKRA/LV2.png',
      '/images/crystals/7 CHAKRA/LV3.png',
      '/images/crystals/7 CHAKRA/LV4.png',
      '/images/crystals/7 CHAKRA/LV5.png'
    ],
    // Detailed information about the 7 chakra stones
    chakraStones: {
      'Root Chakra': {
        stone: 'Red Jasper',
        color: 'Red',
        properties: ['Grounding', 'Stability', 'Courage', 'Strength'],
        benefits: 'Provides grounding energy, enhances physical strength, and promotes feelings of safety and security.'
      },
      'Sacral Chakra': {
        stone: 'Carnelian',
        color: 'Orange',
        properties: ['Creativity', 'Passion', 'Confidence', 'Vitality'],
        benefits: 'Stimulates creativity, enhances passion, boosts confidence, and supports reproductive health.'
      },
      'Solar Plexus Chakra': {
        stone: 'Yellow Aventurine',
        color: 'Yellow',
        properties: ['Personal Power', 'Confidence', 'Manifestation', 'Willpower'],
        benefits: 'Enhances personal power, boosts self-confidence, aids in manifestation, and strengthens willpower.'
      },
      'Heart Chakra': {
        stone: 'Green Aventurine',
        color: 'Green',
        properties: ['Love', 'Compassion', 'Emotional Healing', 'Heart Opening'],
        benefits: 'Opens the heart to love, promotes emotional healing, enhances compassion, and attracts prosperity.'
      },
      'Throat Chakra': {
        stone: 'Sodalite',
        color: 'Blue',
        properties: ['Communication', 'Truth', 'Expression', 'Clarity'],
        benefits: 'Enhances communication skills, promotes truthful expression, and brings mental clarity.'
      },
      'Third Eye Chakra': {
        stone: 'Amethyst',
        color: 'Indigo/Purple',
        properties: ['Intuition', 'Spiritual Awareness', 'Psychic Abilities', 'Wisdom'],
        benefits: 'Enhances intuition, promotes spiritual awareness, develops psychic abilities, and brings inner wisdom.'
      },
      'Crown Chakra': {
        stone: 'Clear Quartz',
        color: 'Violet/Clear',
        properties: ['Spiritual Connection', 'Divine Wisdom', 'Enlightenment', 'Amplification'],
        benefits: 'Connects to divine wisdom, promotes spiritual enlightenment, and amplifies the energy of other stones.'
      }
    },
    lavaStoneProperties: {
      origin: 'Volcanic rock formed from cooled lava',
      properties: ['Grounding', 'Strength', 'Courage', 'Stability', 'Rebirth'],
      benefits: 'Provides grounding energy, enhances emotional strength, promotes courage during difficult times, and supports personal transformation.',
      aromatherapy: 'Porous surface can hold essential oils for aromatherapy benefits'
    }
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
    rarity: 'Common',
    image: '/images/crystals/TIGER EYE/TG1.png',
    images: [
      '/images/crystals/TIGER EYE/TG1.png',
      '/images/crystals/TIGER EYE/TG2.png',
      '/images/crystals/TIGER EYE/TG3.png',
      '/images/crystals/TIGER EYE/TG4.png',
      '/images/crystals/TIGER EYE/TG5.png'
    ]
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
    rarity: 'Common',
    image: '/images/crystals/HOWLITE/HW1.png',
    images: [
      '/images/crystals/HOWLITE/HW1.png',
      '/images/crystals/HOWLITE/HW2.png',
      '/images/crystals/HOWLITE/HW3.png',
      '/images/crystals/HOWLITE/HW4.png',
      '/images/crystals/HOWLITE/HW5.png'
    ]
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
    rarity: 'Rare',
    image: '/images/crystals/RHODOCHROSITE/RW1.png',
    images: [
      '/images/crystals/RHODOCHROSITE/RW1.png',
      '/images/crystals/RHODOCHROSITE/RW2.png',
      '/images/crystals/RHODOCHROSITE/RW3.png',
      '/images/crystals/RHODOCHROSITE/RW4.png',
      '/images/crystals/RHODOCHROSITE/RW5.png'
    ]
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
    rarity: 'Common',
    image: '/images/crystals/CITRINE/CI1.png',
    images: [
      '/images/crystals/CITRINE/CI1.png',
      '/images/crystals/CITRINE/CI2.png',
      '/images/crystals/CITRINE/CI3.png',
      '/images/crystals/CITRINE/CI4.png'
    ]
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
    rarity: 'Common',
    image: '/images/crystals/TREE AGATE/TG1.png',
    images: [
      '/images/crystals/TREE AGATE/TG1.png',
      '/images/crystals/TREE AGATE/TG2.png',
      '/images/crystals/TREE AGATE/TG3.png',
      '/images/crystals/TREE AGATE/TG4.png',
      '/images/crystals/TREE AGATE/TG5.png'
    ]
  },
  {
    id: 'rose-amethyst-clear-quartz-1',
    name: 'Rose Amethyst Clear Quartz Bracelet',
    description: 'A harmonious blend of love, spirituality, and clarity. This combination promotes emotional healing, spiritual growth, and mental clarity.',
    price: 42,
    image: '/images/ROSE AMETHYST CLEAR/RA1.png',
    properties: ['Love', 'Spiritual Growth', 'Clarity', 'Emotional Healing', 'Amplification'],
    colors: ['Pink', 'Purple', 'Clear'],
    category: 'Love',
    chakra: 'Heart',
    zodiacSigns: ['Taurus', 'Cancer', 'Pisces'],
    birthMonths: [2, 4, 5, 6, 7],
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
    rarity: 'Uncommon',
    image: '/images/crystals/TURQUOISE/TU1.png',
    images: [
      '/images/crystals/TURQUOISE/TU1.png',
      '/images/crystals/TURQUOISE/TU2.png',
      '/images/crystals/TURQUOISE/TU3.png',
      '/images/crystals/TURQUOISE/TU4.png',
      '/images/crystals/TURQUOISE/TU5.png'
    ]
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
    rarity: 'Common',
    image: '/images/crystals/GREEN JADE/GJ1.png',
    images: [
      '/images/crystals/GREEN JADE/GJ1.png',
      '/images/crystals/GREEN JADE/GJ2.png',
      '/images/crystals/GREEN JADE/GJ3.png',
      '/images/crystals/GREEN JADE/GJ4.png',
      '/images/crystals/GREEN JADE/GJ5.png'
    ]
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
    rarity: 'Rare',
    image: '/images/crystals/GREEN AQUAMARINE/GW1.png',
    images: [
      '/images/crystals/GREEN AQUAMARINE/GW1.png',
      '/images/crystals/GREEN AQUAMARINE/GW2.png',
      '/images/crystals/GREEN AQUAMARINE/GW3.png',
      '/images/crystals/GREEN AQUAMARINE/GW4.png',
      '/images/crystals/GREEN AQUAMARINE/GW5.png'
    ]
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
    rarity: 'Common',
    image: '/images/crystals/MOONSTONE/MO1.png',
    images: [
      '/images/crystals/MOONSTONE/MO1.png',
      '/images/crystals/MOONSTONE/MO2.png',
      '/images/crystals/MOONSTONE/MO3.png',
      '/images/crystals/MOONSTONE/MO4.png',
      '/images/crystals/MOONSTONE/MO5.png'
    ]
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
    element: 'Water',
    hardness: '5',
    origin: 'Madagascar, Brazil, Mexico',
    rarity: 'Uncommon',
    image: '/images/crystals/BLUE APATITE/BA1.png',
    images: [
      '/images/crystals/BLUE APATITE/BA1.png',
      '/images/crystals/BLUE APATITE/BA2.png',
      '/images/crystals/BLUE APATITE/BA3.png',
      '/images/crystals/BLUE APATITE/BA4.png',
      '/images/crystals/BLUE APATITE/BA5.png'
    ]
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
    element: 'Earth',
    hardness: '7',
    origin: 'Brazil, Madagascar, India',
    rarity: 'Common',
    image: '/images/crystals/ROSE/ro1.png',
    images: [
      '/images/crystals/ROSE/ro1.png',
      '/images/crystals/ROSE/RO2.png',
      '/images/crystals/ROSE/RO3.png',
      '/images/crystals/ROSE/RO4.png',
      '/images/crystals/ROSE/RO5.png'
    ]
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
    zodiacSigns: ['Sagittarius', 'Pisces'],
    birthMonths: [11, 12, 2, 3],
    element: 'Water',
    hardness: '5-5.5',
    origin: 'Afghanistan, Chile, Russia',
    rarity: 'Uncommon',
    image: '/images/crystals/LAPIS LAZULI/LL1.png',
    images: [
      '/images/crystals/LAPIS LAZULI/LL1.png',
      '/images/crystals/LAPIS LAZULI/LL2.png',
      '/images/crystals/LAPIS LAZULI/LL3.png',
      '/images/crystals/LAPIS LAZULI/LL4.png',
      '/images/crystals/LAPIS LAZULI/LL5.png'
    ]
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
    rarity: 'Common',
    image: '/images/crystals/SELENITE/SL1.png',
    images: [
      '/images/crystals/SELENITE/SL1.png',
      '/images/crystals/SELENITE/SL2.png',
      '/images/crystals/SELENITE/SL3.png',
      '/images/crystals/SELENITE/SL4.png',
      '/images/crystals/SELENITE/SL5.png'
    ]
  },
  {
    id: 'magnetic-1',
    name: 'Magnetic Bracelet',
    description: 'A therapeutic bracelet with magnetic properties. Promotes circulation, reduces inflammation, and provides natural pain relief while balancing energy.',
    price: 28,
    properties: ['Pain Relief', 'Circulation', 'Energy Balance', 'Healing', 'Therapeutic'],
    colors: ['Metallic Gray', 'Black'],
    category: 'Healing',
    chakra: 'Root',
    zodiacSigns: ['Virgo', 'Capricorn'],
    birthMonths: [8, 9, 12, 1],
    element: 'Earth',
    hardness: '5-6',
    origin: 'China, USA',
    rarity: 'Common',
    image: '/images/crystals/HEALTH MAGNET BRACELET/HM1.png',
    images: [
      '/images/crystals/HEALTH MAGNET BRACELET/HM1.png',
      '/images/crystals/HEALTH MAGNET BRACELET/HM2.png',
      '/images/crystals/HEALTH MAGNET BRACELET/HM3.png',
      '/images/crystals/HEALTH MAGNET BRACELET/HM4.png',
      '/images/crystals/HEALTH MAGNET BRACELET/HM5.png'
    ]
  },
  {
    id: 'money-magnet-1',
    name: 'Money Magnet Bracelet',
    description: 'A powerful combination of abundance stones designed to attract wealth and prosperity. Features Citrine, Pyrite, and Green Aventurine for maximum manifestation.',
    price: 42,
    image: '/images/MONEY MAGNET/MM1.png',
    properties: ['Wealth Attraction', 'Prosperity', 'Abundance', 'Success', 'Manifestation'],
    colors: ['Golden', 'Green', 'Yellow'],
    category: 'Abundance',
    chakra: 'Solar Plexus',
    zodiacSigns: ['Leo', 'Aries', 'Sagittarius'],
    birthMonths: [3, 4, 7, 8, 11, 12],
    element: 'Fire',
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
    chakra: 'Third Eye',
    zodiacSigns: ['Pisces', 'Virgo', 'Aquarius', 'Capricorn'],
    birthMonths: [2, 8, 9, 1, 12],
    element: 'Air',
    hardness: '7',
    origin: 'Brazil, Uruguay, Zambia',
    rarity: 'Common',
    image: '/images/crystals/AMETHYST/AM1.png',
    images: [
      '/images/crystals/AMETHYST/AM1.png',
      '/images/crystals/AMETHYST/AM2.png',
      '/images/crystals/AMETHYST/AM3.png',
      '/images/crystals/AMETHYST/AM4.png',
      '/images/crystals/AMETHYST/AM5.png'
    ]
  },
  {
    id: 'dalmatian-jasper-1',
    name: 'Dalmatian Jasper Bracelet',
    description: 'A playful stone that brings joy and positivity. Dalmatian Jasper helps overcome depression, brings out your inner child, and promotes loyalty and friendship.',
    price: 26,
    properties: ['Joy', 'Positivity', 'Friendship', 'Loyalty', 'Inner Child'],
    colors: ['White', 'Black', 'Cream'],
    category: 'Emotional Healing',
    chakra: 'Root',
    zodiacSigns: ['Gemini', 'Virgo'],
    birthMonths: [5, 6, 8, 9],
    element: 'Earth',
    hardness: '6.5-7',
    origin: 'Mexico, India',
    rarity: 'Common',
    image: '/images/crystals/DALMATIAN/DM1.png',
    images: [
      '/images/crystals/DALMATIAN/DM1.png',
      '/images/crystals/DALMATIAN/DM2.png',
      '/images/crystals/DALMATIAN/DM3.png',
      '/images/crystals/DALMATIAN/DM4.png',
      '/images/crystals/DALMATIAN/DM5.png'
    ]
  }
];

// Zodiac sign calculation
export function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

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
  return '';
}

// Enhanced recommendation function that works with both Date objects and parameters
export const getRecommendedCrystals = (input: Date | number, zodiacSign?: string): Crystal[] => {
  let birthMonth: number;
  let calculatedZodiacSign: string;

  if (input instanceof Date) {
    birthMonth = input.getMonth() + 1;
    calculatedZodiacSign = getZodiacSign(input);
  } else {
    birthMonth = input;
    calculatedZodiacSign = zodiacSign || '';
  }

  // Filter crystals based on zodiac sign and birth month
  const recommendations = crystalDatabase.filter(crystal => {
    const matchesZodiac = calculatedZodiacSign && crystal.zodiacSigns.includes(calculatedZodiacSign);
    const matchesBirthMonth = crystal.birthMonths.includes(birthMonth);

    return matchesZodiac || matchesBirthMonth;
  });

  // If no specific matches, return some popular crystals based on birth month season
  if (recommendations.length === 0) {
    const seasonalCrystals = crystalDatabase.filter(crystal => {
      // Spring (March-May): Growth and renewal crystals
      if (birthMonth >= 3 && birthMonth <= 5) {
        return crystal.properties.includes('Growth') || crystal.properties.includes('Love') || crystal.category === 'Love';
      }
      // Summer (June-August): Energy and confidence crystals
      if (birthMonth >= 6 && birthMonth <= 8) {
        return crystal.properties.includes('Energy') || crystal.properties.includes('Confidence') || crystal.category === 'Energy';
      }
      // Fall (September-November): Protection and grounding crystals
      if (birthMonth >= 9 && birthMonth <= 11) {
        return crystal.properties.includes('Protection') || crystal.properties.includes('Grounding') || crystal.category === 'Protection';
      }
      // Winter (December-February): Spiritual and calming crystals
      return crystal.properties.includes('Spiritual Protection') || crystal.properties.includes('Calming') || crystal.category === 'Spiritual Protection';
    });

    return seasonalCrystals.length > 0 ? seasonalCrystals.slice(0, 6) : crystalDatabase.slice(0, 6);
  }

  // Sort by relevance (zodiac match first, then birth month)
  return recommendations.sort((a, b) => {
    const aZodiacMatch = calculatedZodiacSign && a.zodiacSigns.includes(calculatedZodiacSign) ? 1 : 0;
    const bZodiacMatch = calculatedZodiacSign && b.zodiacSigns.includes(calculatedZodiacSign) ? 1 : 0;

    if (aZodiacMatch !== bZodiacMatch) {
      return bZodiacMatch - aZodiacMatch;
    }

    const aBirthMatch = a.birthMonths.includes(birthMonth) ? 1 : 0;
    const bBirthMatch = b.birthMonths.includes(birthMonth) ? 1 : 0;

    return bBirthMatch - aBirthMatch;
  }).slice(0, 6);
};

export const getCrystalsByCategory = (category: string): Crystal[] => {
  return crystalDatabase.filter(crystal => crystal.category === category);
};

export const getCrystalsByChakra = (chakra: string): Crystal[] => {
  return crystalDatabase.filter(crystal => crystal.chakra === chakra || crystal.chakra === 'All Chakras');
};

export const getCrystalsByPriceRange = (minPrice: number, maxPrice: number): Crystal[] => {
  return crystalDatabase.filter(crystal => crystal.price >= minPrice && crystal.price <= maxPrice);
};

export const getRandomCrystals = (count: number): Crystal[] => {
  const shuffled = [...crystalDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const searchCrystals = (query: string): Crystal[] => {
  const lowercaseQuery = query.toLowerCase();
  return crystalDatabase.filter(crystal =>
    crystal.name.toLowerCase().includes(lowercaseQuery) ||
    crystal.description.toLowerCase().includes(lowercaseQuery) ||
    crystal.properties.some(prop => prop.toLowerCase().includes(lowercaseQuery)) ||
    crystal.colors.some(color => color.toLowerCase().includes(lowercaseQuery)) ||
    crystal.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getAllCategories = (): string[] => {
  const categories = crystalDatabase.map(crystal => crystal.category);
  return [...new Set(categories)].sort();
};

export const getAllChakras = (): string[] => {
  const chakras = crystalDatabase.map(crystal => crystal.chakra);
  return [...new Set(chakras)].sort();
};
