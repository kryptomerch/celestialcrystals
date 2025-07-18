import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedCrystals, getZodiacSign } from '@/data/crystals';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate } = body;

    if (!birthDate) {
      return NextResponse.json(
        { error: 'Birth date is required' },
        { status: 400 }
      );
    }

    // Parse the birth date
    const date = new Date(birthDate);
    
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid birth date format' },
        { status: 400 }
      );
    }

    // Get zodiac sign and recommendations
    const zodiacSign = getZodiacSign(date);
    const recommendations = getRecommendedCrystals(date);

    // Get zodiac information
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

    return NextResponse.json({
      birthDate,
      zodiacSign,
      zodiacInfo: zodiacInfo[zodiacSign as keyof typeof zodiacInfo] || null,
      recommendations,
      birthMonth: date.getMonth() + 1
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const birthDate = searchParams.get('birthDate');

  if (!birthDate) {
    return NextResponse.json(
      { error: 'Birth date parameter is required' },
      { status: 400 }
    );
  }

  try {
    const date = new Date(birthDate);
    
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid birth date format' },
        { status: 400 }
      );
    }

    const zodiacSign = getZodiacSign(date);
    const recommendations = getRecommendedCrystals(date);

    return NextResponse.json({
      birthDate,
      zodiacSign,
      recommendations,
      birthMonth: date.getMonth() + 1
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
