import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomationService } from '@/lib/email-automation';
import { crystalDatabase } from '@/data/crystals';

// This endpoint should be called by a cron service (like Vercel Cron, GitHub Actions, or external cron)
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from authorized source
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret-key';

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action } = await request.json();
    let result = {};

    switch (action) {
      case 'weekly-newsletter':
        result = await sendWeeklyNewsletter();
        break;

      case 'birthday-discounts':
        result = await sendBirthdayDiscounts();
        break;

      case 'winback-campaign':
        result = await sendWinbackCampaign();
        break;

      case 'seasonal-promotion':
        result = await sendSeasonalPromotion();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
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
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendWeeklyNewsletter() {
  console.log('Starting weekly newsletter send...');

  // In a real app, get subscribers from database
  const subscribers: { email: string; firstName: string }[] = [
    // Example: { email: 'user@example.com', firstName: 'John' }
  ];

  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const featuredCrystal = crystalDatabase[weekNumber % crystalDatabase.length];

  let successCount = 0;
  let failureCount = 0;

  for (const subscriber of subscribers) {
    try {
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
      if (success) successCount++;
      else failureCount++;

    } catch (error) {
      console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
      failureCount++;
    }
  }

  return {
    type: 'weekly-newsletter',
    totalSubscribers: subscribers.length,
    successCount,
    failureCount,
    featuredCrystal: featuredCrystal.name,
  };
}

async function sendBirthdayDiscounts() {
  console.log('Checking for birthday discounts...');

  // In a real app, query database for users with birthdays today
  const birthdayUsers: { email: string; firstName: string; birthDate: string }[] = [
    // Example: { email: 'user@example.com', firstName: 'John', birthDate: '1990-01-15' }
  ];

  let successCount = 0;
  let failureCount = 0;

  for (const user of birthdayUsers) {
    try {
      const discountCode = EmailAutomationService.generateDiscountCode('BDAY');
      const expiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();

      const success = await EmailAutomationService.sendDiscountVoucherEmail({
        firstName: user.firstName,
        discountCode,
        discountPercentage: 20,
        expiryDate,
        reason: 'birthday',
      }, user.email);

      if (success) successCount++;
      else failureCount++;

    } catch (error) {
      console.error(`Failed to send birthday discount to ${user.email}:`, error);
      failureCount++;
    }
  }

  return {
    type: 'birthday-discounts',
    totalUsers: birthdayUsers.length,
    successCount,
    failureCount,
  };
}

async function sendWinbackCampaign() {
  console.log('Starting winback campaign...');

  // In a real app, query for users who haven't purchased in 60+ days
  const inactiveUsers: { email: string; firstName: string; lastPurchase: string }[] = [
    // Example: { email: 'user@example.com', firstName: 'John', lastPurchase: '2023-01-15' }
  ];

  let successCount = 0;
  let failureCount = 0;

  for (const user of inactiveUsers) {
    try {
      const discountCode = EmailAutomationService.generateDiscountCode('BACK');
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

      const success = await EmailAutomationService.sendDiscountVoucherEmail({
        firstName: user.firstName,
        discountCode,
        discountPercentage: 25,
        expiryDate,
        reason: 'winback',
        minOrderAmount: 50,
      }, user.email);

      if (success) successCount++;
      else failureCount++;

    } catch (error) {
      console.error(`Failed to send winback email to ${user.email}:`, error);
      failureCount++;
    }
  }

  return {
    type: 'winback-campaign',
    totalUsers: inactiveUsers.length,
    successCount,
    failureCount,
  };
}

async function sendSeasonalPromotion() {
  console.log('Starting seasonal promotion...');

  // In a real app, get all active subscribers
  const subscribers: { email: string; firstName: string }[] = [
    // Example: { email: 'user@example.com', firstName: 'John' }
  ];

  const currentMonth = new Date().getMonth();
  const seasonName = currentMonth >= 2 && currentMonth <= 4 ? 'Spring' :
    currentMonth >= 5 && currentMonth <= 7 ? 'Summer' :
      currentMonth >= 8 && currentMonth <= 10 ? 'Fall' : 'Winter';

  let successCount = 0;
  let failureCount = 0;

  for (const subscriber of subscribers) {
    try {
      const discountCode = EmailAutomationService.generateDiscountCode('SEASON');
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

      const success = await EmailAutomationService.sendDiscountVoucherEmail({
        firstName: subscriber.firstName,
        discountCode,
        discountPercentage: 15,
        expiryDate,
        reason: 'seasonal',
      }, subscriber.email);

      if (success) successCount++;
      else failureCount++;

    } catch (error) {
      console.error(`Failed to send seasonal promotion to ${subscriber.email}:`, error);
      failureCount++;
    }
  }

  return {
    type: 'seasonal-promotion',
    season: seasonName,
    totalSubscribers: subscribers.length,
    successCount,
    failureCount,
  };
}
