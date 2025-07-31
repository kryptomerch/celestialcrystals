import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NotificationService } from '@/lib/notification-service';

function isAdminEmail(email: string): boolean {
  const adminEmails = ['dhruvshah8888@gmail.com', 'admin@celestialcrystals.com'];
  return adminEmails.includes(email.toLowerCase());
}

// GET - Fetch notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    let notifications;
    if (unreadOnly) {
      notifications = await NotificationService.getUnreadNotifications();
    } else {
      notifications = await NotificationService.getAllNotifications(limit);
    }

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    });

  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Mark notifications as read or create new notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, notificationId, notificationData } = await request.json();

    switch (action) {
      case 'markAsRead':
        if (!notificationId) {
          return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
        }
        await NotificationService.markAsRead(notificationId);
        return NextResponse.json({ success: true, message: 'Notification marked as read' });

      case 'markAllAsRead':
        await NotificationService.markAllAsRead();
        return NextResponse.json({ success: true, message: 'All notifications marked as read' });

      case 'delete':
        if (!notificationId) {
          return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
        }
        await NotificationService.deleteNotification(notificationId);
        return NextResponse.json({ success: true, message: 'Notification deleted' });

      case 'create':
        if (!notificationData) {
          return NextResponse.json({ error: 'Notification data required' }, { status: 400 });
        }
        const notification = await NotificationService.createNotification(notificationData);
        return NextResponse.json({ success: true, notification });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Notifications action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
