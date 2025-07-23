// Utility functions for admin checks on the client side

export const ADMIN_EMAILS = [
  'dhruvaparik@gmail.com',
  'kryptomerch.io@gmail.com'
];

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function checkIsAdmin(user: any): boolean {
  if (!user?.email) return false;
  
  return isAdminEmail(user.email) || user.role === 'ADMIN';
}

export function checkAdminAccess(session: any): boolean {
  return session?.user ? checkIsAdmin(session.user) : false;
}
