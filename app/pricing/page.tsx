"use client";
import React, { useState, useEffect } from 'react';
import PaystackPopup from '@/components/PaystackPopup';
import { useCurrency } from '@/lib/currency-context';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';
// Removed unused SignupModal import

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaystack, setShowPaystack] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currency, conversionRate } = useCurrency();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Removed unused isSignupModalOpen state

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

  const getPrice = (basePrice: number) => {
    const yearlyDiscount = 0.8; // 20% discount for yearly
    const price = currency === 'USD' ? basePrice : Math.round(basePrice * conversionRate);
    return billingPeriod === 'yearly' ? Math.round(price * 12 * yearlyDiscount) : price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <header className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Choose Your Creative Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Unleash your storytelling potential with our flexible plans designed for creators at every level.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 rounded-full bg-blue-500/10 p-1 transition-colors"
            >
              <div className={`absolute w-6 h-6 rounded-full bg-blue-600 transition-transform duration-200 ${
                billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-0'
              }`} />
            </button>
            <span className={`text-sm flex items-center gap-2 ${billingPeriod === 'yearly' ? 'text-blue-600' : 'text-gray-500'}`}>
              Yearly
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Free Explorer',
              price: 0,
              features: ['7 videos per month', 'Basic templates', 'Community support', '720p video quality', 'Analytics dashboard', 'API access', 'Logo Watermark' ], // Updated limit
              popular: false,
              plan: 'free'
            },
            {
              name: 'Pro Creator',
              price: 20,
              features: ['45 videos per month', 'Premium templates', 'Priority support', '1080p video quality', 'Custom branding', 'Analytics dashboard', 'API access', 'No Watermark', 'Extended Video Length'],
              popular: true,
              plan: 'pro'
            },
            {
              name: 'Elite Studio',
              price: 100,
              features: ['Unlimited videos', 'All templates + custom', '24/7 Premium support', '4K video quality', 'Advanced branding', 'Team collaboration', 'API access', 'No Watermark', 'Extended Video Length'],
              popular: false,
              plan: 'elite'
            }
          ].map((tier) => (
            <div key={tier.name} className={`group relative rounded-2xl ${
              tier.popular ? 'scale-105 md:-mt-4' : ''
            }`}>
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 text-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`h-full p-8 rounded-2xl transition-all duration-200 ${
                tier.popular
                  ? 'bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-xl shadow-blue-500/10'
                  : 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl'
              }`}>
                <div className="flex flex-col h-full">
                  <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                  <p className="text-4xl font-bold mb-6">
                    {currency === 'USD' ? '$' : '₦'}{getPrice(tier.price)}
                    <span className="text-lg font-normal text-gray-500">/{billingPeriod}</span>
                  </p>
                  
                  <ul className="space-y-4 mb-8 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleSubscribe(tier.plan)}
                    className={`w-full p-4 rounded-xl font-medium transition-all duration-200 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tier.price === 0 ? 'Get Started' : 'Subscribe Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-6">100% Satisfaction Guaranteed</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Not sure yet? Start with our free plan or try our premium features risk-free for 14 days.
            No credit card required for free plan.
          </p>
        </div>
      </main>

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          // Removed unused setIsSignupModalOpen prop
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showPaystack && !isProcessing && user && ( // Ensure user exists before rendering PaystackPopup
        <PaystackPopup
          amount={getPrice(selectedPlan === 'pro' ? 20 : 100)} // Use getPrice to calculate amount based on billing period
          metadata={{ 
            plan: selectedPlan, 
            currency: currency, 
            billingPeriod: billingPeriod, // Pass billing period
            userId: user.uid // Pass userId
          }}
          onSuccess={handlePaymentSuccess}
          onStart={handlePaymentStart}
        />
      )}
    </div>
  );
};

export default PricingPage;
