import { Crystal } from '@/data/crystals';

interface ProductStructuredDataProps {
  crystal: Crystal;
}

export function ProductStructuredData({ crystal }: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": crystal.name,
    "description": crystal.description,
    "image": crystal.image || "https://thecelestial.xyz/crystal-placeholder.jpg",
    "brand": {
      "@type": "Brand",
      "name": "CELESTIAL"
    },
    "category": crystal.category,
    "offers": {
      "@type": "Offer",
      "price": crystal.price,
      "priceCurrency": "CAD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "CELESTIAL"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Chakra",
        "value": crystal.chakra
      },
      {
        "@type": "PropertyValue",
        "name": "Element",
        "value": crystal.element
      },
      {
        "@type": "PropertyValue",
        "name": "Hardness",
        "value": crystal.hardness
      },
      {
        "@type": "PropertyValue",
        "name": "Origin",
        "value": crystal.origin
      },
      {
        "@type": "PropertyValue",
        "name": "Rarity",
        "value": crystal.rarity
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CELESTIAL",
    "url": "https://celestialcrystals.com",
    "logo": "https://celestialcrystals.com/logo.png",
    "description": "Premium crystal bracelets and healing stones for spiritual growth and well-being.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "hello@celestialcrystals.com"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Crystal Lane",
      "addressLocality": "Healing Heights",
      "addressRegion": "CA",
      "postalCode": "90210",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://facebook.com/celestialcrystals",
      "https://instagram.com/celestialcrystals",
      "https://pinterest.com/celestialcrystals"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CELESTIAL",
    "url": "https://celestialcrystals.com",
    "description": "Discover authentic healing crystals and gemstone bracelets. Personalized recommendations based on your zodiac sign and birth date.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://celestialcrystals.com/crystals?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
