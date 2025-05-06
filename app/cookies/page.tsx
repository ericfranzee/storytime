'use client';

import React from 'react';
import PageTransition from '@/components/animations/PageTransition';
import type { FC } from 'react';

const CookiePage: FC = () => {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 prose prose-gray dark:prose-invert max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Cookie Policy</h1>
          <p>Last updated: May 2024</p>
          <p>This Cookie Policy explains how StoryTime Africa (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) uses cookies and similar technologies.</p>
        </div>

        <div className="text-sm mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center">
          <span>Last Updated: {new Date().toLocaleDateString()}</span>
          <span>Version 1.0</span>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <p>
            This Cookie Policy explains how Storytime Africa (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
        </section>

        {/* What are Cookies? */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. What are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or to work more efficiently, as well as to provide information to the owners of the website.
          </p>
        </section>

        {/* How We Use Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential Website Functionality:</strong> These cookies are necessary for our website to function properly. They enable you to navigate the site and use its features.
            </li>
            <li>
              <strong>Authentication and Security:</strong> We use cookies to identify you when you log in and to help us secure your account.
            </li>
            <li>
              <strong>User Preferences:</strong> These cookies allow our website to remember your preferences, such as language settings and display options.
            </li>
            <li>
              <strong>Analytics and Performance:</strong> We use cookies to analyze how users interact with our website, which helps us improve its performance and design.
            </li>
            <li>
              <strong>Marketing and Advertising:</strong> We may use cookies to deliver targeted advertisements and measure the effectiveness of our marketing campaigns.
            </li>
          </ul>
        </section>

        {/* Types of Cookies We Use */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
          <p>
            Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us understand how you use our site, remember your preferences, and provide relevant content and advertising. By continuing to use our site, you consent to our use of cookies as described in this policy. We use various types of cookies, including "Session Cookies," which expire when you close your browser, and "Persistent Cookies," which remain on your device for a set period. We also use "First-party Cookies," set by us, and "Third-party Cookies," set by our partners for analytics and advertising purposes. You can manage your cookie preferences through your browser settings, allowing you to block or delete cookies. However, please note that disabling cookies may affect the functionality of certain parts of our website. For more detailed information about the specific cookies we use and their purposes, please refer to the sections below. We are committed to protecting your privacy and ensuring transparency in our data practices. If you have any questions about our cookie policy, feel free to contact us.
          </p>
        </section>

        {/* Specific Cookies We Use */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Specific Cookies We Use</h2>
          <p>Here are some specific cookies we use and why:</p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left">Cookie Name</th>
                  <th className="px-6 py-3 border-b text-left">Purpose</th>
                  <th className="px-6 py-3 border-b text-left">Provider</th>
                  <th className="px-6 py-3 border-b text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 border-b">session_id</td>
                  <td className="px-6 py-4 border-b">Maintains user session</td>
                  <td className="px-6 py-4 border-b">Storytime Africa</td>
                  <td className="px-6 py-4 border-b">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">analytics_cookie</td>
                  <td className="px-6 py-4 border-b">Tracks website traffic</td>
                  <td className="px-6 py-4 border-b">Google Analytics</td>
                  <td className="px-6 py-4 border-b">2 years</td>
                </tr>
                {/* Add more rows for each cookie */}
              </tbody>
            </table>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
          <p>You can control the use of cookies through your browser settings. Most browsers allow you to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>View what cookies are stored on your device</li>
            <li>Delete individual cookies</li>
            <li>Block third-party cookies</li>
            <li>Block all cookies</li>
            <li>Clear all cookies when you close your browser</li>
          </ul>
          <p className="mt-4">
            Please note that blocking or deleting cookies may affect your experience on our website and may prevent you from accessing certain features.
          </p>
          <p>You can learn more about cookies and how to manage them in your browser&apos;s settings.</p>
        </section>

        {/* Third-Party Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Third-Party Cookies</h2>
          <p>
            We use third-party services that may set cookies on your device. These services include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google Analytics: For website analytics and performance tracking.</li>
            <li>Paystack: For secure payment processing.</li>
            <li>Advertising partners: For delivering targeted advertisements.</li>
          </ul>
          <p className="mt-4">
            We do not control these third-party cookies, and their use is governed by the third parties' privacy policies.
          </p>
        </section>

        {/* Consent */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Consent</h2>
          <p>
            By using our website, you consent to the use of cookies as described in this Cookie Policy. You can manage your cookie preferences through your browser settings or through our cookie consent tool (if available).
          </p>
        </section>

        {/* Changes to This Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be effective immediately upon posting. Your continued use of our website after changes are posted constitutes your acceptance of the updated Cookie Policy.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <p>For questions about this Cookie Policy, please contact us at:</p>
            <p>Email: privacy@storytime.africa</p>
            <p>Address: [Your Business Address]</p>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="mb-4">
            This Cookie Policy is effective as of {new Date().toLocaleDateString()} and will remain in effect except with respect to any changes in its provisions in the future.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Storytime Africa. All rights reserved.
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

// Ensure proper default export
export default CookiePage;
