'use client';

import { useState } from 'react';
import AIImageGenerator from '@/components/AIImageGenerator';
import { Wand2, Info, Zap, DollarSign, Clock } from 'lucide-react';

export default function AIImagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Wand2 className="w-10 h-10 text-purple-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AI Image Generator</h1>
              <p className="text-gray-600 mt-2">Generate stunning crystal bracelet images using AI</p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-900">100% Free</h3>
              </div>
              <p className="text-green-800 text-sm">
                Flux.1-schnell model is completely free with no usage limits on Together AI
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Lightning Fast</h3>
              </div>
              <p className="text-blue-800 text-sm">
                Generate high-quality 1024x1024 images in just 2-4 seconds
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Zap className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-900">High Quality</h3>
              </div>
              <p className="text-purple-800 text-sm">
                Professional-grade images perfect for product listings and marketing
              </p>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Setup Required</h3>
                <div className="text-yellow-800 space-y-2">
                  <p>To use AI image generation, you need a Together AI API key:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Go to <a href="https://api.together.xyz" target="_blank" rel="noopener noreferrer" className="underline font-medium">api.together.xyz</a></li>
                    <li>Sign up for a free account</li>
                    <li>Get your API key from the dashboard</li>
                    <li>Add <code className="bg-yellow-100 px-2 py-1 rounded">TOGETHER_API_KEY=your_key_here</code> to your .env file</li>
                    <li>Restart your development server</li>
                  </ol>
                  <p className="mt-3 font-medium">
                    💡 The free tier includes Flux.1-schnell with unlimited generations!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Image Generator Component */}
        <AIImageGenerator />

        {/* Usage Examples */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Photography</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-gray-900">Crystal: "Tiger Eye"</p>
                  <p className="text-sm text-gray-600">Style: Product Photo</p>
                  <p className="text-xs text-gray-500 mt-1">Perfect for product listings with clean white background</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-gray-900">Crystal: "Amethyst"</p>
                  <p className="text-sm text-gray-600">Style: Product Photo</p>
                  <p className="text-xs text-gray-500 mt-1">Professional studio lighting and detailed texture</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Content</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-gray-900">Crystal: "Rose Quartz"</p>
                  <p className="text-sm text-gray-600">Style: Lifestyle Photo</p>
                  <p className="text-xs text-gray-500 mt-1">Person wearing bracelet in natural setting</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-gray-900">Crystal: "Moonstone"</p>
                  <p className="text-sm text-gray-600">Style: Social Media</p>
                  <p className="text-xs text-gray-500 mt-1">Instagram-ready flat lay with aesthetic arrangement</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Use specific crystal names for better results (e.g., "Tiger Eye" vs "brown crystal")</li>
              <li>• Product style works best for e-commerce listings</li>
              <li>• Lifestyle style is perfect for social media and marketing</li>
              <li>• Artistic style creates mystical, spiritual imagery</li>
              <li>• Try different models - Flux.1-schnell is fastest, SDXL is most detailed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
