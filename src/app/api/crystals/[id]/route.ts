import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Find the crystal by ID from database
    const crystal = await prisma.crystal.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        chakra: true,
        element: true,
        hardness: true,
        origin: true,
        rarity: true,
        slug: true,
        stockQuantity: true,
        isActive: true,
        isFeatured: true,
        properties: true,
        colors: true,
        zodiacSigns: true,
        birthMonths: true,
        keywords: true,
        image: true,
        images: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!crystal) {
      return NextResponse.json(
        { error: 'Crystal not found' },
        { status: 404 }
      );
    }

    // Transform the crystal data
    const transformedCrystal = {
      ...crystal,
      properties: (() => {
        try {
          return Array.isArray(crystal.properties) ? crystal.properties : JSON.parse(crystal.properties || '[]');
        } catch {
          return [];
        }
      })(),
      colors: (() => {
        try {
          return Array.isArray(crystal.colors) ? crystal.colors : JSON.parse(crystal.colors || '[]');
        } catch {
          return [];
        }
      })(),
      zodiacSigns: (() => {
        try {
          return Array.isArray(crystal.zodiacSigns) ? crystal.zodiacSigns : JSON.parse(crystal.zodiacSigns || '[]');
        } catch {
          return [];
        }
      })(),
      images: (() => {
        try {
          return Array.isArray(crystal.images) ? crystal.images : [crystal.image].filter(Boolean);
        } catch {
          return [crystal.image].filter(Boolean);
        }
      })()
    };

    // Get related crystals (same category)
    const relatedCrystalsData = await prisma.crystal.findMany({
      where: {
        AND: [
          { id: { not: id } },
          { isActive: true },
          { category: crystal.category }
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        image: true,
        colors: true,
        properties: true
      },
      take: 4
    });

    // Transform related crystals
    const relatedCrystals = relatedCrystalsData.map(relatedCrystal => ({
      ...relatedCrystal,
      properties: (() => {
        try {
          return Array.isArray(relatedCrystal.properties) ? relatedCrystal.properties : JSON.parse(relatedCrystal.properties || '[]');
        } catch {
          return [];
        }
      })(),
      colors: (() => {
        try {
          return Array.isArray(relatedCrystal.colors) ? relatedCrystal.colors : JSON.parse(relatedCrystal.colors || '[]');
        } catch {
          return [];
        }
      })()
    }));

    return NextResponse.json({
      crystal: transformedCrystal,
      relatedCrystals
    });

  } catch (error) {
    console.error('Error fetching crystal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crystal' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
