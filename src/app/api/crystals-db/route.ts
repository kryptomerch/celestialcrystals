import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6h1jKNvgDCVE@ep-divine-sunset-ad5sal24-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

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
      const searchLower = search.toLowerCase();
      where.OR = [
        { name: { contains: searchLower, mode: 'insensitive' } },
        { description: { contains: searchLower, mode: 'insensitive' } },
        { category: { contains: searchLower, mode: 'insensitive' } }
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

    // Build order by
    let orderBy: any = { name: 'asc' };
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'name':
      default:
        orderBy = { name: 'asc' };
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
        image: true,
        images: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Transform data to match frontend format
    const transformedCrystals = crystals.map(crystal => ({
      ...crystal,
      properties: typeof crystal.properties === 'string' ? JSON.parse(crystal.properties) : crystal.properties || [],
      colors: typeof crystal.colors === 'string' ? JSON.parse(crystal.colors) : crystal.colors || [],
      zodiacSigns: typeof crystal.zodiacSigns === 'string' ? JSON.parse(crystal.zodiacSigns) : crystal.zodiacSigns || [],
      birthMonths: typeof crystal.birthMonths === 'string' ? JSON.parse(crystal.birthMonths) : crystal.birthMonths || [],
      images: (() => {
        try {
          if (typeof crystal.images === 'string') {
            const parsed = JSON.parse(crystal.images);
            return Array.isArray(parsed) ? parsed : [crystal.image].filter(Boolean);
          }
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

// Get available filter options from database
export async function OPTIONS() {
  try {
    const categories = await prisma.crystal.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category']
    });

    const rarities = await prisma.crystal.findMany({
      where: { isActive: true },
      select: { rarity: true },
      distinct: ['rarity']
    });

    const priceRange = await prisma.crystal.aggregate({
      where: { isActive: true },
      _min: { price: true },
      _max: { price: true }
    });

    return NextResponse.json({
      categories: categories.map(c => c.category),
      rarities: rarities.map(r => r.rarity),
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 100
      },
      sortOptions: [
        { value: 'name', label: 'Name' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rarity', label: 'Rarity' }
      ]
    });

  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
