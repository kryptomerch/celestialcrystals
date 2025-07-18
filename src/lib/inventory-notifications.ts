import { prisma } from './prisma'
import { sendEmail, createEmailTemplate } from './email'

export class InventoryNotificationService {
  
  // Check for low stock items and send notifications
  static async checkLowStockAndNotify(): Promise<void> {
    try {
      // Get items with low stock
      const lowStockItems = await prisma.crystal.findMany({
        where: {
          isActive: true,
          stockQuantity: {
            lte: prisma.crystal.fields.lowStockThreshold,
            gt: 0
          }
        },
        select: {
          id: true,
          name: true,
          stockQuantity: true,
          lowStockThreshold: true,
          price: true,
          _count: {
            select: {
              orderItems: {
                where: {
                  order: {
                    createdAt: {
                      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                  }
                }
              }
            }
          }
        }
      })

      // Get out of stock items
      const outOfStockItems = await prisma.crystal.findMany({
        where: {
          isActive: true,
          stockQuantity: 0
        },
        select: {
          id: true,
          name: true,
          price: true,
          _count: {
            select: {
              orderItems: {
                where: {
                  order: {
                    createdAt: {
                      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                  }
                }
              }
            }
          }
        }
      })

      if (lowStockItems.length > 0 || outOfStockItems.length > 0) {
        await this.sendLowStockNotification(lowStockItems, outOfStockItems)
      }

      console.log(`Inventory check completed: ${lowStockItems.length} low stock, ${outOfStockItems.length} out of stock`)
    } catch (error) {
      console.error('Low stock check failed:', error)
    }
  }

  // Send low stock notification email
  private static async sendLowStockNotification(
    lowStockItems: any[],
    outOfStockItems: any[]
  ): Promise<void> {
    const formatPrice = (price: number) => `$${price.toFixed(2)}`

    const lowStockTable = lowStockItems.length > 0 ? `
      <h3 style="color: #f59e0b; margin: 20px 0 10px 0;">⚠️ Low Stock Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Product</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Current Stock</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Threshold</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">30-Day Sales</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${lowStockItems.map(item => `
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.name}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb; color: #f59e0b; font-weight: bold;">${item.stockQuantity}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.lowStockThreshold}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${item._count.orderItems}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${formatPrice(item.price)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''

    const outOfStockTable = outOfStockItems.length > 0 ? `
      <h3 style="color: #ef4444; margin: 20px 0 10px 0;">🚫 Out of Stock Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Product</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">30-Day Sales</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${outOfStockItems.map(item => `
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.name}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${item._count.orderItems}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${formatPrice(item.price)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''

    const content = `
      <h1>📦 Inventory Alert - Celestial Crystals</h1>
      
      <p>This is an automated inventory alert for items that need attention:</p>
      
      <div class="highlight">
        <h3>📊 Summary</h3>
        <ul>
          <li><strong>Low Stock Items:</strong> ${lowStockItems.length}</li>
          <li><strong>Out of Stock Items:</strong> ${outOfStockItems.length}</li>
          <li><strong>Alert Date:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
      </div>
      
      ${lowStockTable}
      ${outOfStockTable}
      
      <h3>📋 Recommended Actions</h3>
      <ul>
        <li>Review sales velocity for out-of-stock items with high demand</li>
        <li>Consider increasing stock levels for consistently low-stock items</li>
        <li>Update low stock thresholds based on sales patterns</li>
        <li>Contact suppliers for restocking popular items</li>
      </ul>
      
      <a href="${process.env.NEXTAUTH_URL}/admin/inventory" class="button">
        Manage Inventory
      </a>
      
      <p><small>This alert was generated automatically. You can adjust notification settings in the admin panel.</small></p>
    `

    const html = createEmailTemplate(content, 'Inventory Alert - Low Stock Items')
    const text = `
      Inventory Alert - Celestial Crystals
      
      Low Stock Items: ${lowStockItems.length}
      Out of Stock Items: ${outOfStockItems.length}
      
      Please review the inventory management dashboard to take appropriate action.
      
      ${process.env.NEXTAUTH_URL}/admin/inventory
    `

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@celestialcrystals.com',
      subject: `🚨 Inventory Alert: ${lowStockItems.length + outOfStockItems.length} items need attention`,
      html,
      text
    })
  }

  // Check for items that haven't been restocked in a while
  static async checkStaleInventory(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const staleItems = await prisma.crystal.findMany({
        where: {
          isActive: true,
          stockQuantity: { gt: 0 },
          updatedAt: { lt: thirtyDaysAgo }
        },
        include: {
          _count: {
            select: {
              orderItems: {
                where: {
                  order: {
                    createdAt: { gte: thirtyDaysAgo }
                  }
                }
              }
            }
          }
        }
      })

      // Filter items with no recent sales
      const noSalesItems = staleItems.filter(item => item._count.orderItems === 0)

      if (noSalesItems.length > 0) {
        await this.sendStaleInventoryNotification(noSalesItems)
      }
    } catch (error) {
      console.error('Stale inventory check failed:', error)
    }
  }

  private static async sendStaleInventoryNotification(staleItems: any[]): Promise<void> {
    const content = `
      <h1>📊 Stale Inventory Report</h1>
      
      <p>The following items have not had any sales in the past 30 days and may need attention:</p>
      
      <div class="highlight">
        <h3>📈 Items with No Recent Sales</h3>
        <p><strong>Count:</strong> ${staleItems.length} items</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Product</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Stock</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Price</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          ${staleItems.map(item => `
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.name}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.stockQuantity}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">$${item.price.toFixed(2)}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${new Date(item.updatedAt).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h3>💡 Recommendations</h3>
      <ul>
        <li>Consider promotional pricing for slow-moving items</li>
        <li>Review product descriptions and images</li>
        <li>Feature these items in newsletters or social media</li>
        <li>Bundle with popular items</li>
        <li>Consider discontinuing if consistently poor performance</li>
      </ul>
      
      <a href="${process.env.NEXTAUTH_URL}/admin/inventory" class="button">
        Review Inventory
      </a>
    `

    const html = createEmailTemplate(content, 'Stale Inventory Report')

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@celestialcrystals.com',
      subject: `📊 Stale Inventory Report: ${staleItems.length} items with no recent sales`,
      html,
      text: `Stale Inventory Report: ${staleItems.length} items have had no sales in the past 30 days.`
    })
  }

  // Automatic stock deduction when order is placed
  static async deductStock(orderItems: Array<{ crystalId: string; quantity: number }>): Promise<void> {
    try {
      for (const item of orderItems) {
        const crystal = await prisma.crystal.findUnique({
          where: { id: item.crystalId },
          select: { stockQuantity: true, name: true }
        })

        if (crystal && crystal.stockQuantity >= item.quantity) {
          const newQuantity = crystal.stockQuantity - item.quantity

          await prisma.$transaction([
            prisma.crystal.update({
              where: { id: item.crystalId },
              data: { stockQuantity: newQuantity }
            }),
            prisma.inventoryLog.create({
              data: {
                crystalId: item.crystalId,
                type: 'SALE',
                quantity: -item.quantity,
                previousQty: crystal.stockQuantity,
                newQty: newQuantity,
                reason: 'Order placed'
              }
            })
          ])

          console.log(`Stock deducted for ${crystal.name}: ${crystal.stockQuantity} -> ${newQuantity}`)
        }
      }
    } catch (error) {
      console.error('Stock deduction failed:', error)
      throw error
    }
  }
}
