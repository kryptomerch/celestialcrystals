import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const rarity = searchParams.get('rarity');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'name';
    const limit = parseInt(searchParams.get('limit') || '0');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build Prisma query
    const where: any = {
      isActive: true
    };

    // Apply filters
    if (category && category !== 'All') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { keywords: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (rarity && rarity !== 'All') {
      where.rarity = rarity;
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }

    // Apply sorting
    let orderBy: any = { name: 'asc' };
    switch (sortBy) {
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rarity':
        orderBy = { rarity: 'asc' };
        break;
    }

    // Fetch crystals from database
    const crystals = await prisma.crystal.findMany({
      where,
      orderBy,
      take: limit > 0 ? limit : undefined,
      skip: offset,
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

    // Transform the data to match the expected format
    const transformedCrystals = crystals.map(crystal => ({
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
    }));

    const total = await prisma.crystal.count({ where });

    return NextResponse.json({
      crystals: transformedCrystals,
      total,
      hasMore: limit > 0 && crystals.length === limit
    });

  } catch (error) {
    console.error('Error fetching crystals from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crystals from database' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
