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
    sitemap: 'https://thecelestial.xyz/sitemap.xml',
    host: 'https://thecelestial.xyz',
  };
}
