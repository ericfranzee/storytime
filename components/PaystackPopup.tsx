import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { showToast } from "@/lib/toast-utils";
import { useCurrency } from '@/lib/currency-context';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaystackResponse {
  message: string;
  redirecturl?: string;
  reference?: string;
  status: string;
  trans: string;
  transaction?: string;
  trxref?: string;
}

interface PaystackCallbackData {
  reference: string;
  response?: PaystackResponse;
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackPopupProps {
  amount: number;
  metadata: Record<string, any>;
  onSuccess?: () => void;
  onStart?: () => void;
}

const PaystackPopup: React.FC<PaystackPopupProps> = ({ 
  amount, 
  metadata, 
  onSuccess, 
  onStart 
}) => {
  const { user } = useAuth();
  const { currency, conversionRate } = useCurrency();

  useEffect(() => {
    if (user) {
      const initializeTransaction = async () => {
        try {
          onStart?.();
          const updatedMetadata = { ...metadata, userId: user.uid };

          // Convert amount to the selected currency
          const amountInBaseCurrency = amount * conversionRate;
          const amountInCents = Math.round(amountInBaseCurrency * 100); // Paystack requires amount in kobo/cents

          const response = await axios.post('/api/paystack/initialize', {
            email: user.email,
            amount: amountInCents,
            currency: currency,
            metadata: updatedMetadata,
          });

          const { access_code } = response.data.data;

          const popup = new window.PaystackPop();
          popup.newTransaction({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
            email: user.email,
            amount: amountInCents,
            currency: currency,
            metadata: updatedMetadata,
            onClose: () => {
              showToast.info("Payment Cancelled", "Payment window was closed.");
            },
            callback: async (response: PaystackResponse) => {
              console.log('Paystack response', response);
              try {
                const updateSubscriptionResponse = await axios.post('/api/paystack', {
                  ...response,
                  metadata: updatedMetadata,
                });
                console.log('Subscription update response:', updateSubscriptionResponse.data);
                showToast.success("Payment Successful", "Your subscription has been updated.");
                onSuccess?.();
              } catch (error: any) {
                console.error('Error updating subscription:', error);
                showToast.error("Payment Failed", "Could not update subscription. Please try again.");
              }
            },
          });
        } catch (error) {
          console.error('Error initializing Paystack transaction:', error);
          showToast.error("Transaction Failed", "Could not initialize payment.");
        }
      };

      initializeTransaction();
    }

    // Cleanup function
    return () => {
      const paymentStatus = localStorage.getItem('paymentStatus');
      if (paymentStatus !== 'completed') {
        localStorage.removeItem('paymentStatus');
      }
    };
  }, [user, amount, metadata, currency, conversionRate, onSuccess, onStart]);

  return null;
};

export default PaystackPopup;
