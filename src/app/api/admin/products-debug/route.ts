import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Debug endpoint to test products without authentication
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Fetching products without auth...');

    const products = await prisma.crystal.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        stockQuantity: true,
        lowStockThreshold: true,
        isActive: true,
        isFeatured: true,
        image: true,
        images: true,
        properties: true,
        colors: true,
        chakra: true,
        zodiacSigns: true,
        element: true,
        hardness: true,
        origin: true,
        rarity: true,
        birthMonths: true,
        keywords: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log(`✅ Found ${products.length} products`);

    // Parse JSON fields
    const formattedProducts = products.map(product => ({
      ...product,
      properties: typeof product.properties === 'string' 
        ? JSON.parse(product.properties) 
        : product.properties || [],
      colors: typeof product.colors === 'string' 
        ? JSON.parse(product.colors) 
        : product.colors || [],
      zodiacSigns: typeof product.zodiacSigns === 'string' 
        ? JSON.parse(product.zodiacSigns) 
        : product.zodiacSigns || [],
      images: typeof product.images === 'string' 
        ? JSON.parse(product.images) 
        : product.images || [],
      birthMonths: typeof product.birthMonths === 'string' 
        ? JSON.parse(product.birthMonths) 
        : product.birthMonths || []
    }));

    return NextResponse.json({
      success: true,
      message: `Found ${products.length} products`,
      products: formattedProducts,
      totalCount: products.length,
      debug: true
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Update product without authentication for testing
export async function PUT(request: NextRequest) {
  try {
    const { productId, updates } = await request.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    console.log('🔧 Debug: Updating product:', productId, updates);

    const updatedProduct = await prisma.crystal.update({
      where: { id: productId },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    });

    console.log('✅ Product updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
