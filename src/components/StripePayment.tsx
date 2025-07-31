'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Lock, CreditCard } from 'lucide-react';

// Debug: Log the Stripe key availability
console.log('🔑 Stripe publishable key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Available ✅' : 'Missing ❌');
console.log('🔑 Key prefix:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...');

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  orderData?: any;
}

function CheckoutForm({ amount, onSuccess, onError, isProcessing, setIsProcessing, orderData }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');

  // Debug: Log component initialization
  console.log('🚀 CheckoutForm initialized with:', { amount, stripe: !!stripe, elements: !!elements });

  useEffect(() => {
    // Debug: Log the payment initialization attempt
    console.log('🔄 Initializing payment for amount:', amount);
    console.log('🔄 Order data:', orderData);

    // Check if we have a valid amount
    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      onError('Invalid payment amount');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    console.log('📡 Making API call to create payment intent...');
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        metadata: {
          source: 'celestial-crystals-checkout'
        },
        orderData
      }),
    })
      .then((res) => {
        console.log('📡 Payment intent response status:', res.status);
        console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));
        return res.json();
      })
      .then((data) => {
        console.log('📡 Payment intent response data:', data);
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          console.log('✅ Payment intent created successfully:', data.clientSecret.substring(0, 20) + '...');
        } else {
          console.error('❌ No client secret in response:', data);
          onError(data.error || 'Failed to initialize payment');
        }
      })
      .catch((error) => {
        console.error('❌ Payment intent creation failed:', error);
        console.error('❌ Error details:', error.message, error.stack);
        onError('Failed to initialize payment');
      });
  }, [amount, onError, orderData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log('💳 Payment form submitted');
    console.log('💳 Stripe loaded:', !!stripe);
    console.log('💳 Elements loaded:', !!elements);
    console.log('💳 Client secret:', clientSecret ? 'Available' : 'Missing');

    if (!stripe || !elements) {
      console.error('❌ Stripe or Elements not loaded');
      onError('Payment system not ready');
      return;
    }

    if (!clientSecret) {
      console.error('❌ No client secret available');
      onError('Payment not initialized');
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found');
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    setIsProcessing(false);

    if (error) {
      onError(error.message || 'Payment failed');
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  // Show loading state while payment intent is being created
  if (!clientSecret) {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span>Initializing payment...</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          Setting up secure payment processing
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <CardElement options={cardElementOptions} />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full celestial-button flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Pay with Card - ${amount.toFixed(2)}</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function StripePayment(props: StripePaymentProps) {
  // Check if Stripe is available
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="space-y-4">
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Payment System Configuration Error</h3>
          <p className="text-red-700 text-sm">
            Stripe publishable key is not configured. Please contact support.
          </p>
          <div className="mt-2 text-xs text-red-600">
            Debug: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'undefined'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-gray-700">
        <CreditCard className="w-5 h-5" />
        <span className="font-medium">Credit or Debit Card</span>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm {...props} />
      </Elements>

      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <span>Powered by Stripe</span>
        <span>•</span>
        <span>SSL Secured</span>
      </div>
    </div>
  );
}
