"use client";
import React, { useState, useEffect } from 'react';
import PaystackPopup from '@/components/PaystackPopup';
import { auth, createUserSubscription } from '@/app/firebase';
import { useCurrency } from '@/lib/currency-context';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';
import SignupModal from '@/components/SignupModal';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const { currency, conversionRate } = useCurrency();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    // Handle successful login
  };

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (plan !== 'free') {
      setSelectedPlan(plan);
    }

    // if (user) {
    //   await createUserSubscription(user.uid, user.email || '', plan);
    //   console.log('Subscription data sent to Firestore:', plan);
    // }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen" id="pricing">
      <header className="shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Pricing</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold">Free Subscription</h2>
            <p className="mt-4">No payment required</p>
            <p className="mt-2">3 usages per month</p>
            <p className="mt-2">30 days reset period</p>
            <p className="mt-2">Automatic plan</p>
            <p className="mt-2">No priority support</p>
          </div>
          <div className="p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold">Pro Subscription</h2>
            <p className="mt-4">
              {currency === 'USD' ? '$' : '₦'}
              {currency === 'USD' ? 20 : Math.round(20 * conversionRate)} per month
            </p>
            <p className="mt-2">45 usages per month</p>
            <p className="mt-2">Payment required</p>
            <p className="mt-2">Priority support</p>
            <p className="mt-2">30 days reset period</p>
            <p className="mt-2">Early access to new features</p>
            <button
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() => handleSubscribe('pro')}
            >
              Subscribe
            </button>
          </div>
          <div className="p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold">Elite Subscription</h2>
            <p className="mt-4">
              {currency === 'USD' ? '$' : '₦'}
              {currency === 'USD' ? 100 : Math.round(100 * conversionRate)} per month
            </p>
            <p className="mt-2">Unlimited usage per month</p>
            <p className="mt-2">Payment required</p>
            <p className="mt-2">Priority support</p>
            <p className="mt-2">30 days reset period</p>
            <p className="mt-2">Early access to new features</p>
            <button
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() => handleSubscribe('elite')}
            >
              Subscribe
            </button>
          </div>
        </div>
        {selectedPlan !== 'free' && (
          <PaystackPopup
            amount={selectedPlan === 'pro' ? 20 : 100}
            metadata={{ plan: selectedPlan, currency: currency }}
          />
        )}
      </main>
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          setIsSignupModalOpen={setIsSignupModalOpen}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default PricingPage;
