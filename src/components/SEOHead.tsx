import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  price?: number
  currency?: string
  availability?: 'in stock' | 'out of stock' | 'preorder'
  brand?: string
  category?: string
  sku?: string
  rating?: number
  reviewCount?: number
  author?: string
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
  noFollow?: boolean
  canonical?: string
}

export default function SEOHead({
  title = 'Celestial Crystals - Healing Crystals & Spiritual Stones',
  description = 'Discover the power of healing crystals and spiritual stones. Shop our curated collection of authentic crystals for meditation, chakra healing, and spiritual growth.',
  keywords = ['healing crystals', 'spiritual stones', 'chakra crystals', 'meditation crystals', 'crystal healing', 'gemstones', 'metaphysical', 'energy healing'],
  image = '/images/og-default.jpg',
  url,
  type = 'website',
  price,
  currency = 'USD',
  availability,
  brand = 'Celestial Crystals',
  category,
  sku,
  rating,
  reviewCount,
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
  noFollow = false,
  canonical
}: SEOProps) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://celestialcrystals.com'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  // Structured data for different content types
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'Product' : 'WebSite',
      name: title,
      description,
      url: fullUrl,
      image: fullImageUrl
    }

    if (type === 'product') {
      return {
        ...baseData,
        '@type': 'Product',
        brand: {
          '@type': 'Brand',
          name: brand
        },
        category,
        sku,
        offers: {
          '@type': 'Offer',
          price: price?.toString(),
          priceCurrency: currency,
          availability: availability === 'in stock'
            ? 'https://schema.org/InStock'
            : availability === 'out of stock'
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/PreOrder',
          seller: {
            '@type': 'Organization',
            name: brand
          }
        },
        ...(rating && reviewCount && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating,
            reviewCount
          }
        })
      }
    }

    if (type === 'article') {
      return {
        ...baseData,
        '@type': 'Article',
        headline: title,
        author: {
          '@type': 'Person',
          name: author || brand
        },
        publisher: {
          '@type': 'Organization',
          name: brand,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/logo.png`
          }
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime
      }
    }

    return {
      ...baseData,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  }

  const robotsContent = [
    noIndex && 'noindex',
    noFollow && 'nofollow'
  ].filter(Boolean).join(', ') || 'index, follow'

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={robotsContent} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Celestial Crystals" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@Celesti95282006" />
      <meta name="twitter:creator" content="@Celesti95282006" />

      {/* Product-specific meta tags */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
          {availability && <meta property="product:availability" content={availability} />}
          {category && <meta property="product:category" content={category} />}
          {brand && <meta property="product:brand" content={brand} />}
        </>
      )}

      {/* Article-specific meta tags */}
      {type === 'article' && (
        <>
          {author && <meta name="author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:section" content="Crystal Healing" />
          {keywords.map(keyword => (
            <meta key={keyword} property="article:tag" content={keyword} />
          ))}
        </>
      )}

      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#667eea" />

      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData())
        }}
      />

      {/* Additional structured data for organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Celestial Crystals',
            url: baseUrl,
            logo: `${baseUrl}/images/logo.png`,
            description: 'Premium healing crystals and spiritual stones for meditation, chakra healing, and spiritual growth.',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+1-555-CRYSTAL',
              contactType: 'customer service',
              availableLanguage: 'English'
            },
            sameAs: [
              'https://www.instagram.com/zenwithcelestial/profilecard/?igsh=MWRscW9sbmk2MGFsZw==',
              'https://x.com/Celesti95282006?t=6LRLq3UIPAT-xinuQfw8yw&s=09'
            ]
          })
        }}
      />

      {/* Breadcrumb structured data if URL has path */}
      {url && url !== '/' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: url.split('/').filter(Boolean).map((segment, index, array) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
                item: `${baseUrl}/${array.slice(0, index + 1).join('/')}`
              }))
            })
          }}
        />
      )}
    </Head>
  )
}
