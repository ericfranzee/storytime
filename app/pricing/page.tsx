"use client";
import React, { useState, useEffect } from 'react';
import PaystackPopup from '@/components/PaystackPopup';
import { useCurrency } from '@/lib/currency-context';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';
import SignupModal from '@/components/SignupModal';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [showPaystack, setShowPaystack] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currency, conversionRate } = useCurrency();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  useEffect(() => {
    // Check if payment was recently completed
    const paymentStatus = localStorage.getItem('paymentStatus');
    if (paymentStatus === 'completed') {
      setShowPaystack(false);
      setIsProcessing(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    // Handle successful login
  };

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (plan !== 'free') {
      // Clear previous payment status when starting new subscription
      localStorage.removeItem('paymentStatus');
      setSelectedPlan(plan);
      setShowPaystack(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaystack(false);
    setIsProcessing(false);
    // Store payment status
    localStorage.setItem('paymentStatus', 'completed');
  };

  const handlePaymentStart = () => {
    setIsProcessing(true);
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
      <header className="py-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Choose Your Creative Journey</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Whether you're just starting out or creating content at scale, 
            we have the perfect plan for your storytelling needs.
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 border-2 border-transparent hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Free Explorer</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Popular</span>
            </div>
            <p className="text-3xl font-bold mb-6">$0<span className="text-lg font-normal">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                3 videos per month
              </li>
              {/* Add more features... */}
            </ul>
            <button
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => handleSubscribe('free')}
            >
              Get Started
            </button>
          </div>
          <div className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 border-2 border-transparent hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Pro Subscription</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Popular</span>
            </div>
            <p className="text-3xl font-bold mb-6">
              {currency === 'USD' ? '$' : '₦'}
              {currency === 'USD' ? 20 : Math.round(20 * conversionRate)}<span className="text-lg font-normal">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                45 usages per month
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Payment required
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Priority support
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                30 days reset period
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Early access to new features
              </li>
            </ul>
            <button
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => handleSubscribe('pro')}
            >
              Subscribe
            </button>
          </div>
          <div className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 border-2 border-transparent hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Elite Subscription</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Popular</span>
            </div>
            <p className="text-3xl font-bold mb-6">
              {currency === 'USD' ? '$' : '₦'}
              {currency === 'USD' ? 100 : Math.round(100 * conversionRate)}<span className="text-lg font-normal">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Unlimited usage per month
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Payment required
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Priority support
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                30 days reset period
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Early access to new features
              </li>
            </ul>
            <button
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => handleSubscribe('elite')}
            >
              Subscribe
            </button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">100% Satisfaction Guaranteed</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Try our service risk-free. If you're not completely satisfied with your first video,
            we'll refund your subscription - no questions asked.
          </p>
        </div>
      </main>
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          setIsSignupModalOpen={setIsSignupModalOpen}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showPaystack && !isProcessing && (
        <PaystackPopup
          amount={selectedPlan === 'pro' ? 20 : 100}
          metadata={{ plan: selectedPlan, currency: currency }}
          onSuccess={handlePaymentSuccess}
          onStart={handlePaymentStart}
        />
      )}
    </div>
  );
};

export default PricingPage;
