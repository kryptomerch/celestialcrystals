import { Metadata } from 'next';
import AdminNavigation from '@/components/admin/AdminNavigation';

export const metadata: Metadata = {
  title: 'Admin Panel - Celestial Crystals',
  description: 'Admin dashboard for managing Celestial Crystals website',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <main>{children}</main>
    </div>
  );
}
