import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isAdminEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all products for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (either by role or email)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const isAdmin = user?.role === 'ADMIN' || isAdminEmail(session.user.email);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (category) where.category = category;
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [products, totalCount] = await Promise.all([
      prisma.crystal.findMany({
        where,
        include: {
          _count: {
            select: {
              orderItems: true,
              reviews: true,
              wishlistItems: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.crystal.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const isAdmin = user?.role === 'ADMIN' || isAdminEmail(session.user.email);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const {
      name,
      description,
      price,
      category,
      properties,
      colors,
      chakra,
      zodiacSigns,
      stockQuantity,
      lowStockThreshold,
      image,
      images,
      isActive,
      isFeatured
    } = await request.json();

    // Validation
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      );
    }

    // Create the product
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.crystal.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        category,
        element: 'Earth', // Default value
        hardness: '7', // Default value
        origin: 'Various', // Default value
        rarity: 'Common', // Default value
        properties: properties || [],
        colors: colors || [],
        chakra: chakra || '',
        zodiacSigns: zodiacSigns || [],
        birthMonths: JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), // Default all months
        keywords: JSON.stringify([name.toLowerCase()]), // Default keyword
        stockQuantity: parseInt(stockQuantity) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 5,
        image: image || '',
        images: images || [],
        isActive: isActive !== false,
        isFeatured: isFeatured === true
      }
    });

    // Create initial inventory log
    await prisma.inventoryLog.create({
      data: {
        crystalId: product.id,
        type: 'INITIAL_STOCK',
        quantity: parseInt(stockQuantity) || 0,
        previousQty: 0,
        newQty: parseInt(stockQuantity) || 0,
        reason: 'Initial product creation'
      }
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update product
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const isAdmin = user?.role === 'ADMIN' || isAdminEmail(session.user.email);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const {
      id,
      name,
      description,
      price,
      category,
      properties,
      colors,
      chakra,
      zodiacSigns,
      stockQuantity,
      lowStockThreshold,
      image,
      images,
      isActive,
      isFeatured
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get current product for inventory tracking
    const currentProduct = await prisma.crystal.findUnique({
      where: { id },
      select: { stockQuantity: true, name: true }
    });

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update the product
    const updatedProduct = await prisma.crystal.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(properties && { properties }),
        ...(colors && { colors }),
        ...(chakra && { chakra }),
        ...(zodiacSigns && { zodiacSigns }),
        ...(stockQuantity !== undefined && { stockQuantity: parseInt(stockQuantity) }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold: parseInt(lowStockThreshold) }),
        ...(image && { image }),
        ...(images && { images }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        updatedAt: new Date()
      }
    });

    // Create inventory log if stock quantity changed
    if (stockQuantity !== undefined && parseInt(stockQuantity) !== currentProduct.stockQuantity) {
      await prisma.inventoryLog.create({
        data: {
          crystalId: id,
          type: 'ADJUSTMENT',
          quantity: parseInt(stockQuantity) - currentProduct.stockQuantity,
          previousQty: currentProduct.stockQuantity,
          newQty: parseInt(stockQuantity),
          reason: 'Product update - stock adjustment'
        }
      });
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Soft delete - just mark as inactive
    await prisma.crystal.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deactivated successfully'
    });

  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
