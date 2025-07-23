import { NextRequest, NextResponse } from 'next/server';
import { setupProductionDatabase } from '../../../scripts/setup-production-db';

export async function GET(request: NextRequest) {
  try {
    // Only allow this in production setup
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in production' },
        { status: 403 }
      );
    }

    // Check if database is already set up
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    try {
      const userCount = await prisma.user.count();
      if (userCount > 0) {
        return NextResponse.json({
          success: true,
          message: 'Database is already set up',
          userCount,
          status: 'already_configured'
        });
      }
    } catch (error) {
      // Database might not be migrated yet, continue with setup
    }

    // Run database setup
    await setupProductionDatabase();

    return NextResponse.json({
      success: true,
      message: 'Production database setup completed successfully',
      status: 'configured',
      adminCredentials: {
        email: 'dhruvaparik@gmail.com',
        password: '9824444830',
        loginUrl: `${process.env.NEXTAUTH_URL}/admin`
      }
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to set up database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { force } = await request.json();

    if (!force) {
      return NextResponse.json(
        { error: 'Force parameter required for POST requests' },
        { status: 400 }
      );
    }

    // Force setup even if database exists
    await setupProductionDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database forcefully reset and configured',
      status: 'force_configured'
    });

  } catch (error) {
    console.error('Forced database setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to force setup database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
