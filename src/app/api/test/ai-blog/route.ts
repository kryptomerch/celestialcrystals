import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isAdminEmail } from '@/lib/auth';
import { AIBlogAutomationService } from '@/lib/ai-blog-automation';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check admin authorization
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const isAdmin = isAdminEmail(session.user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { type } = await request.json();

    let result;

    switch (type) {
      case 'chakra':
        console.log('🧘 Testing chakra guide generation...');
        await AIBlogAutomationService.generateMonthlyChakraPost();
        result = {
          type: 'chakra',
          message: 'Monthly chakra guide generated successfully',
          timestamp: new Date().toISOString()
        };
        break;

      case 'seasonal':
        console.log('🌸 Testing seasonal post generation...');
        await AIBlogAutomationService.generateSeasonalPost();
        result = {
          type: 'seasonal',
          message: 'Seasonal crystal guide generated successfully',
          timestamp: new Date().toISOString()
        };
        break;

      case 'crystal':
        console.log('💎 Testing crystal guide generation...');
        await AIBlogAutomationService.generateWeeklyCrystalPost();
        result = {
          type: 'crystal',
          message: 'Weekly crystal guide generated successfully',
          timestamp: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: chakra, seasonal, or crystal' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
      message: `AI blog generation test completed: ${type}`
    });

  } catch (error) {
    console.error('❌ AI blog test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test AI blog generation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
