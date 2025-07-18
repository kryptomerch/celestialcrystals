import { RotateCcw, Shield, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <RotateCcw className="w-12 h-12 text-gray-600 mr-4" />
            <h1 className="text-4xl font-light text-gray-900">Returns & Exchanges</h1>
          </div>
          <p className="text-xl text-gray-600">
            Your satisfaction is our priority. Easy returns within 30 days.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Return Policy Overview */}
        <div className="celestial-card p-8 mb-12">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-gray-600 mr-3" />
            <h2 className="text-2xl font-medium text-gray-900">30-Day Satisfaction Guarantee</h2>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            We want you to be completely happy with your crystal purchase. If for any reason you're not satisfied,
            you can return your items within 30 days of delivery for a full refund or exchange.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">30 Days</h3>
              <p className="text-gray-600 text-sm">From delivery date</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Free Returns</h3>
              <p className="text-gray-600 text-sm">Prepaid return label</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Full Refund</h3>
              <p className="text-gray-600 text-sm">Or exchange option</p>
            </div>
          </div>
        </div>

        {/* How to Return */}
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-8 text-center">How to Return an Item</h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium">1</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-600">
                  Email us at <a href="mailto:returns@celestialcrystals.com" className="text-gray-900 hover:text-gray-700 underline">returns@celestialcrystals.com</a> or
                  use our <a href="/contact" className="text-gray-900 hover:text-gray-700 underline">contact form</a>.
                  Include your order number and reason for return.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium">2</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Receive Return Authorization</h3>
                <p className="text-gray-600">
                  We'll send you a Return Authorization (RA) number and prepaid return shipping label within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium">3</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Package Your Return</h3>
                <p className="text-gray-600">
                  Securely package the item(s) in original packaging if possible. Include the RA number and any accessories.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium">4</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ship It Back</h3>
                <p className="text-gray-600">
                  Attach the prepaid label and drop off at any UPS location or schedule a pickup.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Receive Your Refund</h3>
                <p className="text-gray-600">
                  Once we receive and inspect your return, we'll process your refund within 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Return Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="celestial-card p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Returnable Items</h3>
            </div>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• All crystal bracelets and jewelry</li>
              <li>• Individual crystals and stones</li>
              <li>• Crystal sets and collections</li>
              <li>• Accessories and crystal care items</li>
              <li>• Items in original condition</li>
            </ul>
          </div>

          <div className="celestial-card p-6">
            <div className="flex items-center mb-4">
              <XCircle className="w-6 h-6 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Non-Returnable Items</h3>
            </div>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Custom or personalized items</li>
              <li>• Items damaged by customer</li>
              <li>• Items returned after 30 days</li>
              <li>• Items without original packaging</li>
              <li>• Gift cards and digital products</li>
            </ul>
          </div>
        </div>

        {/* Exchanges */}
        <div className="celestial-card p-8 mb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Exchanges</h2>
          <p className="text-gray-600 mb-6">
            Want to exchange for a different crystal or size? We're happy to help! Follow the same return process
            and let us know what you'd like to exchange for in your return request.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Same Price Exchange</h3>
              <p className="text-gray-600 text-sm">
                If exchanging for an item of equal value, no additional payment is required.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Price Difference</h3>
              <p className="text-gray-600 text-sm">
                For higher-priced items, pay the difference. For lower-priced items, receive a refund for the difference.
              </p>
            </div>
          </div>
        </div>

        {/* Damaged or Defective Items */}
        <div className="celestial-card p-6 mb-12 border-l-4 border-gray-400">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Damaged or Defective Items</h3>
          </div>
          <p className="text-gray-600 mb-4">
            If your item arrives damaged or defective, please contact us immediately with photos of the damage.
            We'll arrange for a replacement or full refund at no cost to you.
          </p>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li>• Contact us within 48 hours of delivery</li>
            <li>• Provide clear photos of the damage</li>
            <li>• Keep all original packaging</li>
            <li>• We'll cover all return shipping costs</li>
          </ul>
        </div>

        {/* Refund Information */}
        <div className="celestial-card p-8">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Refund Information</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Processing Time</h3>
              <p className="text-gray-600 text-sm">
                Refunds are processed within 3-5 business days after we receive your returned item.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Refund Method</h3>
              <p className="text-gray-600 text-sm">
                Refunds are issued to your original payment method. Credit card refunds may take 5-10 business days to appear on your statement.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Shipping Costs</h3>
              <p className="text-gray-600 text-sm">
                Original shipping costs are refundable only if the return is due to our error (damaged, defective, or wrong item).
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Need Help with a Return?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to make your return process as smooth as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:returns@celestialcrystals.com"
              className="celestial-button inline-flex items-center justify-center"
            >
              Email Returns Team
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 font-medium border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm uppercase tracking-wide"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
