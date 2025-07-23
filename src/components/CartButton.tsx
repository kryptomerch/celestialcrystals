'use client';

import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ShoppingBag } from 'lucide-react';

export default function CartButton() {
  const { items, setIsOpen } = useCart();
  const { isDark } = useTheme();

  return (
    <button onClick={() => setIsOpen(true)} className={`relative p-2 transition-colors ${isDark
      ? 'text-white hover:text-gray-300'
      : 'text-gray-700 hover:text-gray-900'
      }`}>
      <ShoppingBag className="w-6 h-6" />
      {items.length > 0 && (
        <span className={`absolute top-0 right-0 block h-4 w-4 rounded-full text-xs font-medium transform translate-x-1/2 -translate-y-1/2 ${isDark
          ? 'bg-white text-gray-900'
          : 'bg-gray-900 text-white'
          }`}>
          {items.length}
        </span>
      )}
    </button>
  );
}
