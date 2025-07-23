import { prisma } from './prisma';

export interface AutoDiscount {
  code: string;
  percentage: number;
  isValid: boolean;
  reason: string;
  expiryDate?: string;
}

export class AutoDiscountService {

  // Check if user has any valid discount codes based on their email
  static async checkUserDiscounts(email: string): Promise<AutoDiscount | null> {
    try {
      if (!email) return null;

      // Check database for valid discount codes for this email
      const validDiscount = await prisma.discountCode.findFirst({
        where: {
          email: email,
          isValid: true,
          expiryDate: {
            gte: new Date(), // Not expired
          },
        },
        orderBy: {
          percentage: 'desc', // Get the highest percentage discount
        },
      });

      if (validDiscount) {
        return {
          code: validDiscount.code,
          percentage: validDiscount.percentage,
          isValid: true,
          reason: validDiscount.reason || 'Email discount',
          expiryDate: validDiscount.expiryDate?.toLocaleDateString(),
        };
      }

      // Check for first-time user discount (if no previous orders)
      const hasOrders = await prisma.order.findFirst({
        where: {
          user: {
            email: email
          }
        },
      });

      if (!hasOrders) {
        // First-time user - create and return welcome discount
        const welcomeCode = this.generateWelcomeCode(email);

        // Store in database
        await this.storeDiscountCode(welcomeCode, email, 15, 30, 'first-time');

        return {
          code: welcomeCode,
          percentage: 15,
          isValid: true,
          reason: 'Welcome! First-time customer discount',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        };
      }

      return null;
    } catch (error) {
      console.error('Error checking user discounts:', error);
      return null;
    }
  }

  // Generate welcome discount code
  private static generateWelcomeCode(email: string): string {
    const emailPrefix = email.split('@')[0].slice(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `WELCOME${emailPrefix}${timestamp}`;
  }

  // Store discount code in database
  private static async storeDiscountCode(
    code: string,
    email: string,
    percentage: number,
    validDays: number,
    reason: string
  ): Promise<void> {
    try {
      const expiryDate = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000);

      await prisma.discountCode.create({
        data: {
          code,
          email,
          percentage,
          isValid: true,
          expiryDate,
          reason,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error storing discount code:', error);
    }
  }

  // Auto-apply discount for checkout
  static async autoApplyDiscount(email: string, applyDiscountFunction: (code: string) => Promise<boolean>): Promise<boolean> {
    try {
      const discount = await this.checkUserDiscounts(email);

      if (discount && discount.isValid) {
        const applied = await applyDiscountFunction(discount.code);

        if (applied) {
          console.log(`Auto-applied discount ${discount.code} for ${email}`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error auto-applying discount:', error);
      return false;
    }
  }

  // Check for birthday discounts
  static async checkBirthdayDiscount(email: string, birthDate?: string): Promise<AutoDiscount | null> {
    try {
      if (!birthDate) return null;

      const today = new Date();
      const birth = new Date(birthDate);

      // Check if today is their birthday (month and day match)
      if (today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate()) {
        // Check if they already have a birthday discount this year
        const existingBirthdayDiscount = await prisma.discountCode.findFirst({
          where: {
            email: email,
            reason: 'birthday',
            createdAt: {
              gte: new Date(today.getFullYear(), 0, 1), // Start of this year
            },
          },
        });

        if (!existingBirthdayDiscount) {
          // Create birthday discount
          const birthdayCode = `BDAY${today.getFullYear()}${email.split('@')[0].slice(0, 3).toUpperCase()}`;

          await this.storeDiscountCode(birthdayCode, email, 20, 7, 'birthday');

          return {
            code: birthdayCode,
            percentage: 20,
            isValid: true,
            reason: '🎂 Happy Birthday! Special birthday discount',
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error checking birthday discount:', error);
      return null;
    }
  }

  // Mark discount as used
  static async markDiscountAsUsed(code: string, email: string): Promise<void> {
    try {
      await prisma.discountCode.updateMany({
        where: {
          code: code,
          email: email,
        },
        data: {
          isValid: false,
          usedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error marking discount as used:', error);
    }
  }

  // Get user's available discounts for display
  static async getUserAvailableDiscounts(email: string): Promise<AutoDiscount[]> {
    try {
      const discounts = await prisma.discountCode.findMany({
        where: {
          email: email,
          isValid: true,
          expiryDate: {
            gte: new Date(),
          },
        },
        orderBy: {
          percentage: 'desc',
        },
      });

      return discounts.map(discount => ({
        code: discount.code,
        percentage: discount.percentage,
        isValid: discount.isValid,
        reason: discount.reason || 'Email discount',
        expiryDate: discount.expiryDate?.toLocaleDateString(),
      }));
    } catch (error) {
      console.error('Error getting user discounts:', error);
      return [];
    }
  }
}
