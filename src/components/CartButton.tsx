'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function CartButton() {
  const { items, setIsOpen } = useCart();

  return (
    <button onClick={() => setIsOpen(true)} className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
      <ShoppingBag className="w-6 h-6" />
      {items.length > 0 && (
        <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-gray-900 text-white text-xs font-medium transform translate-x-1/2 -translate-y-1/2">
          {items.length}
        </span>
      )}
    </button>
  );
}
