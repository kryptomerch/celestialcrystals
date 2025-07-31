import { NextRequest, NextResponse } from 'next/server';
import { generateWelcomeEmail } from '@/lib/email-templates/welcome';
import { generateWeeklyCrystalWisdomEmail } from '@/lib/email-templates/weekly-crystal-wisdom';
import { generateSpecialOffersEmail } from '@/lib/email-templates/special-offers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get('template') || 'welcome';
    const firstName = searchParams.get('firstName') || 'Crystal';
    const email = searchParams.get('email') || 'crystal@example.com';
    const weekNumber = parseInt(searchParams.get('weekNumber') || '1');
    const offerType = searchParams.get('offerType') || 'flash-sale';

    let emailContent;

    switch (template) {
      case 'welcome':
        emailContent = generateWelcomeEmail({
          firstName,
          email,
          discountCode: 'WELCOME15'
        });
        break;

      case 'weekly-1':
      case 'weekly-2':
      case 'weekly-3':
      case 'weekly-4':
        const week = parseInt(template.split('-')[1]);
        emailContent = generateWeeklyCrystalWisdomEmail({
          firstName,
          email,
          weekNumber: week
        });
        break;

      case 'flash-sale':
        emailContent = generateSpecialOffersEmail({
          firstName,
          email,
          offerType: 'flash-sale'
        });
        break;

      case 'birthday':
        emailContent = generateSpecialOffersEmail({
          firstName,
          email,
          offerType: 'birthday'
        });
        break;

      default:
        emailContent = generateWelcomeEmail({
          firstName,
          email,
          discountCode: 'WELCOME15'
        });
    }

    // Return HTML content for preview
    const htmlContent = typeof emailContent === 'string' ? emailContent : emailContent.html;
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Error generating email preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate email preview' },
      { status: 500 }
    );
  }
}
