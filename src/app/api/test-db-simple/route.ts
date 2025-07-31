import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6h1jKNvgDCVE@ep-divine-sunset-ad5sal24-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

export async function GET() {
  try {
    console.log('🔧 Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set from env' : 'Using fallback');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test queries
    const userCount = await prisma.user.count();
    const crystalCount = await prisma.crystal.count();
    const orderCount = await prisma.order.count();
    
    console.log(`👥 Users: ${userCount}, 💎 Crystals: ${crystalCount}, 📦 Orders: ${orderCount}`);
    
    // Get sample crystal data
    const sampleCrystals = await prisma.crystal.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
        isActive: true
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        users: userCount,
        crystals: crystalCount,
        orders: orderCount,
        sampleCrystals,
        databaseUrl: process.env.DATABASE_URL ? 'Set from environment' : 'Using fallback URL',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set from environment' : 'Using fallback URL',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
