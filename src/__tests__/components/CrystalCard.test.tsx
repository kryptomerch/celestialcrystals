import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CartProvider } from '@/contexts/CartContext'
import CrystalCard from '@/components/CrystalCard'

// Mock the cart context
const mockAddToCart = jest.fn()
const mockToggleWishlist = jest.fn()

jest.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
    toggleWishlist: mockToggleWishlist,
    wishlistItems: [],
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockCrystal = {
  id: '1',
  name: 'Amethyst',
  description: 'A beautiful purple crystal for spiritual growth',
  price: 29.99,
  image: '/images/amethyst.jpg',
  properties: ['Healing', 'Spiritual', 'Calming'],
  colors: ['Purple'],
  stockQuantity: 10,
  isActive: true,
  averageRating: 4.5,
  reviewCount: 12,
}

describe('CrystalCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders crystal information correctly', () => {
    render(<CrystalCard crystal={mockCrystal} />)
    
    expect(screen.getByText('Amethyst')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText(/A beautiful purple crystal/)).toBeInTheDocument()
    expect(screen.getByText('Healing')).toBeInTheDocument()
    expect(screen.getByText('Spiritual')).toBeInTheDocument()
    expect(screen.getByText('Calming')).toBeInTheDocument()
  })

  it('displays rating and review count', () => {
    render(<CrystalCard crystal={mockCrystal} />)
    
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(12 reviews)')).toBeInTheDocument()
  })

  it('shows stock status correctly', () => {
    render(<CrystalCard crystal={mockCrystal} />)
    
    expect(screen.getByText('In Stock')).toBeInTheDocument()
  })

  it('shows out of stock when quantity is 0', () => {
    const outOfStockCrystal = { ...mockCrystal, stockQuantity: 0 }
    render(<CrystalCard crystal={outOfStockCrystal} />)
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('shows low stock warning when quantity is low', () => {
    const lowStockCrystal = { ...mockCrystal, stockQuantity: 3 }
    render(<CrystalCard crystal={lowStockCrystal} />)
    
    expect(screen.getByText('Only 3 left!')).toBeInTheDocument()
  })

  it('calls addToCart when Add to Cart button is clicked', async () => {
    render(<CrystalCard crystal={mockCrystal} />)
    
    const addToCartButton = screen.getByText('Add to Cart')
    fireEvent.click(addToCartButton)
    
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockCrystal)
    })
  })

  it('disables Add to Cart button when out of stock', () => {
    const outOfStockCrystal = { ...mockCrystal, stockQuantity: 0 }
    render(<CrystalCard crystal={outOfStockCrystal} />)
    
    const addToCartButton = screen.getByRole('button', { name: /out of stock/i })
    expect(addToCartButton).toBeDisabled()
  })

  it('calls toggleWishlist when wishlist button is clicked', async () => {
    render(<CrystalCard crystal={mockCrystal} />)
    
    const wishlistButton = screen.getByLabelText('Add to wishlist')
    fireEvent.click(wishlistButton)
    
    await waitFor(() => {
      expect(mockToggleWishlist).toHaveBeenCalledWith(mockCrystal.id)
    })
  })

  it('displays properties as tags', () => {
    render(<CrystalCard crystal={mockCrystal} />)
    
    mockCrystal.properties.forEach(property => {
      expect(screen.getByText(property)).toBeInTheDocument()
    })
  })

  it('renders image with correct alt text', () => {
    render(<CrystalCard crystal={mockCrystal} />)
    
    const image = screen.getByAltText('Amethyst')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/amethyst.jpg')
  })

  it('applies hover effects correctly', () => {
    render(<CrystalCard crystal={mockCrystal} />)
    
    const card = screen.getByTestId('crystal-card')
    expect(card).toHaveClass('hover:shadow-lg')
  })
})
