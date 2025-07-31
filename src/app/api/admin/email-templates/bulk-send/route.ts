import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function isAdminEmail(email: string): boolean {
  const adminEmails = ['dhruvshah8888@gmail.com', 'admin@celestialcrystals.com'];
  return adminEmails.includes(email.toLowerCase());
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { subject, html } = await request.json();

    if (!subject || !html) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
    }

    // Get all users who have opted in for marketing emails
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { marketingEmails: true },
          { newsletterSubscribed: true }
        ]
      },
      select: {
        email: true,
        firstName: true,
        lastName: true
      }
    });

    // Get all email subscribers
    const subscribers = await prisma.emailSubscriber.findMany({
      where: {
        isActive: true,
        OR: [
          { newsletter: true },
          { promotions: true }
        ]
      },
      select: {
        email: true,
        firstName: true,
        lastName: true
      }
    });

    // Combine and deduplicate emails
    const allRecipients = new Map();

    users.forEach(user => {
      allRecipients.set(user.email, {
        email: user.email,
        firstName: user.firstName || 'Valued Customer',
        lastName: user.lastName || ''
      });
    });

    subscribers.forEach(subscriber => {
      if (!allRecipients.has(subscriber.email)) {
        allRecipients.set(subscriber.email, {
          email: subscriber.email,
          firstName: subscriber.firstName || 'Valued Customer',
          lastName: subscriber.lastName || ''
        });
      }
    });

    const recipients = Array.from(allRecipients.values());

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients found' }, { status: 400 });
    }

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const emailPromises = batch.map(async (recipient) => {
        try {
          // Personalize the content
          let personalizedHtml = html
            .replace(/\{firstName\}/g, recipient.firstName)
            .replace(/\{lastName\}/g, recipient.lastName)
            .replace(/\{email\}/g, recipient.email);

          await resend.emails.send({
            from: 'Celestial Crystals <noreply@celestialcrystals.com>',
            to: recipient.email,
            subject: subject,
            html: personalizedHtml,
          });

          // Log the email
          await prisma.emailLog.create({
            data: {
              email: recipient.email,
              subject: subject,
              template: 'bulk-email',
              status: 'SENT',
              provider: 'resend'
            }
          });

          return { success: true, email: recipient.email };
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);

          // Log the failed email
          await prisma.emailLog.create({
            data: {
              email: recipient.email,
              subject: subject,
              template: 'bulk-email',
              status: 'FAILED',
              provider: 'resend',
              errorMessage: error instanceof Error ? error.message : 'Unknown error'
            }
          });

          return { success: false, email: recipient.email };
        }
      });

      const results = await Promise.all(emailPromises);

      results.forEach(result => {
        if (result.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      });

      // Add a small delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      count: sentCount,
      failed: failedCount,
      total: recipients.length,
      message: `Successfully sent ${sentCount} emails${failedCount > 0 ? `, ${failedCount} failed` : ''}`
    });

  } catch (error) {
    console.error('Error sending bulk email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
