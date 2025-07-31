import { Metadata } from 'next';
import Link from 'next/link';
import { Gem, Shield, Heart, Zap, Star, Truck, Award, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Natural Crystal Bracelet Canada | Authentic Healing Crystals | CELESTIAL',
  description: 'Premium natural crystal bracelets in Canada. Authentic healing crystals including Tiger Eye, Amethyst, Rose Quartz. Fast shipping across Canada. Shop genuine gemstone bracelets at CELESTIAL.',
  keywords: [
    'natural crystal bracelet canada',
    'healing crystal bracelet canada',
    'authentic crystal bracelet canada',
    'gemstone bracelet canada',
    'tiger eye bracelet canada',
    'amethyst bracelet canada',
    'rose quartz bracelet canada',
    'chakra bracelet canada',
    'crystal jewelry canada',
    'spiritual bracelet canada'
  ],
  openGraph: {
    title: 'Natural Crystal Bracelet Canada | Authentic Healing Crystals',
    description: 'Premium natural crystal bracelets in Canada. Authentic healing crystals including Tiger Eye, Amethyst, Rose Quartz. Fast shipping across Canada.',
    url: 'https://thecelestial.xyz/natural-crystal-bracelet-canada',
    type: 'website',
    images: [
      {
        url: 'https://thecelestial.xyz/images/natural-crystal-bracelets-canada.jpg',
        width: 1200,
        height: 630,
        alt: 'Natural Crystal Bracelets Canada - CELESTIAL'
      }
    ]
  }
};

export default function NaturalCrystalBraceletCanadaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Natural Crystal Bracelet Canada
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-4xl mx-auto">
            Discover authentic healing crystal bracelets crafted with premium natural gemstones. 
            Fast shipping across Canada with genuine crystals sourced ethically worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link 
              href="/crystals" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Shop Crystal Bracelets
            </Link>
            <Link 
              href="/categories" 
              className="border-2 border-purple-400 text-purple-200 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Why Choose CELESTIAL for Natural Crystal Bracelets in Canada?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">Authentic Natural Crystals</h3>
              <p className="text-purple-200">
                Every crystal bracelet is made with genuine, natural gemstones. No synthetic or treated stones - only authentic crystals with real healing properties.
              </p>
            </div>
            <div className="text-center">
              <Truck className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">Fast Canada Shipping</h3>
              <p className="text-purple-200">
                Free shipping across Canada on orders over $75. Express shipping available. From Vancouver to Toronto, Halifax to Calgary - we deliver nationwide.
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">Quality Guarantee</h3>
              <p className="text-purple-200">
                30-day money-back guarantee on all crystal bracelets. If you're not satisfied with your natural crystal bracelet, we'll make it right.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Crystals Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Popular Natural Crystal Bracelets in Canada
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Tiger Eye Bracelet',
                description: 'Protection, courage, and confidence',
                icon: <Gem className="w-8 h-8 text-yellow-600" />,
                benefits: ['Enhances willpower', 'Promotes mental clarity', 'Attracts good luck']
              },
              {
                name: 'Amethyst Bracelet',
                description: 'Spiritual growth and inner peace',
                icon: <Star className="w-8 h-8 text-purple-400" />,
                benefits: ['Calms the mind', 'Enhances intuition', 'Promotes restful sleep']
              },
              {
                name: 'Rose Quartz Bracelet',
                description: 'Love, compassion, and emotional healing',
                icon: <Heart className="w-8 h-8 text-pink-400" />,
                benefits: ['Opens the heart chakra', 'Attracts love', 'Heals emotional wounds']
              },
              {
                name: 'Black Tourmaline Bracelet',
                description: 'Protection from negative energy',
                icon: <Shield className="w-8 h-8 text-gray-600" />,
                benefits: ['Blocks negative energy', 'Grounds and centers', 'EMF protection']
              }
            ].map((crystal, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="mb-4">{crystal.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{crystal.name}</h3>
                <p className="text-purple-200 mb-4">{crystal.description}</p>
                <ul className="text-sm text-purple-300 space-y-1">
                  {crystal.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Natural Crystal Bracelets Canada - Your Guide to Authentic Healing Crystals
          </h2>
          <div className="prose prose-lg text-purple-200 space-y-6">
            <p>
              Welcome to CELESTIAL, Canada's premier destination for authentic natural crystal bracelets. 
              Our collection features genuine healing crystals and gemstones carefully selected for their 
              quality, beauty, and metaphysical properties.
            </p>
            <p>
              Each natural crystal bracelet in our collection is handcrafted with authentic gemstones 
              sourced from trusted suppliers worldwide. Whether you're seeking protection with Tiger Eye, 
              spiritual growth with Amethyst, or love and compassion with Rose Quartz, we have the perfect 
              crystal bracelet for your journey.
            </p>
            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">
              Why Natural Crystal Bracelets Are Popular in Canada
            </h3>
            <p>
              Canadians are increasingly turning to natural crystal bracelets for their healing properties 
              and spiritual benefits. From Vancouver's wellness communities to Toronto's spiritual seekers, 
              crystal bracelets have become a popular way to carry positive energy throughout the day.
            </p>
            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">
              Fast Shipping Across Canada
            </h3>
            <p>
              We ship natural crystal bracelets to every province and territory in Canada. Whether you're 
              in British Columbia, Alberta, Ontario, Quebec, or the Maritime provinces, your authentic 
              crystal bracelet will arrive quickly and safely.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Your Crystal Journey Today
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Discover the perfect natural crystal bracelet for your needs. 
            Browse our collection of authentic healing crystals with fast shipping across Canada.
          </p>
          <Link 
            href="/crystals" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-lg font-semibold text-xl transition-all transform hover:scale-105"
          >
            Shop Natural Crystal Bracelets
          </Link>
        </div>
      </section>
    </div>
  );
}
