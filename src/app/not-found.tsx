import Link from 'next/link';
import { Search, Home, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex items-center justify-center">
      {/* Starry Background */}
      <div className="absolute inset-0">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-white mb-4">404</div>
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-purple-300 mr-4" />
            <h1 className="text-4xl font-bold text-white">Page Not Found</h1>
            <Sparkles className="w-12 h-12 text-pink-300 ml-4" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <p className="text-xl text-purple-200 mb-6">
            Oops! It seems like this crystal has vanished into the cosmic void.
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="space-y-4">
            <p className="text-purple-300">Here's what you can do:</p>
            <ul className="text-left text-purple-200 space-y-2 max-w-md mx-auto">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Check the URL for any typos
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Go back to the previous page
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Explore our crystal collection
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Contact us if you need help
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>

          <Link
            href="/crystals"
            className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Crystals
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-purple-200 text-sm">
            Lost in the crystal realm? <Link href="/contact" className="text-white font-medium hover:text-purple-200 transition-colors">Contact our guides</Link> for assistance.
          </p>
        </div>
      </div>


    </div>
  );
}
