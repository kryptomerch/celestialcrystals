import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const properties = searchParams.get('properties')?.split(',').filter(Boolean)
    const colors = searchParams.get('colors')?.split(',').filter(Boolean)
    const chakras = searchParams.get('chakras')?.split(',').filter(Boolean)
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true
    }

    // Text search
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { properties: { hasSome: [query] } },
        { colors: { hasSome: [query] } },
        { category: { contains: query, mode: 'insensitive' } },
        { chakra: { contains: query, mode: 'insensitive' } },
        { element: { contains: query, mode: 'insensitive' } },
        { origin: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Category filter
    if (category) {
      where.category = { equals: category, mode: 'insensitive' }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Properties filter
    if (properties && properties.length > 0) {
      where.properties = { hasSome: properties }
    }

    // Colors filter
    if (colors && colors.length > 0) {
      where.colors = { hasSome: colors }
    }

    // Chakras filter
    if (chakras && chakras.length > 0) {
      where.chakra = { in: chakras }
    }

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' }

    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'name_asc':
        orderBy = { name: 'asc' }
        break
      case 'name_desc':
        orderBy = { name: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'featured':
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
        break
      case 'popularity':
        // Order by number of orders (popularity)
        orderBy = { orderItems: { _count: 'desc' } }
        break
      case 'rating':
        // Order by average rating
        orderBy = { reviews: { _count: 'desc' } }
        break
      default:
        // Relevance - if there's a query, order by text match relevance
        if (query) {
          orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
        }
        break
    }

    // Get crystals with aggregated data
    const [crystals, totalCount] = await Promise.all([
      prisma.crystal.findMany({
        where,
        include: {
          reviews: {
            where: { isApproved: true },
            select: { rating: true }
          },
          _count: {
            select: {
              orderItems: true,
              reviews: true,
              wishlistItems: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.crystal.count({ where })
    ])

    // Format results with calculated fields
    const formattedCrystals = crystals.map(crystal => {
      const averageRating = crystal.reviews.length > 0
        ? crystal.reviews.reduce((sum, review) => sum + review.rating, 0) / crystal.reviews.length
        : 0

      return {
        id: crystal.id,
        name: crystal.name,
        description: crystal.description,
        price: crystal.price,
        category: crystal.category,
        chakra: crystal.chakra,
        element: crystal.element,
        hardness: crystal.hardness,
        origin: crystal.origin,
        rarity: crystal.rarity,
        image: crystal.image,
        images: crystal.images,
        properties: crystal.properties,
        colors: crystal.colors,
        zodiacSigns: crystal.zodiacSigns,
        birthMonths: crystal.birthMonths,
        slug: crystal.slug,
        stockQuantity: crystal.stockQuantity,
        isActive: crystal.isActive,
        isFeatured: crystal.isFeatured,
        createdAt: crystal.createdAt,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: crystal._count.reviews,
        orderCount: crystal._count.orderItems,
        wishlistCount: crystal._count.wishlistItems
      }
    })

    // Get filter options for faceted search
    const filterOptions = await Promise.all([
      // Categories
      prisma.crystal.groupBy({
        by: ['category'],
        where: { isActive: true },
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } }
      }),

      // Properties
      prisma.$queryRaw`
        SELECT DISTINCT unnest(properties) as property, COUNT(*) as count
        FROM crystals 
        WHERE is_active = true
        GROUP BY property
        ORDER BY count DESC
        LIMIT 20
      `,

      // Colors
      prisma.$queryRaw`
        SELECT DISTINCT unnest(colors) as color, COUNT(*) as count
        FROM crystals 
        WHERE is_active = true
        GROUP BY color
        ORDER BY count DESC
        LIMIT 15
      `,

      // Chakras
      prisma.crystal.groupBy({
        by: ['chakra'],
        where: { isActive: true },
        _count: { chakra: true },
        orderBy: { _count: { chakra: 'desc' } }
      }),

      // Price ranges
      prisma.crystal.aggregate({
        where: { isActive: true },
        _min: { price: true },
        _max: { price: true }
      })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      crystals: formattedCrystals,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        categories: filterOptions[0].map(item => ({
          value: item.category,
          label: item.category,
          count: item._count.category
        })),
        properties: filterOptions[1] as Array<{ property: string; count: number }>,
        colors: filterOptions[2] as Array<{ color: string; count: number }>,
        chakras: filterOptions[3].map(item => ({
          value: item.chakra,
          label: item.chakra,
          count: item._count.chakra
        })),
        priceRange: {
          min: filterOptions[4]._min.price || 0,
          max: filterOptions[4]._max.price || 1000
        }
      },
      searchInfo: {
        query,
        totalResults: totalCount,
        searchTime: Date.now() // You could measure actual search time
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}

// Search suggestions/autocomplete
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Get crystal name suggestions
    const crystalSuggestions = await prisma.crystal.findMany({
      where: {
        isActive: true,
        name: {
          contains: query
        }
      },
      select: {
        id: true,
        name: true,
        category: true,
        image: true
      },
      take: 5
    })

    // Get category suggestions
    const categorySuggestions = await prisma.crystal.groupBy({
      by: ['category'],
      where: {
        isActive: true,
        category: {
          contains: query
        }
      },
      orderBy: {
        category: 'asc'
      },
      take: 3
    })

    // Get property suggestions
    const propertySuggestions = await prisma.$queryRaw`
      SELECT DISTINCT unnest(properties) as property
      FROM crystals 
      WHERE is_active = true 
        AND unnest(properties) ILIKE ${`%${query}%`}
      LIMIT 3
    ` as Array<{ property: string }>

    const suggestions = [
      ...crystalSuggestions.map(crystal => ({
        type: 'crystal',
        id: crystal.id,
        text: crystal.name,
        category: crystal.category,
        image: crystal.image
      })),
      ...categorySuggestions.map(cat => ({
        type: 'category',
        text: cat.category,
        category: cat.category
      })),
      ...propertySuggestions.map(prop => ({
        type: 'property',
        text: prop.property
      }))
    ]

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Search suggestions error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
