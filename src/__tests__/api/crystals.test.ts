import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/crystals/route'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    crystal: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

const { prisma } = require('@/lib/prisma')

describe('/api/crystals', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/crystals', () => {
    it('returns crystals with pagination', async () => {
      const mockCrystals = [
        {
          id: '1',
          name: 'Amethyst',
          description: 'Purple crystal',
          price: 29.99,
          stockQuantity: 10,
          isActive: true,
          reviews: [{ rating: 5 }, { rating: 4 }],
          _count: { orderItems: 5, reviews: 2, wishlistItems: 3 }
        },
        {
          id: '2',
          name: 'Rose Quartz',
          description: 'Pink crystal',
          price: 24.99,
          stockQuantity: 15,
          isActive: true,
          reviews: [{ rating: 5 }],
          _count: { orderItems: 3, reviews: 1, wishlistItems: 2 }
        }
      ]

      prisma.crystal.findMany.mockResolvedValue(mockCrystals)
      prisma.crystal.count.mockResolvedValue(2)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/crystals?page=1&limit=10',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      
      const data = JSON.parse(res._getData())
      expect(data.crystals).toHaveLength(2)
      expect(data.crystals[0].averageRating).toBe(4.5)
      expect(data.pagination.totalCount).toBe(2)
    })

    it('filters crystals by category', async () => {
      prisma.crystal.findMany.mockResolvedValue([])
      prisma.crystal.count.mockResolvedValue(0)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/crystals?category=healing',
      })

      await handler(req, res)

      expect(prisma.crystal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { equals: 'healing', mode: 'insensitive' }
          })
        })
      )
    })

    it('filters crystals by price range', async () => {
      prisma.crystal.findMany.mockResolvedValue([])
      prisma.crystal.count.mockResolvedValue(0)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/crystals?minPrice=20&maxPrice=50',
      })

      await handler(req, res)

      expect(prisma.crystal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: { gte: 20, lte: 50 }
          })
        })
      )
    })

    it('sorts crystals by price ascending', async () => {
      prisma.crystal.findMany.mockResolvedValue([])
      prisma.crystal.count.mockResolvedValue(0)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/crystals?sortBy=price_asc',
      })

      await handler(req, res)

      expect(prisma.crystal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { price: 'asc' }
        })
      )
    })

    it('handles search query', async () => {
      prisma.crystal.findMany.mockResolvedValue([])
      prisma.crystal.count.mockResolvedValue(0)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/crystals?search=amethyst',
      })

      await handler(req, res)

      expect(prisma.crystal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: 'amethyst', mode: 'insensitive' } },
              { description: { contains: 'amethyst', mode: 'insensitive' } }
            ])
          })
        })
      )
    })

    it('returns 500 on database error', async () => {
      prisma.crystal.findMany.mockRejectedValue(new Error('Database error'))

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/crystals',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('POST /api/crystals', () => {
    it('creates a new crystal successfully', async () => {
      const newCrystal = {
        name: 'Clear Quartz',
        description: 'Master healer crystal',
        price: 19.99,
        category: 'Healing',
        stockQuantity: 20
      }

      const createdCrystal = {
        id: '3',
        ...newCrystal,
        slug: 'clear-quartz',
        isActive: true,
        createdAt: new Date()
      }

      prisma.crystal.create.mockResolvedValue(createdCrystal)

      const { req, res } = createMocks({
        method: 'POST',
        body: newCrystal,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data.crystal.name).toBe('Clear Quartz')
      expect(data.crystal.slug).toBe('clear-quartz')
    })

    it('validates required fields', async () => {
      const invalidCrystal = {
        description: 'Missing name and price'
      }

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidCrystal,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('required')
    })

    it('handles duplicate slug error', async () => {
      const newCrystal = {
        name: 'Amethyst',
        description: 'Another amethyst',
        price: 29.99,
        category: 'Healing',
        stockQuantity: 10
      }

      prisma.crystal.create.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['slug'] }
      })

      const { req, res } = createMocks({
        method: 'POST',
        body: newCrystal,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(409)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('already exists')
    })
  })
})
