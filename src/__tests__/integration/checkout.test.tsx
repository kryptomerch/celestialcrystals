import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider } from '@/contexts/CartContext'
import CheckoutPage from '@/app/checkout/page'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/checkout',
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      }
    },
    status: 'authenticated',
  }),
}))

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    confirmCardPayment: jest.fn(() => Promise.resolve({
      paymentIntent: { status: 'succeeded' }
    })),
  })),
}))

// Mock fetch
global.fetch = jest.fn()

const mockCartItems = [
  {
    id: '1',
    name: 'Amethyst',
    price: 29.99,
    quantity: 2,
    image: '/images/amethyst.jpg',
  },
  {
    id: '2',
    name: 'Rose Quartz',
    price: 24.99,
    quantity: 1,
    image: '/images/rose-quartz.jpg',
  }
]

const MockCartProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}

describe('Checkout Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock localStorage with cart items
    const mockLocalStorage = {
      getItem: jest.fn(() => JSON.stringify(mockCartItems)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    })
  })

  it('displays cart items and calculates total correctly', () => {
    render(
      <MockCartProvider>
        <CheckoutPage />
      </MockCartProvider>
    )

    // Check if cart items are displayed
    expect(screen.getByText('Amethyst')).toBeInTheDocument()
    expect(screen.getByText('Rose Quartz')).toBeInTheDocument()
    
    // Check quantities
    expect(screen.getByText('Qty: 2')).toBeInTheDocument()
    expect(screen.getByText('Qty: 1')).toBeInTheDocument()
    
    // Check total calculation (29.99 * 2 + 24.99 * 1 = 84.97)
    expect(screen.getByText('$84.97')).toBeInTheDocument()
  })

  it('validates shipping address form', async () => {
    const user = userEvent.setup()
    
    render(
      <MockCartProvider>
        <CheckoutPage />
      </MockCartProvider>
    )

    // Try to submit without filling required fields
    const submitButton = screen.getByText('Place Order')
    await user.click(submitButton)

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/address is required/i)).toBeInTheDocument()
    })
  })

  it('processes payment successfully', async () => {
    const user = userEvent.setup()
    
    // Mock successful payment API response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        clientSecret: 'pi_test_client_secret',
        orderId: 'order_123'
      })
    })

    render(
      <MockCartProvider>
        <CheckoutPage />
      </MockCartProvider>
    )

    // Fill in shipping address
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'Anytown')
    await user.type(screen.getByLabelText(/state/i), 'CA')
    await user.type(screen.getByLabelText(/zip code/i), '12345')

    // Fill in payment details (mock Stripe elements)
    const cardElement = screen.getByTestId('card-element')
    fireEvent.change(cardElement, {
      target: { value: '4242424242424242' }
    })

    // Submit order
    const submitButton = screen.getByText('Place Order')
    await user.click(submitButton)

    // Wait for payment processing
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/orders', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('John')
      }))
    })
  })

  it('handles payment failure gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock failed payment API response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        error: 'Payment failed'
      })
    })

    render(
      <MockCartProvider>
        <CheckoutPage />
      </MockCartProvider>
    )

    // Fill in required fields and submit
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'Anytown')
    await user.type(screen.getByLabelText(/state/i), 'CA')
    await user.type(screen.getByLabelText(/zip code/i), '12345')

    const submitButton = screen.getByText('Place Order')
    await user.click(submitButton)

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument()
    })
  })

  it('applies discount code correctly', async () => {
    const user = userEvent.setup()
    
    // Mock discount validation API response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        valid: true,
        discountAmount: 10.00,
        discountPercent: 10
      })
    })

    render(
      <MockCartProvider>
        <CheckoutPage />
      </MockCartProvider>
    )

    // Enter discount code
    const discountInput = screen.getByPlaceholderText(/discount code/i)
    await user.type(discountInput, 'SAVE10')
    
    const applyButton = screen.getByText('Apply')
    await user.click(applyButton)

    // Check if discount is applied
    await waitFor(() => {
      expect(screen.getByText('-$10.00')).toBeInTheDocument()
      expect(screen.getByText('$74.97')).toBeInTheDocument() // 84.97 - 10.00
    })
  })

  it('redirects to success page after successful order', async () => {
    const user = userEvent.setup()
    
    // Mock successful order creation
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        orderId: 'order_123',
        orderNumber: 'CC-001'
      })
    })

    render(
      <MockCartProvider>
        <CheckoutPage />
      </MockCartProvider>
    )

    // Fill form and submit (simplified)
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'Anytown')
    await user.type(screen.getByLabelText(/state/i), 'CA')
    await user.type(screen.getByLabelText(/zip code/i), '12345')

    const submitButton = screen.getByText('Place Order')
    await user.click(submitButton)

    // Check if redirected to success page
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/checkout/success?order=order_123')
    })
  })
})
