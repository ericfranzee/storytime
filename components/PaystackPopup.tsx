import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from '@/lib/currency-context';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaystackPopupProps {
  amount: number;
  metadata: Record<string, any>;
}

const PaystackPopup: React.FC<PaystackPopupProps> = ({ amount, metadata }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currency, conversionRate } = useCurrency();

  useEffect(() => {
    if (user) {
      const initializeTransaction = async () => {
        try {
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
              toast({ title: "Payment window closed.", variant: "default" });
            },
            callback: async (response: any) => {
              console.log('Paystack response', response);
              try {
                const updateSubscriptionResponse = await axios.post('/api/paystack', {
                  ...response,
                  metadata: updatedMetadata,
                });
                console.log('Subscription update response:', updateSubscriptionResponse.data);
                toast({ title: "Payment successful!", variant: "default" });
              } catch (error: any) {
                console.error('Error updating subscription:', error);
                toast({ title: "Payment failed.", variant: "destructive" });
              }
            },
          });
        } catch (error) {
          console.error('Error initializing Paystack transaction:', error);
        }
      };

      initializeTransaction();
    }
  }, [user, amount, metadata, currency, conversionRate]);

  return null;
};

export default PaystackPopup;
