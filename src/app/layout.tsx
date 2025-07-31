import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Suspense } from 'react';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ShoppingCart from '@/components/ShoppingCart';
import Header from '@/components/Header';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import WebVitalsReporter from '@/components/WebVitalsReporter';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://thecelestial.xyz'),
  title: {
    default: 'CELESTIAL - #1 Natural Crystal Bracelets North America | USA & Canada',
    template: '%s | CELESTIAL - Natural Crystal Bracelets North America'
  },
  description: 'North America\'s #1 natural crystal bracelet store. Authentic healing crystals with fast shipping across USA and Canada. Premium Tiger Eye, Amethyst, Rose Quartz bracelets. Shop genuine gemstone jewelry at CELESTIAL.',
  keywords: [
    'natural crystal bracelet north america',
    'crystal bracelet usa canada',
    'healing crystals north america',
    'natural crystal bracelet usa',
    'natural crystal bracelet canada',
    'crystal bracelets america',
    'gemstone bracelets usa canada',
    'chakra bracelets north america',
    'spiritual jewelry america',
    'tiger eye bracelet usa canada',
    'amethyst bracelet north america',
    'rose quartz bracelet usa',
    'crystal healing north america',
    'authentic crystals usa canada',
    'crystal shop north america',
    'best crystal bracelets america',
    'thecelestial.xyz'
  ],
  authors: [{ name: 'CELESTIAL', url: 'https://thecelestial.xyz' }],
  creator: 'CELESTIAL',
  publisher: 'CELESTIAL',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['en_CA'],
    url: 'https://thecelestial.xyz',
    siteName: 'CELESTIAL - #1 Natural Crystal Bracelets North America',
    title: 'CELESTIAL - #1 Natural Crystal Bracelets North America | USA & Canada',
    description: 'North America\'s #1 natural crystal bracelet store. Authentic healing crystals with fast shipping across USA and Canada. Premium Tiger Eye, Amethyst, Rose Quartz bracelets.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CELESTIAL Crystal Bracelets Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CELESTIAL - Natural Crystal Bracelets',
    description: 'Discover authentic natural crystal bracelets for healing, protection, and spiritual growth.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LB6Y0RG4JQ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LB6Y0RG4JQ', {
                    page_location: window.location.href,
                    page_title: document.title,
                    anonymize_ip: true,
                    allow_google_signals: false,
                    allow_ad_personalization_signals: false
                  });

                  // Track crystal views
                  window.trackCrystalView = function(crystalId, crystalName, category, price) {
                    gtag('event', 'view_item', {
                      currency: 'CAD',
                      value: price,
                      items: [{
                        item_id: crystalId,
                        item_name: crystalName,
                        item_category: category,
                        price: price,
                        quantity: 1
                      }]
                    });
                  };

                  // Track add to cart
                  window.trackAddToCart = function(crystalId, crystalName, category, price, quantity = 1) {
                    gtag('event', 'add_to_cart', {
                      currency: 'CAD',
                      value: price * quantity,
                      items: [{
                        item_id: crystalId,
                        item_name: crystalName,
                        item_category: category,
                        price: price,
                        quantity: quantity
                      }]
                    });
                  };

                  // Track purchases
                  window.trackPurchase = function(transactionId, items, total) {
                    gtag('event', 'purchase', {
                      transaction_id: transactionId,
                      currency: 'CAD',
                      value: total,
                      items: items
                    });
                  };

                  // Track search
                  window.trackSearch = function(searchTerm) {
                    gtag('event', 'search', {
                      search_term: searchTerm
                    });
                  };
                `,
          }}
        />

        <link rel="canonical" href="https://thecelestial.xyz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#9333ea" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#9333ea" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="North America" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "CELESTIAL",
              "description": "Natural crystal bracelets for healing, protection, and spiritual growth",
              "url": "https://thecelestial.xyz",
              "logo": "https://thecelestial.xyz/logo.png",
              "image": "https://thecelestial.xyz/og-image.jpg",
              "priceRange": "$25-$55",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://www.instagram.com/zenwithcelestial/profilecard/?igsh=MWRscW9sbmk2MGFsZw==",
                "https://x.com/Celesti95282006?t=6LRLq3UIPAT-xinuQfw8yw&s=09"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider>
          <SessionProvider>
            <CartProvider>
              <GoogleAnalytics />
              <WebVitalsReporter />
              <AnalyticsTracker />
              <Header />
              <main className="min-h-screen bg-background">{children}</main>
              <Footer />
              <ShoppingCart />
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}



function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center -space-x-6 mb-0">
              <img
                src="/images/logo-design.png"
                alt="Celestial Crystals Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain brightness-0 invert"
              />
              <img
                src="/images/logo-name.png"
                alt="Celestial"
                className="h-40 sm:h-48 object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md -mt-12">
              Discover the power of natural crystal bracelets. Each piece is carefully selected for its authentic healing properties and spiritual significance.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/zenwithcelestial/profilecard/?igsh=MWRscW9sbmk2MGFsZw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                Instagram
              </a>
              <a href="https://x.com/Celesti95282006?t=6LRLq3UIPAT-xinuQfw8yw&s=09" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                Twitter/X
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Pinterest
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/crystals" className="text-gray-300 hover:text-purple-400 transition-colors">All Crystals</Link></li>
              <li><Link href="/categories" className="text-gray-300 hover:text-purple-400 transition-colors">Categories</Link></li>
              <li><Link href="/birthdate-guide" className="text-gray-300 hover:text-purple-400 transition-colors">Birthdate Guide</Link></li>
              <li><Link href="/crystal-care" className="text-gray-300 hover:text-purple-400 transition-colors">Crystal Care</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/shipping" className="text-gray-300 hover:text-purple-400 transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-purple-400 transition-colors">Returns</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-purple-400 transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-purple-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 CELESTIAL. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}