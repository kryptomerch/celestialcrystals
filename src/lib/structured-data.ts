// Structured Data Generator for SEO
export class StructuredDataGenerator {
  private static baseUrl = 'https://thecelestial.xyz';

  // Organization Schema
  static getOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CELESTIAL",
      "description": "Premium natural crystal bracelets and healing crystals in Canada",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/logo.png`,
      "image": `${this.baseUrl}/og-image.jpg`,
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CA",
        "addressRegion": "North America"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English", "French"]
      },
      "sameAs": [
        "https://www.instagram.com/celestialcrystals",
        "https://www.facebook.com/celestialcrystals",
        "https://twitter.com/celestialcrystals"
      ]
    };
  }

  // Website Schema
  static getWebsiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "CELESTIAL - Natural Crystal Bracelets Canada",
      "description": "Premium natural crystal bracelets and healing crystals with fast shipping across Canada & USA",
      "url": this.baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${this.baseUrl}/crystals?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "CELESTIAL",
        "logo": `${this.baseUrl}/logo.png`
      }
    };
  }

  // Product Schema for Crystal Bracelets
  static getProductSchema(crystal: any) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": crystal.name,
      "description": crystal.description,
      "image": crystal.images?.map((img: string) => `${this.baseUrl}${img}`) || [`${this.baseUrl}${crystal.image}`],
      "sku": crystal.id,
      "brand": {
        "@type": "Brand",
        "name": "CELESTIAL"
      },
      "category": crystal.category,
      "offers": {
        "@type": "Offer",
        "price": crystal.price,
        "priceCurrency": "CAD",
        "availability": crystal.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "CELESTIAL"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "CAD"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 2,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 3,
              "maxValue": 7,
              "unitCode": "DAY"
            }
          }
        }
      },
      "aggregateRating": crystal.averageRating ? {
        "@type": "AggregateRating",
        "ratingValue": crystal.averageRating,
        "reviewCount": crystal.reviewCount || 1
      } : undefined,
      "additionalProperty": crystal.properties?.map((prop: string) => ({
        "@type": "PropertyValue",
        "name": "Healing Property",
        "value": prop
      }))
    };
  }

  // Article Schema for Blog Posts
  static getArticleSchema(article: any) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt,
      "image": article.image ? `${this.baseUrl}${article.image}` : `${this.baseUrl}/og-image.jpg`,
      "author": {
        "@type": "Person",
        "name": "CELESTIAL Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "CELESTIAL",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/logo.png`
        }
      },
      "datePublished": article.publishedAt || new Date().toISOString(),
      "dateModified": article.updatedAt || new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/blog/${article.slug}`
      },
      "keywords": article.tags?.join(', ') || 'crystal healing, natural crystals, spiritual wellness'
    };
  }

  // FAQ Schema
  static getFAQSchema(faqs: Array<{question: string, answer: string}>) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  // Local Business Schema (if you have physical presence)
  static getLocalBusinessSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "CELESTIAL",
      "description": "Natural crystal bracelets for healing, protection, and spiritual growth",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/logo.png`,
      "image": `${this.baseUrl}/og-image.jpg`,
      "priceRange": "$25-$55",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "45.4215",
        "longitude": "-75.6972"
      },
      "openingHours": "Mo-Su 00:00-23:59",
      "telephone": "+1-800-CRYSTAL",
      "sameAs": [
        "https://www.instagram.com/celestialcrystals",
        "https://www.facebook.com/celestialcrystals",
        "https://twitter.com/celestialcrystals"
      ]
    };
  }

  // Breadcrumb Schema
  static getBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${this.baseUrl}${crumb.url}`
      }))
    };
  }
}
