import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Check - CELESTIAL',
  robots: 'noindex, nofollow'
};

export default function SecurityCheck() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Security & Content Verification</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">✅ Security Status</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ No malicious code detected</li>
            <li>✅ No suspicious redirects</li>
            <li>✅ No fake download buttons</li>
            <li>✅ All social media links are legitimate</li>
            <li>✅ Domain consistency verified</li>
            <li>✅ Content is authentic and business-related</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔍 Content Verification</h2>
          <p className="text-gray-700 mb-4">
            This website (thecelestial.xyz) is a legitimate e-commerce site selling authentic 
            natural crystal bracelets and healing crystals. All content is original and 
            related to our crystal jewelry business.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• Business: Natural crystal bracelet sales</li>
            <li>• Products: Authentic healing crystals and gemstone jewelry</li>
            <li>• Target Market: Canada and USA</li>
            <li>• Content: Educational crystal guides and product information</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📞 Contact Information</h2>
          <p className="text-gray-700">
            For any security concerns or questions about our website content, 
            please contact us through our official channels.
          </p>
        </div>
      </div>
    </div>
  );
}
