'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, BookOpen, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BannerSlide {
  id: string;
  type: 'product' | 'blog';
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
  readTime?: number;
  category?: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 'product-featured',
    type: 'product',
    title: 'Discover Your Perfect Crystal',
    subtitle: 'Premium Healing Crystal Bracelets',
    description: 'Handcrafted with authentic gemstones, each bracelet is designed to enhance your spiritual journey and bring positive energy into your life.',
    buttonText: 'Shop Collection',
    buttonLink: '/crystals',
    backgroundImage: 'url(/images/cover-image.png)',
    backgroundColor: '#667eea',
    textColor: 'black'
  },
  {
    id: 'blog-lava-chakra',
    type: 'blog',
    title: 'Lava 7 Chakra Bracelet Guide',
    subtitle: 'Complete Chakra Balancing & Grounding',
    description: 'Discover the powerful combination of volcanic lava stone and seven chakra stones. Learn about chakra balancing, grounding properties, and spiritual healing.',
    buttonText: 'Read Full Guide',
    buttonLink: '/blog/lava-7-chakra-complete-guide',
    backgroundImage: 'url(/images/cover-image.png)',
    backgroundColor: 'transparent',
    textColor: 'black',
    readTime: 8,
    category: 'Chakra Healing'
  },
  {
    id: 'blog-turquoise',
    type: 'blog',
    title: 'Turquoise Crystal Healing Properties',
    subtitle: 'Ancient Wisdom for Modern Healing',
    description: 'Explore 7,000 years of turquoise wisdom - from ancient Egyptian pharaohs to modern crystal therapy. Learn about protection, communication, and spiritual benefits.',
    buttonText: 'Explore Ancient Wisdom',
    buttonLink: '/blog/turquoise-healing-properties-guide',
    backgroundImage: 'url(/images/cover-image.png)',
    backgroundColor: 'transparent',
    textColor: 'black',
    readTime: 10,
    category: 'Crystal Healing'
  }
];

export default function SlidingBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = bannerSlides[currentSlide];

  return (
    <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background image with frosted glass effect */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out bg-cover bg-center bg-no-repeat"
        style={{
          background: currentSlideData.backgroundImage,
          backgroundSize: currentSlideData.backgroundImage.startsWith('url(') ? 'cover' : 'auto',
          backgroundPosition: currentSlideData.backgroundImage.startsWith('url(') ? 'center' : 'initial',
          backgroundRepeat: currentSlideData.backgroundImage.startsWith('url(') ? 'no-repeat' : 'initial',
          filter: 'blur(2px)'
        }}
      />

      {/* Frosted glass overlay for text readability */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Category/Type Badge */}
            <div className="mb-4">
              {currentSlideData.type === 'blog' ? (
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center bg-white/70 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-medium border border-white/50 text-black shadow-lg">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {currentSlideData.category}
                  </span>
                  {currentSlideData.readTime && (
                    <span className="inline-flex items-center text-sm text-black/90">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentSlideData.readTime} min read
                    </span>
                  )}
                </div>
              ) : (
                <span className={`inline-flex items-center backdrop-blur-lg px-4 py-2 rounded-full text-sm font-medium border ${currentSlideData.textColor === 'black' ? 'bg-white/60 text-black border-white/40' : 'bg-white/20 text-white border-white/30'}`}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Featured Collection
                </span>
              )}
            </div>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl mb-4 font-light text-black/90">
              {currentSlideData.subtitle}
            </p>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 leading-tight text-black">
              {currentSlideData.title}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl text-black/90">
              {currentSlideData.description}
            </p>

            {/* CTA Button */}
            <Link
              href={currentSlideData.buttonLink}
              className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors group"
            >
              {currentSlideData.buttonText}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-lg hover:bg-white/80 text-black p-3 rounded-full transition-colors shadow-lg border border-white/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-lg hover:bg-white/80 text-black p-3 rounded-full transition-colors shadow-lg border border-white/50"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border ${index === currentSlide
              ? 'bg-black scale-125 border-black'
              : 'bg-black/50 hover:bg-black/75 border-black/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <div
          className="h-full bg-black transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / bannerSlides.length) * 100}%`
          }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-white/70 backdrop-blur-lg text-black px-4 py-2 rounded-full text-sm font-medium border border-white/50 shadow-lg">
        {currentSlide + 1} / {bannerSlides.length}
      </div>
    </div>
  );
}
