import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thecelestial.xyz';
  const currentDate = new Date();

  // Static pages that always exist (failsafe)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/crystals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/natural-crystal-bracelet-north-america`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/natural-crystal-bracelet-usa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/natural-crystal-bracelet-canada`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/natural-crystal-bracelets-canada-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/natural-crystal-bracelets-usa-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/birthdate-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Skip database queries during build time or if DATABASE_URL is not properly configured
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      console.log('Skipping database queries in production build for sitemap');
      return staticPages;
    }

    // Try to get database content with shorter timeout for Google crawlers
    const [crystals, categories] = await Promise.race([
      Promise.all([
        prisma.crystal.findMany({
          where: { isActive: true },
          select: {
            id: true,
            slug: true,
            updatedAt: true
          },
          take: 30, // Reduced limit for faster response
        }),
        prisma.crystal.groupBy({
          by: ['category'],
          where: { isActive: true }
        })
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout for sitemap')), 1500) // Reduced timeout
      )
    ]) as [Array<{ id: string; slug: string; updatedAt: Date | null }>, Array<{ category: string }>];

    // Add database content if available
    let allPages = [...staticPages];

    // Add crystal product pages if database is available
    if (crystals && crystals.length > 0) {
      const crystalPages: MetadataRoute.Sitemap = crystals.map((crystal) => ({
        url: `${baseUrl}/crystals/${crystal.slug || crystal.id}`,
        lastModified: crystal.updatedAt || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
      allPages = [...allPages, ...crystalPages];
    }

    // Add category pages if database is available
    if (categories && categories.length > 0) {
      const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/crystals/category/${encodeURIComponent(category.category.toLowerCase())}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
      allPages = [...allPages, ...categoryPages];
    }

    return allPages;

  } catch (error) {
    console.error('Sitemap database error:', error);
    // Return static pages if database fails
    return staticPages;
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Prisma disconnect error:', disconnectError);
    }
  }
}
