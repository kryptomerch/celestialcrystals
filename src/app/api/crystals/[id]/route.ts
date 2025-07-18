import { NextRequest, NextResponse } from 'next/server';
import { crystalDatabase } from '@/data/crystals';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Find the crystal by ID
    const crystal = crystalDatabase.find(c => c.id === id);

    if (!crystal) {
      return NextResponse.json(
        { error: 'Crystal not found' },
        { status: 404 }
      );
    }

    // Get related crystals (same category or similar properties)
    const relatedCrystals = crystalDatabase
      .filter(c => 
        c.id !== crystal.id && (
          c.category === crystal.category ||
          c.properties.some(prop => crystal.properties.includes(prop))
        )
      )
      .slice(0, 4);

    return NextResponse.json({
      crystal,
      relatedCrystals
    });

  } catch (error) {
    console.error('Error fetching crystal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crystal' },
      { status: 500 }
    );
  }
}
