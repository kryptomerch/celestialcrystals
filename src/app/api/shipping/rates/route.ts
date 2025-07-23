import { NextRequest, NextResponse } from 'next/server';
import { CanadaPostService, Package } from '@/lib/shipping/canada-post';

export async function POST(request: NextRequest) {
  try {
    const { postalCode, items } = await request.json();

    if (!postalCode) {
      return NextResponse.json(
        { error: 'Postal code is required' },
        { status: 400 }
      );
    }

    // Validate Canadian postal code format
    const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!canadianPostalRegex.test(postalCode)) {
      return NextResponse.json(
        { error: 'Please enter a valid Canadian postal code (e.g., K1A 0A6)' },
        { status: 400 }
      );
    }

    // Calculate package dimensions based on items
    const packages: Package[] = calculatePackages(items || []);

    // Get shipping rates from Canada Post
    const rates = await CanadaPostService.getRates(postalCode, packages);

    return NextResponse.json({
      success: true,
      rates,
      origin: 'Hamilton, ON',
      destination: postalCode.toUpperCase(),
    });

  } catch (error) {
    console.error('Shipping rates API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}

function calculatePackages(items: any[]): Package[] {
  // Default package for crystals (small jewelry box)
  const defaultPackage: Package = {
    weight: 100, // 100g base weight
    length: 15,  // 15cm
    width: 10,   // 10cm
    height: 5,   // 5cm
  };

  if (!items || items.length === 0) {
    return [defaultPackage];
  }

  // Calculate total weight based on items
  const totalWeight = items.reduce((weight, item) => {
    // Estimate weight per crystal (most crystals are 20-50g)
    const crystalWeight = 30; // 30g average
    return weight + (crystalWeight * item.quantity);
  }, 50); // 50g packaging weight

  // Adjust package size based on quantity
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems <= 3) {
    return [{
      weight: totalWeight,
      length: 15,
      width: 10,
      height: 5,
    }];
  } else if (totalItems <= 6) {
    return [{
      weight: totalWeight,
      length: 20,
      width: 15,
      height: 8,
    }];
  } else {
    return [{
      weight: totalWeight,
      length: 25,
      width: 20,
      height: 10,
    }];
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postalCode = searchParams.get('postalCode');

  if (!postalCode) {
    return NextResponse.json(
      { error: 'Postal code parameter is required' },
      { status: 400 }
    );
  }

  try {
    const packages: Package[] = [{
      weight: 200,
      length: 15,
      width: 10,
      height: 5,
    }];

    const rates = await CanadaPostService.getRates(postalCode, packages);

    return NextResponse.json({
      success: true,
      rates,
      origin: 'Hamilton, ON',
      destination: postalCode.toUpperCase(),
    });

  } catch (error) {
    console.error('Shipping rates GET error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}
