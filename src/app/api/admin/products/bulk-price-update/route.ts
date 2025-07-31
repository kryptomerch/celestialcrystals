import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function isAdminEmail(email: string): boolean {
  const adminEmails = [
    'dhruvshah8888@gmail.com',
    'admin@celestialcrystals.com',
    'kryptomerch.io@gmail.com',
    'dhruvaparik@gmail.com'
  ];
  return adminEmails.includes(email.toLowerCase());
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { updates } = await request.json();

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: 'Updates array is required' }, { status: 400 });
    }

    const results = [];

    for (const update of updates) {
      const { id, price } = update;

      if (!id || price === undefined || price < 0) {
        results.push({
          id,
          success: false,
          error: 'Invalid ID or price'
        });
        continue;
      }

      try {
        const updatedProduct = await prisma.crystal.update({
          where: { id },
          data: {
            price: parseFloat(price.toString()),
            updatedAt: new Date()
          },
          select: {
            id: true,
            name: true,
            price: true
          }
        });

        results.push({
          id,
          success: true,
          product: updatedProduct
        });
      } catch (error) {
        results.push({
          id,
          success: false,
          error: 'Product not found or update failed'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      updated: successCount,
      failed: failedCount,
      results
    });

  } catch (error) {
    console.error('Error updating prices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all products for price management
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const products = await prisma.crystal.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        stockQuantity: true,
        isActive: true,
        updatedAt: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ products });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
