import { prisma } from '@/lib/prisma';

export interface NotificationData {
  type: 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'ORDER_CREATED' | 'LOW_STOCK' | 'NEW_USER' | 'REFUND_REQUESTED';
  title: string;
  message: string;
  data?: any;
}

export class NotificationService {
  static async createNotification(notification: NotificationData) {
    try {
      const result = await prisma.notification.create({
        data: {
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          isRead: false
        }
      });

      console.log(`📢 Notification created: ${notification.title}`);
      return result;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  }

  static async getUnreadNotifications() {
    try {
      return await prisma.notification.findMany({
        where: { isRead: false },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error);
      return [];
    }
  }

  static async getAllNotifications(limit = 100) {
    try {
      return await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  static async markAsRead(notificationId: string) {
    try {
      return await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return null;
    }
  }

  static async markAllAsRead() {
    try {
      return await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true }
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return null;
    }
  }

  static async deleteNotification(notificationId: string) {
    try {
      return await prisma.notification.delete({
        where: { id: notificationId }
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return null;
    }
  }

  // Helper methods for common notifications
  static async notifyPaymentSuccess(orderNumber: string, amount: number, customerEmail: string) {
    return this.createNotification({
      type: 'PAYMENT_SUCCESS',
      title: '💰 Payment Received',
      message: `Order ${orderNumber} - $${amount.toFixed(2)} from ${customerEmail}`,
      data: {
        orderNumber,
        amount,
        customerEmail,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async notifyPaymentFailed(paymentIntentId: string, amount: number, error: string) {
    return this.createNotification({
      type: 'PAYMENT_FAILED',
      title: '❌ Payment Failed',
      message: `Payment of $${amount.toFixed(2)} failed: ${error}`,
      data: {
        paymentIntentId,
        amount,
        error,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async notifyOrderCreated(orderNumber: string, customerName: string, itemCount: number, total: number) {
    return this.createNotification({
      type: 'ORDER_CREATED',
      title: '🛒 New Order',
      message: `Order ${orderNumber} from ${customerName} - ${itemCount} items, $${total.toFixed(2)}`,
      data: {
        orderNumber,
        customerName,
        itemCount,
        total,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async notifyLowStock(productName: string, currentStock: number, threshold: number) {
    return this.createNotification({
      type: 'LOW_STOCK',
      title: '⚠️ Low Stock Alert',
      message: `${productName} is running low (${currentStock} left, threshold: ${threshold})`,
      data: {
        productName,
        currentStock,
        threshold,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async notifyNewUser(userEmail: string, userName: string) {
    return this.createNotification({
      type: 'NEW_USER',
      title: '👤 New User Registration',
      message: `${userName} (${userEmail}) just registered`,
      data: {
        userEmail,
        userName,
        timestamp: new Date().toISOString()
      }
    });
  }
}
