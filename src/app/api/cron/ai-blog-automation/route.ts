import { NextRequest, NextResponse } from 'next/server';
import { AIBlogAutomationService } from '@/lib/ai-blog-automation';

// Verify cron secret for security
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'your-cron-secret-key-here';

  // For Vercel cron jobs, check the cron secret header
  const vercelCronSecret = request.headers.get('x-vercel-cron-secret');

  // Allow both Authorization header (for GitHub Actions) and Vercel cron secret
  return authHeader === `Bearer ${cronSecret}` || vercelCronSecret === cronSecret;
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

    // Get action from POST body (for GitHub Actions and admin calls)
    let action;
    try {
      const body = await request.json();
      action = body.action;
    } catch {
      // If no body, try query parameter (for Vercel cron)
      const { searchParams } = new URL(request.url);
      action = searchParams.get('action');
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      );
    }

    // Use shared function to process the action
    return await processCronAction(action);

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

  // Save the post to database
  await AIBlogAutomationService.saveBlogPost({
    ...blogPost,
    category: 'How-To Guides',
    featuredImage: '/blog/how-to-crystals.jpg',
    publishDate: new Date(),
    status: 'published',
    author: 'CELESTIAL Team',
    tags: ['how-to', 'crystal healing', topic.action.replace(' ', '-')]
  });

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

  // Save the post to database
  await AIBlogAutomationService.saveBlogPost({
    ...blogPost,
    category: 'Birthstone Guides',
    featuredImage: `/blog/birthstone-${monthData.month.toLowerCase()}.jpg`,
    publishDate: new Date(),
    status: 'published',
    author: 'CELESTIAL Team',
    tags: ['birthstone', monthData.month.toLowerCase(), 'zodiac', 'astrology']
  });

  console.log(`Generated birthstone post: ${blogPost.title}`);
}

// Handle GET requests (for Vercel cron jobs)
export async function GET(request: NextRequest) {
  try {
    // Check if this is a cron job with action parameter
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action) {
      // This is a Vercel cron job, verify authorization
      if (!verifyCronSecret(request)) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Process the cron job action
      return await processCronAction(action);
    }

    // Simple health check for manual requests
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
  } catch (error) {
    console.error('❌ GET AI Blog automation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Shared function to process cron actions
async function processCronAction(action: string) {
  console.log(`🤖 AI Blog Automation triggered: ${action}`);

  let result = {};

  switch (action) {
    case 'weekly-crystal-post':
      console.log('📝 Generating weekly crystal post...');
      await AIBlogAutomationService.generateWeeklyCrystalPost();
      result = {
        type: 'weekly-crystal-post',
        message: 'Weekly crystal guide generated successfully',
        timestamp: new Date().toISOString()
      };
      break;

    case 'monthly-chakra-post':
      console.log('🧘 Generating monthly chakra post...');
      await AIBlogAutomationService.generateMonthlyChakraPost();
      result = {
        type: 'monthly-chakra-post',
        message: 'Monthly chakra guide generated successfully',
        timestamp: new Date().toISOString()
      };
      break;

    case 'seasonal-post':
      console.log('🌸 Generating seasonal post...');
      await AIBlogAutomationService.generateSeasonalPost();
      result = {
        type: 'seasonal-post',
        message: 'Seasonal crystal guide generated successfully',
        timestamp: new Date().toISOString()
      };
      break;

    case 'generate-all':
      console.log('🚀 Generating multiple posts...');
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

  console.log(`✅ AI Blog Automation completed: ${action}`);

  return NextResponse.json({
    success: true,
    action,
    result,
    timestamp: new Date().toISOString(),
  });
}
