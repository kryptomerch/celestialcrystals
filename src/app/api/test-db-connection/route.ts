import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV);

    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful:', result);

    // Test user table
    const userCount = await prisma.user.count();
    console.log('✅ User count:', userCount);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      details: {
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        userCount,
        testQuery: result
      }
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: {
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown'
      }
    }, { status: 500 });
  }
}
