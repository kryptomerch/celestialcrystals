'use client';

import { Sparkles, Heart, Shield, Star, Award, Users } from 'lucide-react';
import { getCrystalGlowClass } from '@/utils/crystal-glow';
import { useTheme } from '@/contexts/ThemeContext';

// Map about sections to crystal colors for glow effects
const getAboutGlowClass = (title: string): string => {
  const aboutColors: { [key: string]: string[] } = {
    'Our Mission': ['purple'], // spiritual mission = purple
    'Quality Promise': ['blue'], // trust/reliability = blue
    'Expert Curation': ['green'], // knowledge/growth = green
    'Community': ['pink'], // love/connection = pink
    'Authenticity': ['white'], // purity/truth = white
    'Customer Care': ['green'], // care/healing = green
    'Values': ['purple'], // spiritual values = purple
    'Story': ['golden'], // wisdom/experience = golden
  };

  const colors = aboutColors[title] || ['purple']; // default purple
  return getCrystalGlowClass(colors);
};

export default function AboutPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Hero Section */}
      <div className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <h1 className={`text-6xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>About Us</h1>
          </div>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-white' : 'text-gray-600'}`}>
            We believe in the transformative power of natural crystals and their ability to enhance your spiritual journey,
            promote healing, and bring positive energy into your life.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Story</h2>
            <div className={`w-24 h-1 mx-auto ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          </div>

          <div className={`celestial-card p-8 ${getAboutGlowClass('Story')}`}>
            <div className={`prose prose-lg mx-auto ${isDark ? 'text-white' : 'text-gray-600'}`}>
              <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                CELESTIAL was born from a deep passion for the ancient wisdom of crystal healing and a desire to make
                authentic, high-quality crystals accessible to everyone on their spiritual journey. Our founder discovered
                the transformative power of crystals during a personal period of growth and healing, and was inspired to
                share this gift with others.
              </p>

              <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                What started as a small collection of personally sourced crystals has grown into a carefully curated
                selection of the finest natural gemstones from around the world. Each crystal in our collection is
                hand-selected for its quality, authenticity, and energetic properties.
              </p>

              <p className={`text-lg leading-relaxed ${isDark ? 'text-white' : 'text-gray-600'}`}>
                We believe that the right crystal chooses you as much as you choose it. That's why we've created tools
                like our birthdate guide to help you discover crystals that resonate with your unique energy and life path.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Values</h2>
              <p className={`max-w-2xl mx-auto ${isDark ? 'text-white' : 'text-gray-600'}`}>
                These core values guide everything we do, from sourcing our crystals to serving our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`celestial-card p-6 text-center ${getAboutGlowClass('Authenticity')}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Heart className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className={`text-xl font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Authenticity</h3>
                <p className={`${isDark ? 'text-white' : 'text-gray-600'}`}>
                  Every crystal is genuine and natural, sourced directly from trusted suppliers who share our commitment to quality.
                </p>
              </div>

              <div className={`celestial-card p-6 text-center ${getAboutGlowClass('Values')}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Shield className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className={`text-xl font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Integrity</h3>
                <p className={`${isDark ? 'text-white' : 'text-gray-600'}`}>
                  We provide honest information about each crystal's properties and origins, helping you make informed choices.
                </p>
              </div>

              <div className={`celestial-card p-6 text-center ${getAboutGlowClass('Values')}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Sparkles className={`w-8 h-8 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className={`text-xl font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Transformation</h3>
                <p className={`${isDark ? 'text-white' : 'text-gray-600'}`}>
                  We're dedicated to supporting your personal growth and spiritual journey through the power of crystals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Why Choose CELESTIAL</h2>
              <p className={`max-w-2xl mx-auto ${isDark ? 'text-white' : 'text-gray-600'}`}>
                We're more than just a crystal shop – we're your partners in spiritual growth and healing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className={`celestial-card p-6 ${getAboutGlowClass('Quality Promise')}`}>
                <div className="flex items-center mb-4">
                  <Star className={`w-6 h-6 mr-2 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Premium Quality</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  Each crystal is carefully inspected and selected for its exceptional quality, clarity, and energetic properties.
                </p>
              </div>

              <div className={`celestial-card p-6 ${getAboutGlowClass('Expert Curation')}`}>
                <div className="flex items-center mb-4">
                  <Award className={`w-6 h-6 mr-2 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Expert Knowledge</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  Our team has years of experience in crystal healing and metaphysical practices, providing you with accurate guidance.
                </p>
              </div>

              <div className={`celestial-card p-6 ${getAboutGlowClass('Community')}`}>
                <div className="flex items-center mb-4">
                  <Users className={`w-6 h-6 mr-2 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Community Support</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  Join our community of crystal enthusiasts and receive ongoing support for your spiritual journey.
                </p>
              </div>

              <div className={`celestial-card p-6 ${getAboutGlowClass('Quality Promise')}`}>
                <div className="flex items-center mb-4">
                  <Shield className={`w-6 h-6 mr-2 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Satisfaction Guarantee</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  We stand behind every crystal we sell with our 30-day satisfaction guarantee and hassle-free returns.
                </p>
              </div>

              <div className={`celestial-card p-6 ${getAboutGlowClass('Customer Care')}`}>
                <div className="flex items-center mb-4">
                  <Sparkles className={`w-6 h-6 mr-2 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Personalized Guidance</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  Our birthdate guide and personalized recommendations help you find crystals perfectly aligned with your energy.
                </p>
              </div>

              <div className={`celestial-card p-6 ${getAboutGlowClass('Values')}`}>
                <div className="flex items-center mb-4">
                  <Heart className={`w-6 h-6 mr-2 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Ethical Sourcing</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  We work with suppliers who practice ethical mining and fair trade, ensuring positive impact on communities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className={`celestial-card p-12 ${getAboutGlowClass('Our Mission')}`}>
              <h2 className={`text-3xl font-light mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Mission</h2>
              <blockquote className={`text-xl italic leading-relaxed ${isDark ? 'text-white' : 'text-gray-600'}`}>
                "To empower individuals on their spiritual journey by providing authentic, high-quality crystals
                and the knowledge to use them effectively. We believe that everyone deserves access to the healing
                and transformative power of natural crystals, and we're committed to making that vision a reality."
              </blockquote>
              <div className="mt-8">
                <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className={`py-16 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={`text-3xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to Begin Your Crystal Journey?</h2>
            <p className={`text-lg mb-8 ${isDark ? 'text-white' : 'text-gray-600'}`}>
              Explore our collection or get in touch with our team for personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/crystals"
                className={`inline-flex items-center justify-center px-8 py-3 font-medium transition-all duration-200 text-sm uppercase tracking-wide ${
                  isDark 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Shop Crystals
              </a>
              <a
                href="/contact"
                className={`inline-flex items-center justify-center px-8 py-3 font-medium border-2 transition-all duration-200 text-sm uppercase tracking-wide ${
                  isDark
                    ? 'bg-transparent text-white border-gray-600 hover:bg-gray-800 hover:border-gray-500'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
