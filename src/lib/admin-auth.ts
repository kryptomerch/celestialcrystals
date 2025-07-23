import { getServerSession } from 'next-auth';
import { authOptions, isUserAdmin, isAdminEmail } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { authorized: false, error: 'Not authenticated' };
  }

  // Check if user is admin by email or role
  const isAdmin = await isUserAdmin(session.user.id) || isAdminEmail(session.user.email);
  
  if (!isAdmin) {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true, user: session.user };
}

export function createAdminApiHandler(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async function(request: NextRequest) {
    const auth = await requireAdminAuth();
    
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.error === 'Not authenticated' ? 401 : 403 }
      );
    }

    return handler(request);
  };
}
