'use client';

import { useState, useEffect } from 'react';
import { Wand2, Download, Copy, Sparkles, Image as ImageIcon, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface GeneratedImage {
  url: string;
  prompt: string;
  model: string;
  seed: number;
}

export default function AIImageGenerator() {
  const [crystalName, setCrystalName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('product');
  const [selectedModel, setSelectedModel] = useState('flux-schnell');
  const [customPrompt, setCustomPrompt] = useState('');
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState('');
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [checkingApiKey, setCheckingApiKey] = useState(true);

  const styles = {
    product: 'Product Photo (White Background)',
    lifestyle: 'Lifestyle Photo (Person Wearing)',
    artistic: 'Artistic Arrangement (Mystical)',
    social: 'Social Media (Flat Lay)'
  };

  const models = {
    'flux-schnell': 'Flux.1-schnell (Fast & Free)',
    'sdxl': 'Stable Diffusion XL (Detailed)',
    'playground': 'Playground v2.5 (Artistic)'
  };

  // Check if API key is configured
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch('/api/generate-image');
        const data = await response.json();
        setApiKeyConfigured(data.success || !data.error?.includes('API key'));
      } catch (error) {
        setApiKeyConfigured(false);
      } finally {
        setCheckingApiKey(false);
      }
    };

    checkApiKey();
  }, []);

  const handleGenerate = async () => {
    if (!crystalName.trim() && !customPrompt.trim()) {
      setError('Please enter a crystal name or custom prompt');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crystalName: useCustomPrompt ? undefined : crystalName,
          style: selectedStyle,
          model: selectedModel,
          customPrompt: useCustomPrompt ? customPrompt : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newImage: GeneratedImage = {
          url: data.imageUrl,
          prompt: data.metadata.prompt,
          model: data.metadata.model,
          seed: data.metadata.seed
        };
        setGeneratedImages(prev => [newImage, ...prev]);
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // Show setup instructions if API key is not configured
  if (checkingApiKey) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mr-3" />
          <span className="text-gray-600">Checking API configuration...</span>
        </div>
      </div>
    );
  }

  if (!apiKeyConfigured) {
    const [testApiKey, setTestApiKey] = useState('');
    const [testingKey, setTestingKey] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean, message: string } | null>(null);

    const handleTestApiKey = async () => {
      if (!testApiKey.trim()) {
        setTestResult({ success: false, message: 'Please enter an API key to test' });
        return;
      }

      setTestingKey(true);
      setTestResult(null);

      try {
        const response = await fetch('/api/test-together-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey: testApiKey }),
        });

        const data = await response.json();
        setTestResult({
          success: data.success,
          message: data.success ? data.message : data.error
        });
      } catch (error) {
        setTestResult({
          success: false,
          message: 'Failed to test API key. Please check your connection.'
        });
      } finally {
        setTestingKey(false);
      }
    };

    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">Setup Required</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Together AI API Key Not Found</h3>
          <p className="text-red-800 mb-4">
            To use AI image generation, you need to add your Together AI API key to the environment variables.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-red-900 mb-2">Step 1: Get Your Free API Key</h4>
              <a
                href="https://api.together.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
              >
                Visit Together AI Dashboard <ExternalLink className="w-4 h-4 ml-1" />
              </a>
              <p className="text-sm text-red-700 mt-1">Sign up for free and get your API key from the dashboard</p>
            </div>

            <div>
              <h4 className="font-semibold text-red-900 mb-2">Step 2: Add to Environment</h4>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                TOGETHER_API_KEY=your_api_key_here
              </div>
              <p className="text-sm text-red-700 mt-1">Add this line to your .env file and restart the server</p>
            </div>

            <div>
              <h4 className="font-semibold text-red-900 mb-2">Step 3: Test Your API Key</h4>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={testApiKey}
                  onChange={(e) => setTestApiKey(e.target.value)}
                  placeholder="Paste your Together AI API key here to test..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleTestApiKey}
                  disabled={testingKey}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {testingKey ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Key'
                  )}
                </button>
              </div>

              {testResult && (
                <div className={`mt-3 p-3 rounded-lg ${testResult.success
                    ? 'bg-green-100 border border-green-300 text-green-800'
                    : 'bg-red-100 border border-red-300 text-red-800'
                  }`}>
                  {testResult.message}
                  {testResult.success && (
                    <div className="mt-2 text-sm">
                      ✅ Your API key works! Now add it to your .env file and restart the server.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-red-900 mb-2">Step 4: Add to .env File</h4>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                TOGETHER_API_KEY="your_actual_api_key_here"
              </div>
              <p className="text-sm text-red-700 mt-1">Replace the placeholder in your .env file with your actual API key</p>
            </div>

            <div>
              <h4 className="font-semibold text-red-900 mb-2">Step 5: Restart Server</h4>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                npm run dev
              </div>
              <p className="text-sm text-red-700 mt-1">Restart your development server to load the new environment variable</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Why Together AI?</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• <strong>Completely FREE</strong> - Flux.1-schnell model has no usage limits</li>
            <li>• <strong>Lightning Fast</strong> - Generate images in 2-4 seconds</li>
            <li>• <strong>High Quality</strong> - Professional 1024x1024 images</li>
            <li>• <strong>No Credit Card</strong> - Free signup, no payment required</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <Wand2 className="w-8 h-8 text-purple-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">AI Image Generator</h2>
        <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          FREE with Together AI
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generation Controls */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              Generation Settings
            </h3>

            {/* Prompt Type Toggle */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useCustomPrompt}
                  onChange={(e) => setUseCustomPrompt(e.target.checked)}
                  className="mr-2"
                />
                Use Custom Prompt
              </label>
            </div>

            {useCustomPrompt ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Prompt
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your custom image generation prompt..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crystal Name
                  </label>
                  <input
                    type="text"
                    value={crystalName}
                    onChange={(e) => setCrystalName(e.target.value)}
                    placeholder="e.g., Tiger Eye, Amethyst, Rose Quartz"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Style
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Object.entries(styles).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(models).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Image
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Model Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Model Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>Flux.1-schnell:</strong> Best for product photos, completely free, fast generation</li>
              <li><strong>SDXL:</strong> Great for detailed lifestyle images, free tier available</li>
              <li><strong>Playground:</strong> Perfect for artistic/social media content</li>
            </ul>
          </div>
        </div>

        {/* Generated Images */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
            Generated Images ({generatedImages.length})
          </h3>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {generatedImages.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="relative w-full h-48 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={`Generated crystal image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Model:</strong> {image.model}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Seed:</strong> {image.seed}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyPrompt(image.prompt)}
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      title="Copy prompt"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadImage(image.url, `crystal-${Date.now()}.png`)}
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      title="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  {image.prompt}
                </p>
              </div>
            ))}

            {generatedImages.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No images generated yet. Create your first AI image above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
