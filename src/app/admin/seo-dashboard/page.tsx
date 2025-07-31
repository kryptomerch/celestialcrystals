'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface SEOMetrics {
  sitemap: {
    status: string;
    pagesSubmitted: number;
    pagesIndexed: number;
    lastSubmitted: string;
  };
  performance: {
    totalClicks: number;
    totalImpressions: number;
    averageCTR: number;
    averagePosition: number;
  };
  coverage: {
    validPages: number;
    errorPages: number;
    excludedPages: number;
  };
  coreWebVitals: {
    goodUrls: number;
    needsImprovement: number;
    poorUrls: number;
  };
}

export default function SEODashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
    fetchSEOMetrics();
  }, [session, status, router]);

  const fetchSEOMetrics = async () => {
    setLoading(true);
    try {
      // This would connect to Google Search Console API
      // For now, we'll use mock data
      const mockMetrics: SEOMetrics = {
        sitemap: {
          status: 'Success',
          pagesSubmitted: 12,
          pagesIndexed: 8,
          lastSubmitted: new Date().toISOString()
        },
        performance: {
          totalClicks: 156,
          totalImpressions: 2340,
          averageCTR: 6.67,
          averagePosition: 24.5
        },
        coverage: {
          validPages: 8,
          errorPages: 0,
          excludedPages: 4
        },
        coreWebVitals: {
          goodUrls: 6,
          needsImprovement: 2,
          poorUrls: 0
        }
      };
      
      setMetrics(mockMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch SEO metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor your Google Search Console performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchSEOMetrics}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open GSC</span>
              </a>
            </div>
          </div>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Sitemap Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sitemap Status</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.sitemap.status}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  metrics.sitemap.status === 'Success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {metrics.sitemap.status === 'Success' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {metrics.sitemap.pagesIndexed}/{metrics.sitemap.pagesSubmitted} pages indexed
              </p>
            </div>

            {/* Total Clicks */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.performance.totalClicks}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <MousePointer className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Last 28 days</p>
            </div>

            {/* Total Impressions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Impressions</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.performance.totalImpressions.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Last 28 days</p>
            </div>

            {/* Average Position */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Position</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.performance.averagePosition}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                CTR: {metrics.performance.averageCTR}%
              </p>
            </div>
          </div>
        )}

        {/* Detailed Sections */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coverage Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Coverage Status</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Valid Pages</span>
                    <span className="text-sm font-bold text-green-600">{metrics.coverage.validPages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Error Pages</span>
                    <span className="text-sm font-bold text-red-600">{metrics.coverage.errorPages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Excluded Pages</span>
                    <span className="text-sm font-bold text-yellow-600">{metrics.coverage.excludedPages}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Core Web Vitals</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Good URLs</span>
                    <span className="text-sm font-bold text-green-600">{metrics.coreWebVitals.goodUrls}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Needs Improvement</span>
                    <span className="text-sm font-bold text-yellow-600">{metrics.coreWebVitals.needsImprovement}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Poor URLs</span>
                    <span className="text-sm font-bold text-red-600">{metrics.coreWebVitals.poorUrls}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Items */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Submit sitemap to Google Search Console</p>
                  <p className="text-sm text-gray-600">Your sitemap is working properly - submit it now!</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Request indexing for key pages</p>
                  <p className="text-sm text-gray-600">Use URL Inspection tool for priority pages</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Search className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Monitor keyword rankings</p>
                  <p className="text-sm text-gray-600">Track "natural crystal bracelet canada" performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
