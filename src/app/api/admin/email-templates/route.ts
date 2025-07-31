import { NextRequest, NextResponse } from 'next/server';
import { generateWelcomeEmail } from '@/lib/email-templates/welcome';
import { generateNewsletterEmail } from '@/lib/email-templates/newsletter';
import { generateDiscountVoucherEmail } from '@/lib/email-templates/discount-voucher';
import { EmailAutomationService } from '@/lib/email-automation';
import { sendEmail } from '@/lib/email';

// Get email template previews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateType = searchParams.get('type');

    if (templateType) {
      // Return specific template preview
      let templateData;

      switch (templateType) {
        case 'welcome':
          templateData = generateWelcomeEmail({
            firstName: 'John',
            email: 'john@example.com',
            discountCode: 'WELCOME15'
          });
          break;

        case 'newsletter':
          templateData = generateNewsletterEmail({
            firstName: 'John',
            weekNumber: 1,
            featuredCrystal: {
              name: 'Amethyst',
              description: 'A powerful stone of spiritual protection',
              properties: ['Spiritual Protection', 'Intuition', 'Clarity'],
              price: 34,
              url: 'https://thecelestial.xyz/crystals/amethyst'
            },
            moonPhase: EmailAutomationService.getCurrentMoonPhase(),
            crystalTip: EmailAutomationService.getCrystalTipOfWeek(),
            specialOffer: {
              title: 'Weekly Special',
              description: '15% off all crystals',
              code: 'WEEKLY15',
              discount: '15%',
              expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
            }
          });
          break;

        case 'discount':
          templateData = generateDiscountVoucherEmail({
            firstName: 'John',
            discountCode: 'SAVE20',
            discountPercentage: 20,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            reason: 'seasonal'
          });
          break;

        default:
          return NextResponse.json({
            success: false,
            error: 'Invalid template type'
          }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        template: {
          type: templateType,
          subject: templateData.subject,
          html: templateData.html,
          text: templateData.text
        }
      });
    }

    // Return all available templates
    const templates = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        description: 'Sent to new users with discount code',
        category: 'Onboarding',
        variables: ['firstName', 'email', 'discountCode']
      },
      {
        id: 'newsletter',
        name: 'Weekly Newsletter',
        description: 'Weekly crystal wisdom and featured products',
        category: 'Marketing',
        variables: ['firstName', 'featuredCrystal', 'moonPhase', 'crystalTip', 'specialOffer']
      },
      {
        id: 'discount',
        name: 'Discount Voucher',
        description: 'Special discount offers and promotions',
        category: 'Promotional',
        variables: ['firstName', 'discountCode', 'discountPercentage', 'expiryDate', 'reason']
      }
    ];

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('❌ Error fetching email templates:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch email templates',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Send test email
export async function POST(request: NextRequest) {
  try {
    const { templateType, testEmail, customData } = await request.json();

    if (!templateType || !testEmail) {
      return NextResponse.json({
        success: false,
        error: 'Template type and test email are required'
      }, { status: 400 });
    }

    console.log('📧 Sending test email:', { templateType, testEmail });

    // Generate the email template
    let templateData;

    try {

      switch (templateType) {
        case 'welcome':
          templateData = generateWelcomeEmail({
            firstName: customData?.firstName || 'Test User',
            email: testEmail,
            discountCode: customData?.discountCode || 'TEST15'
          });
          break;

        case 'newsletter':
          templateData = generateNewsletterEmail({
            firstName: customData?.firstName || 'Test User',
            weekNumber: 1,
            featuredCrystal: {
              name: 'Amethyst',
              description: 'A powerful stone of spiritual protection',
              properties: ['Spiritual Protection', 'Intuition', 'Clarity'],
              price: 34,
              url: 'https://thecelestial.xyz/crystals/amethyst'
            },
            moonPhase: EmailAutomationService.getCurrentMoonPhase(),
            crystalTip: EmailAutomationService.getCrystalTipOfWeek(),
            specialOffer: {
              title: 'Weekly Special',
              description: '15% off all crystals',
              code: 'WEEKLY15',
              discount: '15%',
              expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
            }
          });
          break;

        case 'discount':
          templateData = generateDiscountVoucherEmail({
            firstName: customData?.firstName || 'Test User',
            discountCode: customData?.discountCode || 'SAVE20',
            discountPercentage: customData?.discountPercentage || 20,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            reason: customData?.reason || 'seasonal'
          });
          break;

        default:
          return NextResponse.json({
            success: false,
            error: 'Invalid template type'
          }, { status: 400 });
      }
    } catch (templateError) {
      console.error('❌ Error generating template:', templateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to generate email template',
        details: templateError instanceof Error ? templateError.message : 'Unknown template error'
      }, { status: 500 });
    }

    // Send the actual email
    try {
      const emailResult = await sendEmail({
        to: testEmail,
        subject: `[TEST] ${templateData.subject}`,
        html: templateData.html,
        text: templateData.text
      });

      if (emailResult.success) {
        return NextResponse.json({
          success: true,
          message: `Test email sent successfully to ${testEmail}`,
          result: {
            sent: true,
            templateType,
            testEmail,
            subject: templateData.subject,
            timestamp: new Date().toISOString(),
            emailId: emailResult.id
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to send test email',
          details: emailResult.error
        }, { status: 500 });
      }
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      return NextResponse.json({
        success: false,
        error: 'Failed to send test email',
        details: emailError instanceof Error ? emailError.message : 'Unknown email error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
