import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Gem, Shield, Heart, Zap, Star, Truck, Award, CheckCircle, Globe } from 'lucide-react';
import { crystalDatabase } from '@/data/crystals';

export const metadata: Metadata = {
  title: 'Natural Crystal Bracelet North America | USA & Canada | CELESTIAL',
  description: 'Premium natural crystal bracelets across North America. Authentic healing crystals with fast shipping to USA and Canada. Shop genuine gemstone bracelets at CELESTIAL.',
  keywords: [
    'natural crystal bracelet north america',
    'crystal bracelet usa canada',
    'healing crystal bracelet america',
    'authentic crystal bracelet north america',
    'gemstone bracelet usa canada',
    'crystal jewelry north america',
    'spiritual bracelet america',
    'natural crystals usa canada',
    'healing crystals north america',
    'crystal bracelets online america'
  ],
  openGraph: {
    title: 'Natural Crystal Bracelet North America | USA & Canada',
    description: 'Premium natural crystal bracelets across North America. Authentic healing crystals with fast shipping to USA and Canada.',
    url: 'https://thecelestial.xyz/natural-crystal-bracelet-north-america',
    type: 'website',
    images: [
      {
        url: 'https://thecelestial.xyz/images/natural-crystal-bracelets-north-america.jpg',
        width: 1200,
        height: 630,
        alt: 'Natural Crystal Bracelets North America - CELESTIAL'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Natural Crystal Bracelet North America | USA & Canada',
    description: 'Premium natural crystal bracelets across North America. Authentic healing crystals with fast shipping to USA and Canada.',
    images: ['https://thecelestial.xyz/images/natural-crystal-bracelets-north-america.jpg']
  }
};

export default function NaturalCrystalBraceletNorthAmerica() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            #1 Crystal Bracelets in North America
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto">
            Leading supplier of authentic healing crystal bracelets across USA and Canada.
            Premium quality gemstones with fast shipping throughout North America.
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
              Find Your Perfect Crystal
            </Link>
          </div>
        </div>
      </section>

      {/* North America Coverage */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Serving All of North America
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">🇺🇸 United States Coverage</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-3" />All 50 states including Alaska & Hawaii</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-3" />Major cities: NYC, LA, Chicago, Houston, Phoenix</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-3" />Free shipping on orders over $50</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-3" />2-7 business days delivery</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">🇨🇦 Canada Coverage</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-3" />All provinces and territories</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-3" />Major cities: Toronto, Vancouver, Montreal, Calgary</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-3" />Free shipping on orders over $65 CAD</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-3" />3-10 business days delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're #1 in North America */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why We're North America's #1 Crystal Bracelet Store
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Continental Reach</h3>
              <p className="text-gray-600 text-sm">Serving millions across USA and Canada with reliable shipping networks</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600 text-sm">Hand-selected authentic crystals with quality guarantee</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">50,000+ Happy Customers</h3>
              <p className="text-gray-600 text-sm">Trusted by crystal enthusiasts across North America</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">30-Day Guarantee</h3>
              <p className="text-gray-600 text-sm">Risk-free shopping with full money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Selling Crystals */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Top-Selling Crystal Bracelets in North America
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {(() => {
              // Get specific crystals from database with rankings
              const featuredCrystals = [
                { crystal: crystalDatabase.find(c => c.name.toLowerCase().includes('tiger eye')), rank: '#1' },
                { crystal: crystalDatabase.find(c => c.name.toLowerCase().includes('amethyst')), rank: '#2' },
                { crystal: crystalDatabase.find(c => c.name.toLowerCase().includes('rose quartz')), rank: '#3' },
                { crystal: crystalDatabase.find(c => c.name.toLowerCase().includes('obsidian')), rank: '#4' },
                { crystal: crystalDatabase.find(c => c.name.toLowerCase().includes('clear quartz')), rank: '#5' }
              ].filter(item => item.crystal);

              return featuredCrystals.map((item, index) => (
                <div key={item.crystal?.id || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    {item.rank}
                  </div>
                  <div className="relative h-40 bg-gray-100">
                    {item.crystal?.image ? (
                      <Image
                        src={item.crystal.image}
                        alt={`${item.crystal.name} Crystal Bracelet`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                        <Gem className="w-8 h-8 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.crystal?.name || 'Crystal'}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {item.crystal?.properties?.[0] || 'Healing & Protection'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-purple-600">${item.crystal?.price || '39'}</span>
                      <Link
                        href={item.crystal ? `/crystals/${item.crystal.id}` : '/crystals'}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            The Ultimate Guide to Natural Crystal Bracelets in North America
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              From the bustling streets of New York City to the serene landscapes of British Columbia,
              natural crystal bracelets have become North America's fastest-growing wellness trend.
              CELESTIAL leads this movement, providing authentic healing crystals to millions across
              the United States and Canada.
            </p>
            <p>
              Our extensive collection features premium gemstones sourced from the finest mines worldwide.
              Whether you're seeking Tiger Eye for confidence in Los Angeles, Amethyst for tranquility
              in Toronto, or Rose Quartz for emotional healing in Chicago, we deliver authentic crystals
              with unmatched quality and service.
            </p>
            <p>
              With distribution centers strategically located across North America, we ensure fast,
              reliable shipping to every corner of the continent. From Alaska's remote communities
              to Florida's sunny beaches, from Newfoundland's coastal towns to California's tech hubs,
              CELESTIAL brings the power of natural crystals to your doorstep.
            </p>
            <h3 className="text-2xl font-semibold mt-8 mb-4">Why Choose CELESTIAL for Your Crystal Journey?</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Largest selection of authentic crystal bracelets in North America</li>
              <li>Fast shipping to all US states and Canadian provinces</li>
              <li>Quality guarantee on every purchase</li>
              <li>Expert customer service team</li>
              <li>Competitive pricing with frequent promotions</li>
              <li>Educational resources to guide your crystal journey</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Join North America's Crystal Revolution</h2>
          <p className="text-xl mb-8">Over 50,000 customers trust CELESTIAL for authentic crystal bracelets</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/crystals"
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Shop Now - Free Shipping Over $50
            </Link>
            <Link
              href="/natural-crystal-bracelet-usa"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-colors inline-block"
            >
              USA Customers
            </Link>
            <Link
              href="/natural-crystal-bracelet-canada"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-colors inline-block"
            >
              Canada Customers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
