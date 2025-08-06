import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isUserAdmin, isAdminEmail } from '@/lib/auth';
import { AIBlogAutomationService } from '@/lib/ai-blog-automation';

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
    status: 'draft', // Save as draft for review
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
    status: 'draft', // Save as draft for review
    author: 'CELESTIAL Team',
    tags: ['birthstone', monthData.month.toLowerCase(), 'zodiac', 'astrology']
  });

  console.log(`Generated birthstone post: ${blogPost.title}`);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check admin authorization
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(session.user.id) || isAdminEmail(session.user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { action } = await request.json();
    console.log(`🤖 Admin AI Blog Generation triggered: ${action}`);

    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      );
    }

    let result;

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

    console.log(`✅ Admin AI Blog Generation completed: ${action}`);

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Admin AI Blog Generation Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate blog content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
