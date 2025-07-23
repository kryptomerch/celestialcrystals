import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomationService } from '@/lib/email-automation';
import { crystalDatabase } from '@/data/crystals';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      );
    }

    // Get featured crystal of the week (rotate based on week number)
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const featuredCrystal = crystalDatabase[weekNumber % crystalDatabase.length];

    const newsletterData = {
      firstName,
      weekNumber: weekNumber % 52 + 1, // Week 1-52
      featuredCrystal: {
        name: featuredCrystal.name,
        description: featuredCrystal.description,
        properties: featuredCrystal.properties,
        price: featuredCrystal.price,
        url: `${process.env.NEXTAUTH_URL}/crystals/${featuredCrystal.id}`,
      },
      moonPhase: EmailAutomationService.getCurrentMoonPhase(),
      crystalTip: EmailAutomationService.getCrystalTipOfWeek(),
      specialOffer: {
        title: 'Weekly Crystal Special',
        description: 'Get 10% off any crystal this week only!',
        code: EmailAutomationService.generateDiscountCode('WEEKLY'),
        discount: '10%',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      },
    };

    const success = await EmailAutomationService.sendNewsletterEmail(newsletterData);

    if (success) {
      return NextResponse.json({
        message: 'Newsletter sent successfully',
        featuredCrystal: featuredCrystal.name,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send newsletter' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send newsletter to all subscribers (admin endpoint)
export async function GET(request: NextRequest) {
  try {
    // Verify admin access (implement your auth logic)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real app, get subscribers from database
    const subscribers: { email: string; firstName: string }[] = [
      // { email: 'subscriber1@example.com', firstName: 'John' },
      // { email: 'subscriber2@example.com', firstName: 'Jane' },
    ];

    let successCount = 0;
    let failureCount = 0;

    for (const subscriber of subscribers) {
      try {
        const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
        const featuredCrystal = crystalDatabase[weekNumber % crystalDatabase.length];

        const newsletterData = {
          firstName: subscriber.firstName,
          weekNumber: weekNumber % 52 + 1,
          featuredCrystal: {
            name: featuredCrystal.name,
            description: featuredCrystal.description,
            properties: featuredCrystal.properties,
            price: featuredCrystal.price,
            url: `${process.env.NEXTAUTH_URL}/crystals/${featuredCrystal.id}`,
          },
          moonPhase: EmailAutomationService.getCurrentMoonPhase(),
          crystalTip: EmailAutomationService.getCrystalTipOfWeek(),
          specialOffer: {
            title: 'Weekly Crystal Special',
            description: 'Get 10% off any crystal this week only!',
            code: EmailAutomationService.generateDiscountCode('WEEKLY'),
            discount: '10%',
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          },
        };

        const success = await EmailAutomationService.sendNewsletterEmail(newsletterData);
        if (success) {
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
        failureCount++;
      }
    }

    return NextResponse.json({
      message: 'Newsletter batch completed',
      successCount,
      failureCount,
      totalSubscribers: subscribers.length,
    });
  } catch (error) {
    console.error('Newsletter batch API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
