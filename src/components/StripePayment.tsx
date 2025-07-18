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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

function CheckoutForm({ amount, onSuccess, onError, isProcessing, setIsProcessing }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount,
        metadata: {
          source: 'celestial-crystals-checkout'
        }
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          onError('Failed to initialize payment');
        }
      })
      .catch(() => onError('Failed to initialize payment'));
  }, [amount, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
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
