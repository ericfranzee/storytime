'use client';

import React from 'react';
import PageTransition from '@/components/animations/PageTransition';
import type { FC } from 'react';

const PrivacyPage: FC = () => {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 prose prose-gray dark:prose-invert max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="text-sm mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center">
          <span>Last Updated: {new Date().toLocaleDateString()}</span>
          <span>Version 1.2</span>
        </div>

        {/* Key Updates Section */}
        <section className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
          <h2 className="text-xl font-semibold mb-2">Recent Updates</h2>
          <ul className="list-disc pl-6">
            <li>Added AI processing transparency details</li>
            <li>Updated video data retention policies</li>
            <li>Enhanced data portability rights</li>
          </ul>
        </section>

        {/* Information Collection */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">1. Information Collection and Processing</h2>
          
          <h3 className="text-xl mb-4">1.1 Account Information</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Basic Profile:</strong>
              <ul className="pl-6 mt-2">
                <li>Email address (required for account creation)</li>
                <li>Display name (optional)</li>
                <li>Profile picture (optional)</li>
                <li>Account preferences and settings</li>
              </ul>
            </li>
            <li>
              <strong>Authentication Data:</strong>
              <ul className="pl-6 mt-2">
                <li>Password hashes (for email accounts)</li>
                <li>OAuth tokens (for social logins)</li>
                <li>Two-factor authentication data</li>
                <li>Session information</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-xl mb-4 mt-8">1.2 Content and Usage Data</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Story Content:</strong>
              <ul className="pl-6 mt-2">
                <li>Text stories submitted for video generation</li>
                <li>Story metadata (timestamps, categories)</li>
                <li>Generated video content</li>
                <li>Voice-over recordings and preferences</li>
              </ul>
            </li>
            <li>
              <strong>AI Processing Data:</strong>
              <ul className="pl-6 mt-2">
                <li>Story analysis patterns</li>
                <li>Video generation parameters</li>
                <li>Style preferences and settings</li>
                <li>Generated scene descriptions</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-xl mb-4 mt-8">1.3 Payment Information</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Transaction Details:</strong>
              <ul className="pl-6 mt-2">
                <li>Transaction IDs</li>
                <li>Subscription plans</li>
                <li>Payment amounts and dates</li>
                <li>Billing addresses</li>
              </ul>
            </li>
            <li>
              <strong>Payment Method:</strong>
              <ul className="pl-6 mt-2">
                <li>Card details (processed securely by Paystack)</li>
                <li>Billing cycle information</li>
                <li>Payment history</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-xl mb-4 mt-8">1.4 Technical Data</h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Device Information:</strong>
              <ul className="pl-6 mt-2">
                <li>Device type</li>
                <li>Operating system</li>
                <li>Hardware settings</li>
                <li>Unique device identifiers</li>
              </ul>
            </li>
            <li>
              <strong>Usage Data:</strong>
              <ul className="pl-6 mt-2">
                <li>IP addresses</li>
                <li>Browser type and version</li>
                <li>Referring URLs</li>
                <li>Pages visited and actions taken</li>
                <li>Session durations</li>
              </ul>
            </li>
            <li>
              <strong>Cookies and Tracking:</strong>
              <ul className="pl-6 mt-2">
                <li>Session cookies</li>
                <li>Persistent cookies</li>
                <li>Third-party tracking pixels</li>
                <li>Analytics tags</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Data Usage and Processing */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">2. How We Use Your Data</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left">Purpose</th>
                  <th className="px-6 py-3 border-b text-left">Data Used</th>
                  <th className="px-6 py-3 border-b text-left">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 border-b">Video Generation</td>
                  <td className="px-6 py-4 border-b">Story content, preferences</td>
                  <td className="px-6 py-4 border-b">Contract performance</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Service Improvement</td>
                  <td className="px-6 py-4 border-b">Usage patterns, feedback</td>
                  <td className="px-6 py-4 border-b">Legitimate interests</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Account Management</td>
                  <td className="px-6 py-4 border-b">Contact information, settings</td>
                  <td className="px-6 py-4 border-b">Contract performance</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Payment Processing</td>
                  <td className="px-6 py-4 border-b">Payment details, transaction history</td>
                  <td className="px-6 py-4 border-b">Legal obligation</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Personalization</td>
                  <td className="px-6 py-4 border-b">Preferences, usage data</td>
                  <td className="px-6 py-4 border-b">Consent</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Marketing</td>
                  <td className="px-6 py-4 border-b">Email address, demographics</td>
                  <td className="px-6 py-4 border-b">Consent</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Legal Compliance</td>
                  <td className="px-6 py-4 border-b">All data as required</td>
                  <td className="px-6 py-4 border-b">Legal obligation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* AI Processing Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">3. AI Processing Transparency</h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl mb-4">3.1 AI Content Generation</h3>
            <p className="mb-4">Our AI system processes your stories to create videos through:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Natural language processing of story content</li>
              <li>Scene generation and composition</li>
              <li>Voice synthesis and audio processing</li>
              <li>Video rendering and optimization</li>
            </ul>

            <h3 className="text-xl mb-4 mt-6">3.2 Data Retention for AI</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generated videos: 30 days after creation</li>
              <li>Processing metadata: 90 days</li>
              <li>Training data: Anonymized after 12 months</li>
            </ul>

            <h3 className="text-xl mb-4 mt-6">3.3 Anonymization and Aggregation</h3>
            <p>We anonymize and aggregate data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Improve AI model performance</li>
              <li>Develop new features</li>
              <li>Track usage trends</li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">4. Data Security</h2>
          
          <h3 className="text-xl mb-4">4.1 Security Measures</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure data backups</li>
            <li>Intrusion detection and prevention systems</li>
            <li>Data loss prevention measures</li>
          </ul>

          <h3 className="text-xl mb-4 mt-6">4.2 Incident Response</h3>
          <p>In case of a data breach, we will:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Notify affected users within 72 hours</li>
            <li>Investigate the incident</li>
            <li>Take steps to prevent recurrence</li>
            <li>Cooperate with law enforcement</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">5. Data Retention</h2>
          
          <h3 className="text-xl mb-4">5.1 Retention Periods</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information: Duration of account activity plus 30 days</li>
            <li>Generated videos: 30 days after generation</li>
            <li>Payment information: As required by law</li>
            <li>Usage logs: 90 days</li>
            <li>Email communications: 1 year</li>
          </ul>

          <h3 className="text-xl mb-4 mt-6">5.2 Data Deletion</h3>
          <p>You can request data deletion by:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contacting our privacy team</li>
            <li>Using account settings</li>
            <li>Following data deletion procedures</li>
          </ul>
        </section>

        {/* Data Sharing and Disclosure */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">6. Data Sharing and Disclosure</h2>
          
          <h3 className="text-xl mb-4">6.1 Third-Party Services</h3>
          <p>We share data with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Paystack (payment processing)</li>
            <li>Google Firebase (authentication and hosting)</li>
            <li>Google Analytics (usage analytics)</li>
            <li>Email service providers (notifications)</li>
            <li>AI model providers (content generation)</li>
          </ul>

          <h3 className="text-xl mb-4 mt-6">6.2 Legal Requirements</h3>
          <p>We may disclose information when:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Required by law</li>
            <li>To protect our rights</li>
            <li>To prevent fraud or abuse</li>
            <li>In response to legal requests</li>
          </ul>
        </section>

        {/* International Data Transfers */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">7. International Data Transfers</h2>
          
          <p>Your data may be transferred to and processed in countries outside your own. We ensure:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Data transfer agreements with standard clauses</li>
            <li>Adequate safeguards for data protection</li>
            <li>Compliance with international data transfer laws</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">8. Your Rights</h2>
          
          <h3 className="text-xl mb-4">8.1 GDPR Rights</h3>
          <p>Under GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request data deletion</li>
            <li>Export your data</li>
            <li>Object to processing</li>
            <li>Restrict processing</li>
            <li>Withdraw consent</li>
          </ul>

          <h3 className="text-xl mb-4 mt-6">8.2 Exercising Your Rights</h3>
          <p>To exercise your rights, please:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact our privacy team</li>
            <li>Submit a data request form</li>
            <li>Follow the procedures outlined in our documentation</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">9. Cookies Policy</h2>
          
          <h3 className="text-xl mb-4">9.1 Types of Cookies</h3>
          <p>We use cookies for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Essential website functionality</li>
            <li>Authentication and security</li>
            <li>User preferences</li>
            <li>Analytics and performance</li>
            <li>Marketing and advertising</li>
          </ul>

          <h3 className="text-xl mb-4 mt-6">9.2 Cookie Management</h3>
          <p>You can manage cookies through:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Browser settings</li>
            <li>Cookie consent tools</li>
            <li>Opt-out links</li>
          </ul>
        </section>

        {/* Children's Privacy */}
        <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">10. Children&apos;s Privacy</h2>
          
          <p>Our services are not intended for children under 13. We do not knowingly collect or maintain information from children under 13 years of age.</p>
          <p>If we become aware that we have collected personal information from a child under 13, we will take steps to delete the information as soon as possible.</p>
        </section>

        {/* Changes to This Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">11. Changes to This Policy</h2>
          
          <p>We may update this Privacy Policy from time to time. We will:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Notify users of significant changes</li>
            <li>Post the updated policy on our website</li>
            <li>Indicate the effective date of the changes</li>
          </ul>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Privacy Team</h3>
                <p>Email: privacy@storytime.africa</p>
                <p>Response time: 1-2 business days</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Data Protection Officer</h3>
                <p>Email: dpo@storytime.africa</p>
                <p>For EU/UK GDPR inquiries</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="mb-4">
            This Privacy Policy is effective as of {new Date().toLocaleDateString()} and will remain in effect except with respect to any changes in its provisions in the future.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Storytime Africa. All rights reserved.
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrivacyPage;
