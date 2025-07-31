import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Gem, Shield, Heart, Zap, Star, Truck, Award, CheckCircle } from 'lucide-react';
import { crystalDatabase } from '@/data/crystals';

export const metadata: Metadata = {
  title: 'Natural Crystal Bracelet USA | Authentic Healing Crystals | CELESTIAL',
  description: 'Premium natural crystal bracelets in USA. Authentic healing crystals including Tiger Eye, Amethyst, Rose Quartz. Fast shipping across United States. Shop genuine gemstone bracelets at CELESTIAL.',
  keywords: [
    'natural crystal bracelet usa',
    'healing crystal bracelet usa',
    'authentic crystal bracelet usa',
    'gemstone bracelet usa',
    'tiger eye bracelet usa',
    'amethyst bracelet usa',
    'rose quartz bracelet usa',
    'chakra bracelet usa',
    'crystal jewelry usa',
    'spiritual bracelet usa',
    'natural crystal bracelet united states',
    'healing crystals america',
    'crystal bracelets online usa'
  ],
  openGraph: {
    title: 'Natural Crystal Bracelet USA | Authentic Healing Crystals',
    description: 'Premium natural crystal bracelets in USA. Authentic healing crystals including Tiger Eye, Amethyst, Rose Quartz. Fast shipping across United States.',
    url: 'https://thecelestial.xyz/natural-crystal-bracelet-usa',
    type: 'website',
    images: [
      {
        url: 'https://thecelestial.xyz/images/natural-crystal-bracelets-usa.jpg',
        width: 1200,
        height: 630,
        alt: 'Natural Crystal Bracelets USA - CELESTIAL'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Natural Crystal Bracelet USA | Authentic Healing Crystals',
    description: 'Premium natural crystal bracelets in USA. Authentic healing crystals including Tiger Eye, Amethyst, Rose Quartz. Fast shipping across United States.',
    images: ['https://thecelestial.xyz/images/natural-crystal-bracelets-usa.jpg']
  }
};

export default function NaturalCrystalBraceletUSA() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Natural Crystal Bracelets USA
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto">
            Discover authentic healing crystal bracelets across the United States. Premium quality gemstones
            with fast shipping to all 50 states. Transform your energy with genuine crystals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/crystals"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Shop Crystal Bracelets
            </Link>
            <Link
              href="/birthdate-guide"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
            >
              Find Your Crystal
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose CELESTIAL for USA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Americans Choose CELESTIAL Crystal Bracelets
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <Truck className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Fast USA Shipping</h3>
              <p className="text-gray-700">Free shipping on orders over $50. Express delivery to all 50 states including Alaska and Hawaii.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Authentic Crystals</h3>
              <p className="text-gray-700">100% genuine natural crystals sourced ethically. Each bracelet comes with authenticity guarantee.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-teal-50">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">30-Day Returns</h3>
              <p className="text-gray-700">Not satisfied? Return within 30 days for full refund. Your satisfaction is our priority.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Crystals in USA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Most Popular Crystal Bracelets in USA
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(() => {
              // Get specific crystals from database
              const featuredCrystals = [
                crystalDatabase.find(c => c.name.toLowerCase().includes('tiger eye')),
                crystalDatabase.find(c => c.name.toLowerCase().includes('amethyst')),
                crystalDatabase.find(c => c.name.toLowerCase().includes('rose quartz')),
                crystalDatabase.find(c => c.name.toLowerCase().includes('obsidian'))
              ].filter(Boolean);

              return featuredCrystals.map((crystal, index) => (
                <div key={crystal?.id || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-100">
                    {crystal?.image ? (
                      <Image
                        src={crystal.image}
                        alt={`${crystal.name} Crystal Bracelet`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                        <Gem className="w-12 h-12 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{crystal?.name || 'Crystal'} Bracelet</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {crystal?.properties?.[0] || 'Healing & Protection'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-purple-600">${crystal?.price || '39'}</span>
                      <Link
                        href={crystal ? `/crystals/${crystal.id}` : '/crystals'}
                        className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700 transition-colors"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* USA Shipping Information */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Nationwide USA Delivery</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Standard Shipping</h3>
              <p className="text-gray-700">5-7 business days to all US states</p>
              <p className="text-sm text-gray-500 mt-2">Free on orders over $50</p>
            </div>
            <div className="p-6 border rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Express Shipping</h3>
              <p className="text-gray-700">2-3 business days nationwide</p>
              <p className="text-sm text-gray-500 mt-2">$15 flat rate</p>
            </div>
          </div>
          <p className="mt-8 text-gray-600">
            We ship to all 50 states including Alaska, Hawaii, and US territories.
            Track your order with real-time updates.
          </p>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Natural Crystal Bracelets: America's Growing Wellness Trend
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              Across the United States, from California to New York, Americans are discovering the transformative
              power of natural crystal bracelets. These authentic gemstone accessories combine ancient wisdom
              with modern style, offering both aesthetic beauty and potential wellness benefits.
            </p>
            <p className="mb-6">
              At CELESTIAL, we specialize in providing high-quality natural crystal bracelets to customers
              throughout the USA. Our collection features genuine stones like Tiger Eye for confidence,
              Amethyst for tranquility, and Rose Quartz for emotional healing.
            </p>
            <p className="mb-6">
              Whether you're in bustling cities like Los Angeles, Chicago, or Miami, or in smaller towns
              across America, our fast shipping ensures you receive your crystal bracelets quickly and safely.
              Each bracelet is carefully selected for quality and authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Start Your Crystal Journey Today</h2>
          <p className="text-xl mb-8">Join thousands of Americans who trust CELESTIAL for authentic crystal bracelets</p>
          <Link
            href="/crystals"
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Shop Crystal Bracelets Now
          </Link>
        </div>
      </section>
    </div>
  );
}
