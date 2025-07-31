// Cart Service for managing shopping cart operations
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export class CartService {
  private static STORAGE_KEY = 'celestial_cart';

  // Get all items from cart
  static getItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  // Add item to cart
  static addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1): void {
    if (typeof window === 'undefined') return;

    try {
      const items = this.getItems();
      const existingIndex = items.findIndex(cartItem => cartItem.id === item.id);

      if (existingIndex >= 0) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({ ...item, quantity });
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  }

  // Remove item from cart
  static removeItem(itemId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const items = this.getItems().filter(item => item.id !== itemId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }

  // Update item quantity
  static updateQuantity(itemId: string, quantity: number): void {
    if (typeof window === 'undefined') return;

    try {
      const items = this.getItems();
      const itemIndex = items.findIndex(item => item.id === itemId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          this.removeItem(itemId);
        } else {
          items[itemIndex].quantity = quantity;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        }
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  }

  // Clear entire cart
  static clearCart(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  // Get cart total
  static getTotal(): number {
    return this.getItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart item count
  static getItemCount(): number {
    return this.getItems().reduce((count, item) => count + item.quantity, 0);
  }

  // Check if item is in cart
  static isInCart(itemId: string): boolean {
    return this.getItems().some(item => item.id === itemId);
  }

  // Get specific item from cart
  static getItem(itemId: string): CartItem | undefined {
    return this.getItems().find(item => item.id === itemId);
  }
}
