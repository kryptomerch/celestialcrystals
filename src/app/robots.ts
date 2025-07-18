import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/checkout/',
          '/order-confirmation/',
          '/auth/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/checkout/',
          '/order-confirmation/',
          '/auth/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://celestialcrystals.com/sitemap.xml',
    host: 'https://celestialcrystals.com',
  };
}
