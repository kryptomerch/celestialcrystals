import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://thecelestial.xyz/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /test-*

# Allow important pages
Allow: /crystals
Allow: /blog
Allow: /natural-crystal-bracelet-*
Allow: /birthdate-guide
Allow: /about
Allow: /contact
Allow: /shipping
Allow: /privacy
Allow: /terms

# Crawl delay
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
