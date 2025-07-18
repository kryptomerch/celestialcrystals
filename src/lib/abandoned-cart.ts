import { prisma } from './prisma'
import { sendEmail, createEmailTemplate } from './email'

export class AbandonedCartService {
  
  // Find abandoned carts and send recovery emails
  static async processAbandonedCarts(): Promise<void> {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      // Find users with items in cart but no recent orders
      const abandonedCarts = await prisma.user.findMany({
        where: {
          cartItems: {
            some: {
              updatedAt: {
                gte: oneWeekAgo,
                lte: oneDayAgo
              }
            }
          },
          orders: {
            none: {
              createdAt: {
                gte: oneDayAgo
              }
            }
          }
        },
        include: {
          cartItems: {
            where: {
              updatedAt: {
                gte: oneWeekAgo,
                lte: oneDayAgo
              }
            },
            include: {
              crystal: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                  stockQuantity: true,
                  isActive: true
                }
              }
            }
          }
        }
      })

      for (const user of abandonedCarts) {
        if (user.cartItems.length > 0) {
          const daysSinceLastUpdate = Math.floor(
            (Date.now() - user.cartItems[0].updatedAt.getTime()) / (24 * 60 * 60 * 1000)
          )

          // Send different emails based on how long ago cart was abandoned
          if (daysSinceLastUpdate === 1) {
            await this.sendFirstReminderEmail(user, user.cartItems)
          } else if (daysSinceLastUpdate === 3) {
            await this.sendSecondReminderEmail(user, user.cartItems)
          } else if (daysSinceLastUpdate === 7) {
            await this.sendFinalReminderEmail(user, user.cartItems)
          }
        }
      }

      console.log(`Processed ${abandonedCarts.length} abandoned carts`)
    } catch (error) {
      console.error('Abandoned cart processing failed:', error)
    }
  }

  // First reminder - gentle nudge
  private static async sendFirstReminderEmail(user: any, cartItems: any[]): Promise<void> {
    const totalValue = cartItems.reduce((sum, item) => sum + (item.crystal.price * item.quantity), 0)
    const formatPrice = (price: number) => `$${price.toFixed(2)}`

    const cartItemsHtml = cartItems.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center;">
            <div style="width: 60px; height: 60px; background-color: #f3f4f6; border-radius: 8px; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
              ✨
            </div>
            <div>
              <div style="font-weight: 500; color: #111827;">${item.crystal.name}</div>
              <div style="color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${formatPrice(item.crystal.price * item.quantity)}
        </td>
      </tr>
    `).join('')

    const content = `
      <h1>✨ Your crystals are waiting for you!</h1>
      
      <p>Hi ${user.firstName || 'there'},</p>
      
      <p>We noticed you left some beautiful crystals in your cart. Don't let these powerful stones slip away!</p>
      
      <div class="highlight">
        <h3>🛒 Your Cart (${cartItems.length} item${cartItems.length === 1 ? '' : 's'})</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          ${cartItemsHtml}
          <tr style="background-color: #f9fafb;">
            <td style="padding: 12px; font-weight: bold;">Total</td>
            <td style="padding: 12px; text-align: right; font-weight: bold;">${formatPrice(totalValue)}</td>
          </tr>
        </table>
      </div>
      
      <p>These crystals are ready to bring their healing energy into your life. Complete your purchase now before they're gone!</p>
      
      <a href="${process.env.NEXTAUTH_URL}/cart" class="button">
        Complete Your Purchase
      </a>
      
      <p>Need help choosing? Our crystal experts are here to guide you on your spiritual journey.</p>
      
      <p>With love and light,<br>The Celestial Crystals Team</p>
    `

    const html = createEmailTemplate(content, 'Your crystals are waiting! ✨')
    const text = `
      Hi ${user.firstName || 'there'},
      
      You left ${cartItems.length} item${cartItems.length === 1 ? '' : 's'} in your cart worth ${formatPrice(totalValue)}.
      
      Complete your purchase: ${process.env.NEXTAUTH_URL}/cart
      
      The Celestial Crystals Team
    `

    await sendEmail({
      to: user.email,
      subject: '✨ Your crystals are waiting for you!',
      html,
      text
    })
  }

  // Second reminder - with incentive
  private static async sendSecondReminderEmail(user: any, cartItems: any[]): Promise<void> {
    const totalValue = cartItems.reduce((sum, item) => sum + (item.crystal.price * item.quantity), 0)
    const formatPrice = (price: number) => `$${price.toFixed(2)}`
    const discountAmount = Math.min(totalValue * 0.1, 20) // 10% off up to $20

    const content = `
      <h1>🎁 Special offer just for you!</h1>
      
      <p>Hi ${user.firstName || 'there'},</p>
      
      <p>Your crystals are still waiting, and we want to make sure you don't miss out on their transformative energy.</p>
      
      <div class="highlight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h2 style="color: white; margin: 0 0 10px 0;">🌟 Exclusive 10% Off</h2>
        <p style="color: white; margin: 0; font-size: 18px;">Save ${formatPrice(discountAmount)} on your cart!</p>
        <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Use code: <strong>CRYSTAL10</strong></p>
      </div>
      
      <p>Your cart total: <strong>${formatPrice(totalValue)}</strong><br>
      With discount: <strong>${formatPrice(totalValue - discountAmount)}</strong></p>
      
      <p>This exclusive offer expires in 24 hours, so don't wait too long!</p>
      
      <a href="${process.env.NEXTAUTH_URL}/cart?discount=CRYSTAL10" class="button">
        Claim Your Discount
      </a>
      
      <p><small>Discount code CRYSTAL10 is valid for 24 hours and applies to your current cart items.</small></p>
    `

    const html = createEmailTemplate(content, 'Special 10% off your crystals! 🎁')

    await sendEmail({
      to: user.email,
      subject: '🎁 Special 10% off your crystals - Limited time!',
      html,
      text: `Special offer: 10% off your cart with code CRYSTAL10. Expires in 24 hours. Complete your purchase: ${process.env.NEXTAUTH_URL}/cart?discount=CRYSTAL10`
    })
  }

  // Final reminder - last chance
  private static async sendFinalReminderEmail(user: any, cartItems: any[]): Promise<void> {
    const totalValue = cartItems.reduce((sum, item) => sum + (item.crystal.price * item.quantity), 0)
    const formatPrice = (price: number) => `$${price.toFixed(2)}`

    // Check if any items are low stock
    const lowStockItems = cartItems.filter(item => 
      item.crystal.stockQuantity <= 5 && item.crystal.stockQuantity > 0
    )

    const urgencyMessage = lowStockItems.length > 0 
      ? `⚠️ <strong>Hurry!</strong> ${lowStockItems.length} item${lowStockItems.length === 1 ? '' : 's'} in your cart ${lowStockItems.length === 1 ? 'is' : 'are'} running low on stock.`
      : ''

    const content = `
      <h1>⏰ Last chance for your crystals</h1>
      
      <p>Hi ${user.firstName || 'there'},</p>
      
      <p>This is our final reminder about the crystals waiting in your cart. We don't want you to miss out on their healing energy!</p>
      
      ${urgencyMessage ? `<div class="highlight" style="background-color: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">${urgencyMessage}</div>` : ''}
      
      <p>Your cart contains ${cartItems.length} carefully selected crystal${cartItems.length === 1 ? '' : 's'} worth ${formatPrice(totalValue)}.</p>
      
      <p>If you're not ready to purchase now, we understand. You can always:</p>
      <ul>
        <li>💝 Move items to your wishlist for later</li>
        <li>📧 Contact us with any questions</li>
        <li>🔍 Browse our crystal guides for more information</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXTAUTH_URL}/cart" class="button" style="margin-right: 10px;">
          Complete Purchase
        </a>
        <a href="${process.env.NEXTAUTH_URL}/wishlist" class="button-outline">
          Save to Wishlist
        </a>
      </div>
      
      <p>Thank you for considering Celestial Crystals for your spiritual journey.</p>
      
      <p>Blessings,<br>The Celestial Crystals Team</p>
      
      <p><small>Don't want these reminders? <a href="${process.env.NEXTAUTH_URL}/unsubscribe">Unsubscribe here</a></small></p>
    `

    const html = createEmailTemplate(content, 'Last chance for your crystals ⏰')

    await sendEmail({
      to: user.email,
      subject: '⏰ Last chance - Your crystals are waiting',
      html,
      text: `Final reminder: Your cart has ${cartItems.length} items worth ${formatPrice(totalValue)}. Complete your purchase: ${process.env.NEXTAUTH_URL}/cart`
    })
  }

  // Clean up old abandoned carts
  static async cleanupOldCarts(): Promise<void> {
    try {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

      // Remove cart items older than 2 weeks with no associated orders
      const deletedItems = await prisma.cartItem.deleteMany({
        where: {
          updatedAt: { lt: twoWeeksAgo },
          user: {
            orders: {
              none: {
                createdAt: { gte: twoWeeksAgo }
              }
            }
          }
        }
      })

      console.log(`Cleaned up ${deletedItems.count} old cart items`)
    } catch (error) {
      console.error('Cart cleanup failed:', error)
    }
  }
}
