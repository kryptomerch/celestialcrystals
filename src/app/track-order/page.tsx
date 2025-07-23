import OrderTracking from '@/components/OrderTracking';

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-light text-gray-900 mb-4">Track Your Order</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enter your tracking number below to see the current status and location of your crystal order.
              You can find your tracking number in the shipping confirmation email we sent you.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <OrderTracking className="max-w-2xl mx-auto" />
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">When will I receive my tracking number?</h3>
              <p className="text-gray-600 text-sm">
                You'll receive your tracking number via email within 1-2 business days after placing your order. 
                We process orders Monday through Friday and ship the same day when possible.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">How long does shipping take?</h3>
              <p className="text-gray-600 text-sm">
                Shipping times depend on your location and selected service:
              </p>
              <ul className="text-gray-600 text-sm mt-2 ml-4 space-y-1">
                <li>• <strong>Local (Hamilton area):</strong> 1-2 business days</li>
                <li>• <strong>Ontario:</strong> 2-3 business days</li>
                <li>• <strong>Rest of Canada:</strong> 3-7 business days</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">My tracking shows no updates. What should I do?</h3>
              <p className="text-gray-600 text-sm">
                It can take up to 24 hours for tracking information to appear in the system after your package is picked up. 
                If there are still no updates after 48 hours, please contact us at support@celestialcrystals.com.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Do you ship internationally?</h3>
              <p className="text-gray-600 text-sm">
                Currently, we only ship within Canada. We're working on expanding to international shipping soon. 
                Sign up for our newsletter to be notified when international shipping becomes available.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">How are crystals packaged for shipping?</h3>
              <p className="text-gray-600 text-sm">
                Each crystal is carefully wrapped in protective material and placed in a secure box with cushioning. 
                We take extra care to ensure your crystals arrive safely and maintain their energetic properties during transit.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">What if my package is damaged or lost?</h3>
              <p className="text-gray-600 text-sm">
                All our shipments are insured. If your package arrives damaged or goes missing, please contact us immediately 
                at support@celestialcrystals.com with your order number and tracking information. We'll resolve the issue quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
