import { CartService } from '@/lib/cart'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('CartService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('getCart', () => {
    it('returns empty cart when localStorage is empty', () => {
      const cart = CartService.getCart()
      
      expect(cart).toEqual([])
      expect(localStorageMock.getItem).toHaveBeenCalledWith('celestial-cart')
    })

    it('returns parsed cart from localStorage', () => {
      const mockCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 2 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart))
      
      const cart = CartService.getCart()
      
      expect(cart).toEqual(mockCart)
    })

    it('returns empty cart when localStorage contains invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      
      const cart = CartService.getCart()
      
      expect(cart).toEqual([])
    })
  })

  describe('addToCart', () => {
    it('adds new item to empty cart', () => {
      const crystal = { id: '1', name: 'Amethyst', price: 29.99 }
      
      CartService.addToCart(crystal)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'celestial-cart',
        JSON.stringify([{ ...crystal, quantity: 1 }])
      )
    })

    it('increases quantity for existing item', () => {
      const existingCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 1 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const crystal = { id: '1', name: 'Amethyst', price: 29.99 }
      CartService.addToCart(crystal)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'celestial-cart',
        JSON.stringify([{ ...crystal, quantity: 2 }])
      )
    })

    it('adds new item to existing cart', () => {
      const existingCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 1 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const newCrystal = { id: '2', name: 'Rose Quartz', price: 24.99 }
      CartService.addToCart(newCrystal)
      
      const expectedCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 1 },
        { id: '2', name: 'Rose Quartz', price: 24.99, quantity: 1 }
      ]
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'celestial-cart',
        JSON.stringify(expectedCart)
      )
    })
  })

  describe('removeFromCart', () => {
    it('removes item from cart', () => {
      const existingCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 1 },
        { id: '2', name: 'Rose Quartz', price: 24.99, quantity: 1 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      CartService.removeFromCart('1')
      
      const expectedCart = [
        { id: '2', name: 'Rose Quartz', price: 24.99, quantity: 1 }
      ]
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'celestial-cart',
        JSON.stringify(expectedCart)
      )
    })

    it('does nothing when item not found', () => {
      const existingCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 1 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      CartService.removeFromCart('999')
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'celestial-cart',
        JSON.stringify(existingCart)
      )
    })
  })

  describe('updateQuantity', () => {
    it('updates item quantity', () => {
      const existingCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 1 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      CartService.updateQuantity('1', 3)
      
      const expectedCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 3 }
      ]
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'celestial-cart',
        JSON.stringify(expectedCart)
      )
    })

    it('removes item when quantity is 0', () => {
      const existingCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 1 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      CartService.updateQuantity('1', 0)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'celestial-cart',
        JSON.stringify([])
      )
    })

    it('does nothing when item not found', () => {
      const existingCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 1 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      CartService.updateQuantity('999', 2)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'celestial-cart',
        JSON.stringify(existingCart)
      )
    })
  })

  describe('clearCart', () => {
    it('clears the cart', () => {
      CartService.clearCart()
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('celestial-cart')
    })
  })

  describe('getCartTotal', () => {
    it('calculates total for empty cart', () => {
      const total = CartService.getCartTotal()
      
      expect(total).toBe(0)
    })

    it('calculates total for cart with items', () => {
      const existingCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 2 },
        { id: '2', name: 'Rose Quartz', price: 24.99, quantity: 1 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const total = CartService.getCartTotal()
      
      expect(total).toBe(84.97) // (29.99 * 2) + (24.99 * 1)
    })
  })

  describe('getCartItemCount', () => {
    it('returns 0 for empty cart', () => {
      const count = CartService.getCartItemCount()
      
      expect(count).toBe(0)
    })

    it('returns total quantity for cart with items', () => {
      const existingCart = [
        { id: '1', name: 'Amethyst', price: 29.99, quantity: 2 },
        { id: '2', name: 'Rose Quartz', price: 24.99, quantity: 3 }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const count = CartService.getCartItemCount()
      
      expect(count).toBe(5) // 2 + 3
    })
  })
})
