import { NextRequest, NextResponse } from 'next/server';
import { AIBlogAutomationService } from '@/lib/ai-blog-automation';

// Verify cron secret for security
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'your-cron-secret-key-here';
  
  return authHeader === `Bearer ${cronSecret}`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    if (!verifyCronSecret(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action } = await request.json();
    let result = {};

    switch (action) {
      case 'weekly-crystal-post':
        await AIBlogAutomationService.generateWeeklyCrystalPost();
        result = { 
          type: 'weekly-crystal-post',
          message: 'Weekly crystal guide generated successfully',
          timestamp: new Date().toISOString()
        };
        break;
      
      case 'monthly-chakra-post':
        await AIBlogAutomationService.generateMonthlyChakraPost();
        result = { 
          type: 'monthly-chakra-post',
          message: 'Monthly chakra guide generated successfully',
          timestamp: new Date().toISOString()
        };
        break;
      
      case 'seasonal-post':
        await AIBlogAutomationService.generateSeasonalPost();
        result = { 
          type: 'seasonal-post',
          message: 'Seasonal crystal guide generated successfully',
          timestamp: new Date().toISOString()
        };
        break;
      
      case 'generate-all':
        // Generate multiple posts for content boost
        await Promise.all([
          AIBlogAutomationService.generateWeeklyCrystalPost(),
          generateHowToPost(),
          generateBirthstonePost()
        ]);
        result = { 
          type: 'generate-all',
          message: 'Multiple blog posts generated successfully',
          count: 3,
          timestamp: new Date().toISOString()
        };
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: weekly-crystal-post, monthly-chakra-post, seasonal-post, or generate-all' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI Blog automation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Generate How-To guides
async function generateHowToPost(): Promise<void> {
  const howToTopics = [
    { action: 'cleanse crystals', benefit: 'purification' },
    { action: 'charge crystals', benefit: 'energy amplification' },
    { action: 'meditate with crystals', benefit: 'spiritual connection' },
    { action: 'create crystal grids', benefit: 'manifestation' },
    { action: 'choose your first crystal', benefit: 'healing journey' }
  ];

  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const topic = howToTopics[weekNumber % howToTopics.length];

  const variables = {
    action: topic.action,
    benefit: topic.benefit
  };

  const blogPost = await AIBlogAutomationService.generateBlogPost('howToGuide', variables);
  
  // Save the post (implement your save logic)
  console.log(`Generated how-to post: ${blogPost.title}`);
}

// Generate birthstone guides
async function generateBirthstonePost(): Promise<void> {
  const months = [
    { month: 'January', zodiac: 'Capricorn/Aquarius' },
    { month: 'February', zodiac: 'Aquarius/Pisces' },
    { month: 'March', zodiac: 'Pisces/Aries' },
    { month: 'April', zodiac: 'Aries/Taurus' },
    { month: 'May', zodiac: 'Taurus/Gemini' },
    { month: 'June', zodiac: 'Gemini/Cancer' },
    { month: 'July', zodiac: 'Cancer/Leo' },
    { month: 'August', zodiac: 'Leo/Virgo' },
    { month: 'September', zodiac: 'Virgo/Libra' },
    { month: 'October', zodiac: 'Libra/Scorpio' },
    { month: 'November', zodiac: 'Scorpio/Sagittarius' },
    { month: 'December', zodiac: 'Sagittarius/Capricorn' }
  ];

  const currentMonth = new Date().getMonth();
  const monthData = months[currentMonth];

  const variables = {
    month: monthData.month,
    zodiac: monthData.zodiac
  };

  const blogPost = await AIBlogAutomationService.generateBlogPost('birthstoneGuide', variables);
  
  // Save the post (implement your save logic)
  console.log(`Generated birthstone post: ${blogPost.title}`);
}

// Manual trigger endpoint for testing
export async function GET(request: NextRequest) {
  // Simple health check
  return NextResponse.json({
    status: 'AI Blog Automation Service Active',
    timestamp: new Date().toISOString(),
    availableActions: [
      'weekly-crystal-post',
      'monthly-chakra-post', 
      'seasonal-post',
      'generate-all'
    ]
  });
}
