'use client';

import React from 'react';
import PageTransition from '@/components/animations/PageTransition';

const TermsOfService: React.FC = () => {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 prose prose-gray dark:prose-invert max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <div className="text-sm mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          Last Updated: {new Date().toLocaleDateString()}
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to Storytime ("Platform", "we", "us", "our"). By accessing or using our services, including our website storytime.africa, mobile applications, APIs, and any associated services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). Please read these terms carefully before using our Services.
          </p>
        </section>

        {/* Definitions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Definitions</h2>
          <div className="pl-4">
            <ul className="list-disc space-y-2">
              <li><strong>"Content"</strong>: Stories, videos, audio, images, text, or any other material uploaded, created, or generated through our Services.</li>
              <li><strong>"User"</strong>: Any individual or entity that accesses or uses our Services.</li>
              <li><strong>"Generated Content"</strong>: Videos and other media created by our AI system based on user input.</li>
              <li><strong>"Subscription"</strong>: Paid access to premium features of our Services.</li>
            </ul>
          </div>
        </section>

        {/* Account Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Account Terms</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-medium">2.1 Account Registration</h3>
            <p>To access certain features, you must register for an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-medium">2.2 Account Restrictions</h3>
            <p>You must be at least 18 years old or have parental consent. Accounts are limited to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"One account per user"</strong></li>
              <li><strong>"No sharing of accounts"</strong></li>
              <li><strong>"No transfer of accounts without our permission"</strong></li>
            </ul>
          </div>
        </section>

        {/* Service Usage */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Service Usage and Limitations</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-medium">3.1 Fair Usage Policy</h3>
            <p>Our service is subject to the following usage limits:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Free Tier: 3 videos per month"</strong></li>
              <li><strong>"Pro Tier: 45 videos per month"</strong></li>
              <li><strong>"Elite Tier: Unlimited videos"</strong></li>
              <li><strong>"Maximum story length: 1500 characters"</strong></li>
              <li><strong>"Maximum video duration: 10 minutes"</strong></li>
            </ul>

            <h3 className="text-xl font-medium">3.2 Prohibited Uses</h3>
            <p>You agree not to use our Services to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Generate content that infringes copyrights"</strong></li>
              <li><strong>"Create inappropriate, offensive, or illegal content"</strong></li>
              <li><strong>"Manipulate or bypass usage limits"</strong></li>
              <li><strong>"Reverse engineer our systems"</strong></li>
              <li><strong>"Interfere with service operation"</strong></li>
            </ul>
          </div>
        </section>

        {/* Payment Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Payment and Subscription Terms</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-medium">4.1 Subscription Plans</h3>
            <p>We offer the following subscription plans:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Free Plan: Basic features with limited usage"</strong></li>
              <li><strong>"Pro Plan ($20/month): Enhanced features and increased limits"</strong></li>
              <li><strong>"Elite Plan ($100/month): Premium features with unlimited usage"</strong></li>
            </ul>

            <h3 className="text-xl font-medium">4.2 Payment Processing</h3>
            <p>Payments are processed securely through Paystack. By subscribing, you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Authorize recurring charges"</strong></li>
              <li><strong>"Agree to automatic renewal"</strong></li>
              <li><strong>"Accept responsibility for all payment obligations"</strong></li>
              <li><strong>"Understand our refund policy"</strong></li>
            </ul>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-medium">5.1 Content Ownership</h3>
            <p>Users retain rights to their original content. For Generated Content:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"You own the rights to videos generated from your content"</strong></li>
              <li><strong>"We retain rights to the AI models and generation process"</strong></li>
              <li><strong>"You grant us license to process your content"</strong></li>
            </ul>

            <h3 className="text-xl font-medium">5.2 Platform Rights</h3>
            <p>Storytime retains all rights to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Our proprietary AI technology"</strong></li>
              <li><strong>"Platform features and functionality"</strong></li>
              <li><strong>"Brand assets and trademarks"</strong></li>
            </ul>
          </div>
        </section>

        {/* Additional sections... */}

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <div className="space-y-4">
            <p>For questions about these Terms, please contact us at:</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <p>Storytime Africa</p>
              <p>Email: legal@storytime.africa</p>
              <p>Support: support@storytime.africa</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </div>
        </section>

        {/* Acceptance Footer */}
        <div className="mt-12 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm text-center">
          <p>By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
          <p className="mt-2">© {new Date().getFullYear()} Storytime Africa. All rights reserved.</p>
        </div>
      </div>
    </PageTransition>
  );
};

export default TermsOfService;
