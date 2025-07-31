'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Mail,
  DollarSign,
  Users,
  Database,
  ShoppingCart,
  FileText,
  Package,
  BarChart3,
  Edit,
  MessageSquare,
  Settings,
  Grid3X3
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: <Home className="w-5 h-5" />,
    description: 'Overview and analytics'
  },
  {
    name: 'All Tools',
    href: '/admin/tools',
    icon: <Grid3X3 className="w-5 h-5" />,
    description: 'All admin tools'
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: <ShoppingCart className="w-5 h-5" />,
    description: 'Manage products'
  },
  {
    name: 'Price Manager',
    href: '/admin/price-manager',
    icon: <DollarSign className="w-5 h-5" />,
    description: 'Update prices'
  },
  {
    name: 'Inventory',
    href: '/admin/inventory',
    icon: <Package className="w-5 h-5" />,
    description: 'Stock management'
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: <FileText className="w-5 h-5" />,
    description: 'Order management'
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: <Users className="w-5 h-5" />,
    description: 'Customer management'
  },
  {
    name: 'Email Templates',
    href: '/admin/email-templates',
    icon: <Mail className="w-5 h-5" />,
    description: 'Email management'
  },
  {
    name: 'Subscribers',
    href: '/admin/email-subscribers',
    icon: <Database className="w-5 h-5" />,
    description: 'Email subscribers'
  },
  {
    name: 'AI Blog',
    href: '/admin/ai-blog-automation',
    icon: <Edit className="w-5 h-5" />,
    description: 'AI content creation'
  },
  {
    name: 'AI Chat',
    href: '/admin/ai-chat',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'AI assistant'
  }
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Panel
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.slice(0, 6).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    title={item.description}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <NotificationCenter />
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = e.target.value;
                  }
                }}
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="" disabled>More Tools</option>
                {navigation.slice(6).map((item) => (
                  <option key={item.name} value={item.href}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${isActive
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
