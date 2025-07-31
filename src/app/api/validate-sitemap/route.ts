import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = 'https://thecelestial.xyz';

    // Test sitemap URLs
    const sitemapUrls = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-fresh.xml`,
      `${baseUrl}/robots.txt`
    ];

    const results = await Promise.all(
      sitemapUrls.map(async (url) => {
        try {
          const response = await fetch(url, {
            method: 'HEAD',
            headers: {
              'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)'
            }
          });

          return {
            url,
            status: response.status,
            statusText: response.statusText,
            headers: {
              'content-type': response.headers.get('content-type'),
              'content-length': response.headers.get('content-length'),
              'last-modified': response.headers.get('last-modified'),
              'cache-control': response.headers.get('cache-control')
            },
            accessible: response.ok
          };
        } catch (error) {
          return {
            url,
            status: 0,
            statusText: 'Network Error',
            error: error instanceof Error ? error.message : 'Unknown error',
            accessible: false
          };
        }
      })
    );

    // Additional checks
    const checks = {
      timestamp: new Date().toISOString(),
      baseUrl,
      sitemapTests: results,
      recommendations: [] as string[]
    };

    // Add recommendations based on results
    const failedSitemaps = results.filter(r => !r.accessible);
    if (failedSitemaps.length > 0) {
      checks.recommendations.push('Some sitemaps are not accessible. Check server configuration.');
    }

    const nonXmlSitemaps = results.filter(r =>
      r.url.includes('sitemap') &&
      r.accessible &&
      r.headers &&
      !r.headers['content-type']?.includes('xml')
    );
    if (nonXmlSitemaps.length > 0) {
      checks.recommendations.push('Sitemaps should return content-type: application/xml or text/xml');
    }

    if (results.every(r => r.accessible)) {
      checks.recommendations.push('✅ All sitemaps are accessible!');
    }

    return NextResponse.json({
      success: true,
      message: 'Sitemap validation completed',
      data: checks
    });

  } catch (error) {
    console.error('Sitemap validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate sitemaps',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
