import { prisma } from './prisma'
import { sendEmail, createEmailTemplate } from './email'
import { generateWelcomeEmail, WelcomeEmailData } from './email-templates/welcome';
import { generateOrderConfirmationEmail, OrderConfirmationData } from './email-templates/order-confirmation';
import { generateNewsletterEmail, NewsletterData } from './email-templates/newsletter';
import { generateDiscountVoucherEmail, DiscountVoucherData } from './email-templates/discount-voucher';

// Email automation service
export class EmailAutomationService {

  // Send welcome email with first-time discount
  static async sendWelcomeEmail(userData: WelcomeEmailData): Promise<boolean> {
    try {
      const discountCode = userData.discountCode || `WELCOME${Date.now().toString().slice(-4)}`;
      const emailData = { ...userData, discountCode };
      const emailContent = generateWelcomeEmail(emailData);

      const success = await sendEmail({
        to: userData.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (success) {
        console.log(`Welcome email sent to ${userData.email}`);
        // Store discount code in database for validation
        await this.storeDiscountCode(discountCode, userData.email, 15, 30);
      }

      return success;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  // Send order confirmation email
  static async sendOrderConfirmationEmail(orderData: OrderConfirmationData): Promise<boolean> {
    try {
      const emailContent = generateOrderConfirmationEmail(orderData);

      const success = await sendEmail({
        to: orderData.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (success) {
        console.log(`Order confirmation sent to ${orderData.email} for order ${orderData.orderNumber}`);
      }

      return success;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  // Send weekly newsletter
  static async sendNewsletterEmail(subscriberData: NewsletterData): Promise<boolean> {
    try {
      const emailContent = generateNewsletterEmail(subscriberData);

      const success = await sendEmail({
        to: subscriberData.firstName, // This should be the email address
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (success) {
        console.log(`Newsletter sent to subscriber`);
      }

      return success;
    } catch (error) {
      console.error('Failed to send newsletter email:', error);
      return false;
    }
  }

  // Send discount voucher email
  static async sendDiscountVoucherEmail(voucherData: DiscountVoucherData, email: string): Promise<boolean> {
    try {
      const emailContent = generateDiscountVoucherEmail(voucherData);

      const success = await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (success) {
        console.log(`Discount voucher sent to ${email}`);
        // Store discount code in database
        await this.storeDiscountCode(
          voucherData.discountCode,
          email,
          voucherData.discountPercentage,
          this.getDaysUntilExpiry(voucherData.expiryDate)
        );
      }

      return success;
    } catch (error) {
      console.error('Failed to send discount voucher email:', error);
      return false;
    }
  }

  // Generate discount codes
  static generateDiscountCode(prefix: string = 'SAVE'): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${random}${timestamp}`;
  }

  // Get current moon phase (simplified)
  static getCurrentMoonPhase(): string {
    const phases = ['New Moon', 'Waxing Moon', 'Full Moon', 'Waning Moon'];
    const dayOfMonth = new Date().getDate();
    const phaseIndex = Math.floor((dayOfMonth - 1) / 7.5);
    return phases[Math.min(phaseIndex, 3)];
  }

  // Get crystal tip of the week
  static getCrystalTipOfWeek(): string {
    const tips = [
      "Place crystals on your windowsill during a full moon to charge them with lunar energy.",
      "Hold your crystal while setting intentions to amplify your manifestation power.",
      "Create a crystal grid by arranging stones in geometric patterns for focused energy work.",
      "Carry a small crystal in your pocket as a daily reminder of your goals and intentions.",
      "Meditate with crystals by placing them on corresponding chakra points for deeper healing.",
      "Cleanse your crystals weekly with sage smoke or by placing them on a selenite charging plate.",
      "Program your crystals by holding them and clearly stating your intention three times.",
      "Use crystal-infused water by placing clean stones in a glass of water overnight (research safety first)."
    ];

    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return tips[weekNumber % tips.length];
  }

  // Store discount code (placeholder - implement with your database)
  private static async storeDiscountCode(
    code: string,
    email: string,
    percentage: number,
    validDays: number
  ): Promise<void> {
    // In a real application, store this in your database
    console.log(`Storing discount code: ${code} for ${email}, ${percentage}% off, valid for ${validDays} days`);

    // Example structure for database storage:
    // {
    //   code,
    //   email,
    //   percentage,
    //   expiryDate: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000),
    //   used: false,
    //   createdAt: new Date()
    // }
  }

  // Calculate days until expiry
  private static getDaysUntilExpiry(expiryDate: string): number {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Send birthday discount (to be called by cron job)
  static async sendBirthdayDiscounts(): Promise<void> {
    // This would query your database for users with birthdays today
    console.log('Checking for birthday discounts...');

    // Example implementation:
    // const birthdayUsers = await getUsersWithBirthdayToday();
    // for (const user of birthdayUsers) {
    //   const discountCode = this.generateDiscountCode('BDAY');
    //   const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    //   
    //   await this.sendDiscountVoucherEmail({
    //     firstName: user.firstName,
    //     discountCode,
    //     discountPercentage: 20,
    //     expiryDate,
    //     reason: 'birthday'
    //   }, user.email);
    // }
  }

  // Send weekly newsletter (to be called by cron job)
  static async sendWeeklyNewsletter(): Promise<void> {
    console.log('Sending weekly newsletter...');

    // This would query your database for newsletter subscribers
    // const subscribers = await getNewsletterSubscribers();
    // const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    // 
    // for (const subscriber of subscribers) {
    //   const newsletterData: NewsletterData = {
    //     firstName: subscriber.firstName,
    //     weekNumber,
    //     featuredCrystal: await getFeaturedCrystalOfWeek(),
    //     moonPhase: this.getCurrentMoonPhase(),
    //     crystalTip: this.getCrystalTipOfWeek(),
    //     specialOffer: await getCurrentSpecialOffer()
    //   };
    //   
    //   await this.sendNewsletterEmail(newsletterData);
    // }
  }
}
