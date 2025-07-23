import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://celestialcrystals.com'

    // Get all active crystals
    const crystals = await prisma.crystal.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true
      }
    })

    // Get all categories
    const categories = await prisma.crystal.groupBy({
      by: ['category'],
      where: { isActive: true }
    })

    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/crystals', priority: '0.9', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/blog', priority: '0.8', changefreq: 'weekly' },
      { url: '/auth/signin', priority: '0.6', changefreq: 'monthly' },
      { url: '/auth/signup', priority: '0.6', changefreq: 'monthly' },
      { url: '/cart', priority: '0.7', changefreq: 'hourly' },
      { url: '/checkout', priority: '0.7', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
      { url: '/terms', priority: '0.5', changefreq: 'yearly' }
    ]

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  
  ${crystals.map(crystal => `
  <url>
    <loc>${baseUrl}/crystals/${crystal.slug}</loc>
    <lastmod>${crystal.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  ${categories.map(category => `
  <url>
    <loc>${baseUrl}/crystals/category/${encodeURIComponent(category.category.toLowerCase())}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
