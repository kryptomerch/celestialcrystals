'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalPaymentProps {
  amount: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  onSuccess: (details: any) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function PayPalPayment({ 
  amount, 
  items, 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing 
}: PayPalPaymentProps) {
  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: 'capture',
  };

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          items,
        }),
      });

      const data = await response.json();
      
      if (data.orderID) {
        return data.orderID;
      } else {
        throw new Error('Failed to create PayPal order');
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      onError('Failed to create PayPal order');
      setIsProcessing(false);
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      const details = await response.json();
      
      if (details.status === 'COMPLETED') {
        onSuccess(details);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      onError('Failed to complete PayPal payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const onCancel = () => {
    setIsProcessing(false);
    onError('Payment was cancelled');
  };

  const onErrorHandler = (error: any) => {
    console.error('PayPal error:', error);
    setIsProcessing(false);
    onError('PayPal payment failed');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-gray-700">
        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>
        <span className="font-medium">PayPal</span>
      </div>
      
      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 45,
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onCancel={onCancel}
          onError={onErrorHandler}
          disabled={isProcessing}
        />
      </PayPalScriptProvider>
      
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <span>Powered by PayPal</span>
        <span>•</span>
        <span>Buyer Protection</span>
      </div>
    </div>
  );
}
