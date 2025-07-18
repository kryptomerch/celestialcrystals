import { NextRequest, NextResponse } from 'next/server';
import { crystalDatabase } from '@/data/crystals';

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

    // Filter crystals based on query parameters
    let filteredCrystals = crystalDatabase.filter(crystal => {
      // Category filter
      if (category && category !== 'All' && crystal.category !== category) {
        return false;
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = crystal.name.toLowerCase().includes(searchLower);
        const matchesDescription = crystal.description.toLowerCase().includes(searchLower);
        const matchesProperties = crystal.properties.some(prop => 
          prop.toLowerCase().includes(searchLower)
        );
        
        if (!matchesName && !matchesDescription && !matchesProperties) {
          return false;
        }
      }

      // Rarity filter
      if (rarity && rarity !== 'All' && crystal.rarity !== rarity) {
        return false;
      }

      // Price range filter
      if (minPrice && crystal.price < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice && crystal.price > parseFloat(maxPrice)) {
        return false;
      }

      return true;
    });

    // Sort crystals
    filteredCrystals.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Very Rare': 4 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        default:
          return 0;
      }
    });

    // Apply pagination
    const total = filteredCrystals.length;
    if (limit > 0) {
      filteredCrystals = filteredCrystals.slice(offset, offset + limit);
    }

    return NextResponse.json({
      crystals: filteredCrystals,
      total,
      offset,
      limit: limit || total
    });

  } catch (error) {
    console.error('Error fetching crystals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crystals' },
      { status: 500 }
    );
  }
}

// Get available filter options
export async function OPTIONS() {
  try {
    const categories = [...new Set(crystalDatabase.map(crystal => crystal.category))];
    const rarities = [...new Set(crystalDatabase.map(crystal => crystal.rarity))];
    const priceRange = {
      min: Math.min(...crystalDatabase.map(crystal => crystal.price)),
      max: Math.max(...crystalDatabase.map(crystal => crystal.price))
    };

    return NextResponse.json({
      categories,
      rarities,
      priceRange,
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
  }
}
