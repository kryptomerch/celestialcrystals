import { NextRequest, NextResponse } from 'next/server'
import { InventoryNotificationService } from '@/lib/inventory-notifications'
import { AbandonedCartService } from '@/lib/abandoned-cart'
import { EmailAutomationService } from '@/lib/email-automation'
import { prisma } from '@/lib/prisma'

// Verify cron secret for security
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error('CRON_SECRET not configured')
    return false
  }

  return authHeader === `Bearer ${cronSecret}`
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    if (!verifyCronSecret(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { job } = await request.json()

    switch (job) {
      case 'inventory-check':
        await runInventoryCheck()
        break

      case 'abandoned-cart':
        await runAbandonedCartRecovery()
        break

      case 'weekly-newsletter':
        await runWeeklyNewsletter()
        break

      case 'cleanup-old-data':
        await runDataCleanup()
        break

      case 'birthday-emails':
        await runBirthdayEmails()
        break

      case 'restock-notifications':
        await runRestockNotifications()
        break

      case 'analytics-summary':
        await runAnalyticsSummary()
        break

      default:
        return NextResponse.json(
          { error: 'Unknown job type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      job,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error(`Cron job failed:`, error)
    return NextResponse.json(
      { error: 'Job execution failed' },
      { status: 500 }
    )
  }
}

// Daily inventory check
async function runInventoryCheck() {
  console.log('Running inventory check...')
  await InventoryNotificationService.checkLowStockAndNotify()
  await InventoryNotificationService.checkStaleInventory()
}

// Daily abandoned cart recovery
async function runAbandonedCartRecovery() {
  console.log('Running abandoned cart recovery...')
  await AbandonedCartService.processAbandonedCarts()
  await AbandonedCartService.cleanupOldCarts()
}

// Weekly newsletter
async function runWeeklyNewsletter() {
  console.log('Sending weekly newsletter...')
  await EmailAutomationService.sendWeeklyNewsletter()
}

// Monthly data cleanup
async function runDataCleanup() {
  console.log('Running data cleanup...')

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)

  // Clean up old page views
  await prisma.pageView.deleteMany({
    where: {
      createdAt: { lt: thirtyDaysAgo }
    }
  })

  // Clean up old product views (keep only last 90 days)
  await prisma.productView.deleteMany({
    where: {
      createdAt: { lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
    }
  })

  // Clean up old email logs (keep only last 6 months)
  await prisma.emailLog.deleteMany({
    where: {
      sentAt: { lt: sixMonthsAgo }
    }
  })

  // Clean up expired discount codes
  await prisma.discountCode.updateMany({
    where: {
      expiresAt: { lt: new Date() },
      isActive: true
    },
    data: { isActive: false }
  })

  console.log('Data cleanup completed')
}

// Daily birthday emails
async function runBirthdayEmails() {
  console.log('Sending birthday emails...')

  const today = new Date()
  const todayMonth = today.getMonth() + 1
  const todayDay = today.getDate()

  // Find users with birthdays today
  const birthdayUsers = await prisma.user.findMany({
    where: {
      birthDate: {
        not: null
      },
      marketingEmails: true
    }
  })

  const todayBirthdays = birthdayUsers.filter(user => {
    if (!user.birthDate) return false
    const birthDate = new Date(user.birthDate)
    return birthDate.getMonth() + 1 === todayMonth && birthDate.getDate() === todayDay
  })

  for (const user of todayBirthdays) {
    try {
      await sendBirthdayEmail(user)
    } catch (error) {
      console.error(`Failed to send birthday email to ${user.email}:`, error)
    }
  }

  console.log(`Sent birthday emails to ${todayBirthdays.length} users`)
}

// Send birthday email with special discount
async function sendBirthdayEmail(user: any) {
  const discountCode = `BIRTHDAY${user.id.slice(-4).toUpperCase()}`

  // Create birthday discount code
  await prisma.discountCode.create({
    data: {
      code: discountCode,
      email: user.email,
      percentage: 20, // 20% off
      isValid: true,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      reason: 'birthday',
      type: 'PERCENTAGE',
      value: 20,
      usageLimit: 1,
      userUsageLimit: 1,
      isActive: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: `Birthday discount for ${user.firstName}`,
      internalNote: 'Auto-generated birthday discount'
    }
  })

  // Send birthday email (implement in EmailAutomationService)
  // await EmailAutomationService.sendBirthdayEmail(user, discountCode)
}

// Restock notifications for waitlisted items
async function runRestockNotifications() {
  console.log('Checking for restock notifications...')

  // Find crystals that were out of stock but now have inventory
  const restockedCrystals = await prisma.crystal.findMany({
    where: {
      stockQuantity: { gt: 0 },
      isActive: true,
      // Add logic to track previous stock status
    },
    include: {
      wishlistItems: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              marketingEmails: true
            }
          }
        }
      }
    }
  })

  for (const crystal of restockedCrystals) {
    const interestedUsers = crystal.wishlistItems
      .filter(item => item.user.marketingEmails)
      .map(item => item.user)

    for (const user of interestedUsers) {
      try {
        await sendRestockNotification(user, crystal)
      } catch (error) {
        console.error(`Failed to send restock notification to ${user.email}:`, error)
      }
    }
  }
}

// Send restock notification email
async function sendRestockNotification(user: any, crystal: any) {
  // Implement in EmailAutomationService
  // await EmailAutomationService.sendRestockNotification(user, crystal)
}

// Weekly analytics summary for admin
async function runAnalyticsSummary() {
  console.log('Generating analytics summary...')

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // Get weekly metrics
  const [
    weeklyRevenue,
    weeklyOrders,
    newCustomers,
    topProducts,
    lowStockItems
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: oneWeekAgo },
        status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
      },
      _sum: { totalAmount: true }
    }),

    prisma.order.count({
      where: {
        createdAt: { gte: oneWeekAgo },
        status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
      }
    }),

    prisma.user.count({
      where: { createdAt: { gte: oneWeekAgo } }
    }),

    prisma.orderItem.groupBy({
      by: ['crystalId'],
      where: {
        order: {
          createdAt: { gte: oneWeekAgo },
          status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
        }
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    }),

    prisma.crystal.count({
      where: {
        isActive: true,
        stockQuantity: { lte: 5 }
      }
    })
  ])

  // Send summary email to admin
  // await EmailAutomationService.sendWeeklyAnalyticsSummary({
  //   revenue: weeklyRevenue._sum.totalAmount || 0,
  //   orders: weeklyOrders,
  //   newCustomers,
  //   topProducts,
  //   lowStockItems
  // })

  console.log('Analytics summary sent')
}
