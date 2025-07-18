import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-purple-200 mr-4" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl opacity-90">
            Your privacy is important to us. Learn how we protect and use your information.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Last Updated */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            <strong>Last Updated:</strong> January 1, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-600 leading-relaxed">
            At CELESTIAL ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security 
            of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
            your information when you visit our website or make a purchase from us.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Eye className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-600 mb-3">
                When you make a purchase or create an account, we may collect:
              </p>
              <ul className="space-y-1 text-gray-600 ml-4">
                <li>• Name and contact information (email, phone, address)</li>
                <li>• Payment information (processed securely by our payment providers)</li>
                <li>• Birth date (for personalized crystal recommendations)</li>
                <li>• Order history and preferences</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <p className="text-gray-600 mb-3">
                When you visit our website, we automatically collect:
              </p>
              <ul className="space-y-1 text-gray-600 ml-4">
                <li>• IP address and browser information</li>
                <li>• Pages visited and time spent on site</li>
                <li>• Device information and screen resolution</li>
                <li>• Referral source (how you found our site)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <UserCheck className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• Process and fulfill your orders</li>
              <li>• Provide personalized crystal recommendations</li>
              <li>• Send order confirmations and shipping updates</li>
              <li>• Respond to your questions and provide customer support</li>
              <li>• Improve our website and services</li>
              <li>• Send marketing communications (with your consent)</li>
              <li>• Prevent fraud and ensure security</li>
              <li>• Comply with legal obligations</li>
            </ul>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Lock className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Service Providers:</strong> Trusted partners who help us operate our business (payment processors, shipping companies, email services)</li>
              <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li>• <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
              <li>• <strong>With Your Consent:</strong> When you explicitly agree to share information</li>
            </ul>
          </div>
        </div>

        {/* Data Security */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• SSL encryption for all data transmission</li>
              <li>• Secure payment processing through trusted providers</li>
              <li>• Regular security audits and updates</li>
              <li>• Limited access to personal information</li>
              <li>• Secure data storage and backup systems</li>
            </ul>
          </div>
        </div>

        {/* Your Rights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights and Choices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Access and Update</h3>
              <p className="text-gray-600 text-sm">
                You can access and update your personal information through your account settings or by contacting us.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Marketing Communications</h3>
              <p className="text-gray-600 text-sm">
                You can opt out of marketing emails at any time by clicking the unsubscribe link or contacting us.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Deletion</h3>
              <p className="text-gray-600 text-sm">
                You can request deletion of your personal information, subject to legal and business requirements.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookies</h3>
              <p className="text-gray-600 text-sm">
                You can control cookies through your browser settings, though this may affect site functionality.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies and Tracking</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your browsing experience:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li>• <strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li>• <strong>Marketing Cookies:</strong> Used to show relevant advertisements</li>
              <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
          </div>
        </div>

        {/* Third-Party Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Services</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              Our website may contain links to third-party websites or integrate with third-party services. 
              We are not responsible for the privacy practices of these external sites. We recommend reviewing 
              their privacy policies before providing any personal information.
            </p>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="mb-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-3">Children's Privacy</h2>
            <p className="text-yellow-700">
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you believe we have collected information from 
              a child under 13, please contact us immediately.
            </p>
          </div>
        </div>

        {/* Changes to Policy */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to This Policy</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last Updated" date. We encourage you to 
              review this policy periodically.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Privacy?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about this Privacy Policy or how we handle your information, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@celestialcrystals.com"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Email Privacy Team
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
