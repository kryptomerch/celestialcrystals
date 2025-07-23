import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ShoppingCart from '@/components/ShoppingCart';
import Header from '@/components/Header';
import AnalyticsTracker from '@/components/AnalyticsTracker';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CELESTIAL - Natural Crystal Bracelets | Healing Crystals & Gemstones',
  description: 'Discover authentic natural crystal bracelets for healing, protection, and spiritual growth across North America. Find your perfect crystal match based on your birthdate. Fast shipping to USA & Canada. Shop Tiger Eye, Amethyst, Rose Quartz, and more.',
  keywords: 'crystal bracelets USA, healing crystals Canada, natural gemstones North America, birthstone jewelry, chakra bracelets, spiritual jewelry, crystal healing, metaphysical stones, tiger eye bracelet, amethyst jewelry, rose quartz bracelet, authentic crystals USA, gemstone bracelets Canada',
  authors: [{ name: 'Celestial Crystals' }],
  creator: 'Celestial Crystals',
  publisher: 'Celestial Crystals',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thecelestial.xyz',
    siteName: 'CELESTIAL - Natural Crystal Bracelets',
    title: 'CELESTIAL - Natural Crystal Bracelets | Healing Crystals & Gemstones',
    description: 'Discover authentic natural crystal bracelets for healing, protection, and spiritual growth across North America. Find your perfect crystal match based on your birthdate. Fast shipping to USA & Canada.',
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
              "url": "https://celestialcrystals.com",
              "logo": "https://celestialcrystals.com/logo.png",
              "image": "https://celestialcrystals.com/og-image.jpg",
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
              <AnalyticsTracker />
              <Header />
              <main className="min-h-screen bg-background">{children}</main>
              <Footer />
              <ShoppingCart />
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
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