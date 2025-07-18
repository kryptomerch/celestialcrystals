'use client';

import { Sparkles, Heart, Shield, Star, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-5xl font-light text-gray-900">About CELESTIAL</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe in the transformative power of natural crystals and their ability to enhance your spiritual journey,
            promote healing, and bring positive energy into your life.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
          </div>

          <div className="celestial-card p-8">
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                CELESTIAL was born from a deep passion for the ancient wisdom of crystal healing and a desire to make
                authentic, high-quality crystals accessible to everyone on their spiritual journey. Our founder discovered
                the transformative power of crystals during a personal period of growth and healing, and was inspired to
                share this gift with others.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                What started as a small collection of personally sourced crystals has grown into a carefully curated
                selection of the finest natural gemstones from around the world. Each crystal in our collection is
                hand-selected for its quality, authenticity, and energetic properties.
              </p>

              <p className="text-lg leading-relaxed">
                We believe that the right crystal chooses you as much as you choose it. That's why we've created tools
                like our birthdate guide to help you discover crystals that resonate with your unique energy and life path.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do, from sourcing our crystals to serving our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="celestial-card p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Authenticity</h3>
                <p className="text-gray-600">
                  Every crystal is genuine and natural, sourced directly from trusted suppliers who share our commitment to quality.
                </p>
              </div>

              <div className="celestial-card p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Integrity</h3>
                <p className="text-gray-600">
                  We provide honest information about each crystal's properties and origins, helping you make informed choices.
                </p>
              </div>

              <div className="celestial-card p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Transformation</h3>
                <p className="text-gray-600">
                  We're dedicated to supporting your personal growth and spiritual journey through the power of crystals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Why Choose CELESTIAL</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're more than just a crystal shop – we're your partners in spiritual growth and healing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="celestial-card p-6">
                <div className="flex items-center mb-4">
                  <Star className="w-6 h-6 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Premium Quality</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Each crystal is carefully inspected and selected for its exceptional quality, clarity, and energetic properties.
                </p>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Expert Knowledge</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Our team has years of experience in crystal healing and metaphysical practices, providing you with accurate guidance.
                </p>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Community Support</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Join our community of crystal enthusiasts and receive ongoing support for your spiritual journey.
                </p>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Satisfaction Guarantee</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  We stand behind every crystal we sell with our 30-day satisfaction guarantee and hassle-free returns.
                </p>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-6 h-6 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Personalized Guidance</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Our birthdate guide and personalized recommendations help you find crystals perfectly aligned with your energy.
                </p>
              </div>

              <div className="celestial-card p-6">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Ethical Sourcing</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  We work with suppliers who practice ethical mining and fair trade, ensuring positive impact on communities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="celestial-card p-12">
              <h2 className="text-3xl font-light text-gray-900 mb-8">Our Mission</h2>
              <blockquote className="text-xl text-gray-600 italic leading-relaxed">
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
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Ready to Begin Your Crystal Journey?</h2>
            <p className="text-gray-600 text-lg mb-8">
              Explore our collection or get in touch with our team for personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/crystals"
                className="celestial-button inline-flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Shop Crystals
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-3 font-medium border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm uppercase tracking-wide"
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
