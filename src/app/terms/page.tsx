import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-purple-200 mr-4" />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-xl opacity-90">
            Please read these terms carefully before using our services.
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
            Welcome to CELESTIAL. These Terms of Service ("Terms") govern your use of our website and services. 
            By accessing or using our website, you agree to be bound by these Terms. If you do not agree to these Terms, 
            please do not use our services.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              By using our website or services, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
              These Terms apply to all visitors, users, and customers of our services.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• You must be at least 18 years old to make purchases</li>
              <li>• You are responsible for maintaining the confidentiality of your account</li>
              <li>• You agree to provide accurate and complete information</li>
              <li>• You will not use our services for any unlawful purposes</li>
            </ul>
          </div>
        </div>

        {/* Products and Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Products and Services</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Information</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• All crystals are natural and may vary in appearance from photos</li>
                <li>• Product descriptions are for informational purposes only</li>
                <li>• We strive for accuracy but cannot guarantee all details are error-free</li>
                <li>• Prices are subject to change without notice</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
              <p className="text-gray-600">
                Product availability is subject to change. We reserve the right to limit quantities, 
                discontinue products, or refuse orders at our discretion.
              </p>
            </div>
          </div>
        </div>

        {/* Orders and Payment */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders and Payment</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Acceptance</h3>
                <p className="text-gray-600 text-sm">
                  Your order is an offer to purchase products. We reserve the right to accept or decline any order. 
                  Order confirmation does not guarantee acceptance.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
                <p className="text-gray-600 text-sm">
                  Payment is due at the time of order. We accept major credit cards and other payment methods as displayed. 
                  All payments are processed securely through trusted payment providers.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                <p className="text-gray-600 text-sm">
                  All prices are in USD and include applicable taxes where required. Shipping costs are additional 
                  unless otherwise stated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping and Returns */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping and Returns</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              Detailed shipping and return policies are available on our dedicated pages:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/shipping"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                View Shipping Policy →
              </a>
              <a
                href="/returns"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                View Return Policy →
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Important Disclaimers</h2>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Crystal Healing Disclaimer</h3>
                <p className="text-yellow-700 text-sm">
                  Crystals and gemstones are intended for spiritual and decorative purposes only. They are not medical devices 
                  and should not be used as a substitute for professional medical advice, diagnosis, or treatment. 
                  Always consult with a qualified healthcare provider for medical concerns.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Natural Variations</h3>
                <p className="text-yellow-700 text-sm">
                  All crystals are natural products and may vary in size, color, and appearance from photos. 
                  These variations are normal and part of the natural beauty of crystals.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Metaphysical Properties</h3>
                <p className="text-yellow-700 text-sm">
                  Information about metaphysical properties is based on traditional beliefs and is provided for 
                  educational purposes only. Results may vary and are not guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              All content on our website, including text, images, logos, and designs, is protected by copyright 
              and other intellectual property laws. You may not:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Copy, reproduce, or distribute our content without permission</li>
              <li>• Use our trademarks or logos without authorization</li>
              <li>• Create derivative works based on our content</li>
              <li>• Use our content for commercial purposes without consent</li>
            </ul>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Scale className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              To the fullest extent permitted by law, CELESTIAL shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Loss of profits or revenue</li>
              <li>• Loss of data or information</li>
              <li>• Business interruption</li>
              <li>• Personal injury (except where prohibited by law)</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Our total liability shall not exceed the amount you paid for the specific product or service.
            </p>
          </div>
        </div>

        {/* Governing Law */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">
              These Terms are governed by and construed in accordance with the laws of the State of California, 
              without regard to its conflict of law principles. Any disputes arising from these Terms or your use 
              of our services shall be resolved in the courts of California.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
              posting on our website. Your continued use of our services after changes are posted constitutes 
              acceptance of the modified Terms.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About These Terms?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about these Terms of Service, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@celestialcrystals.com"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Email Legal Team
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
