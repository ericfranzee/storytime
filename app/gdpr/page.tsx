'use client';

import React from 'react';
import PageTransition from '@/components/animations/PageTransition';
import type { FC } from 'react';

const GDPRPage: FC = () => {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 prose prose-gray dark:prose-invert max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">GDPR Compliance</h1>
        <div className="text-sm mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center">
          <span>Last Updated: {new Date().toLocaleDateString()}</span>
          <span>Version 1.0</span>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <p>
            Storytime Africa is committed to protecting the privacy and security of your personal data. This GDPR Compliance page outlines our practices in accordance with the General Data Protection Regulation (GDPR).
          </p>
        </section>

        {/* Principles */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. GDPR Principles</h2>
          <p>We adhere to the following GDPR principles:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Lawfulness, Fairness, and Transparency:</strong> We process data lawfully, fairly, and transparently.
            </li>
            <li>
              <strong>Purpose Limitation:</strong> We collect data only for specified, explicit, and legitimate purposes.
            </li>
            <li>
              <strong>Data Minimization:</strong> We collect only data that is adequate, relevant, and limited to what is necessary.
            </li>
            <li>
              <strong>Accuracy:</strong> We ensure that personal data is accurate and kept up to date.
            </li>
            <li>
              <strong>Storage Limitation:</strong> We keep data only for as long as necessary.
            </li>
            <li>
              <strong>Integrity and Confidentiality:</strong> We protect data using appropriate security measures.
            </li>
            <li>
              <strong>Accountability:</strong> We are responsible for complying with these principles.
            </li>
          </ul>
        </section>

        {/* Legal Basis for Processing */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Legal Basis for Processing</h2>
          <p>We process personal data based on the following legal bases:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Consent:</strong> We obtain your explicit consent to process your data for specific purposes.
            </li>
            <li>
              <strong>Contract:</strong> We process data to fulfill our contractual obligations to you.
            </li>
            <li>
              <strong>Legal Obligation:</strong> We process data to comply with legal requirements.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> We process data for our legitimate interests, provided that your rights are not overridden.
            </li>
          </ul>
        </section>

        {/* Data Subject Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Subject Rights</h2>
          <p>Under GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Right to Access:</strong> You can request access to your personal data.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You can correct inaccurate or incomplete data.
            </li>
            <li>
              <strong>Right to Erasure (Right to be Forgotten):</strong> You can request the deletion of your data.
            </li>
            <li>
              <strong>Right to Restriction of Processing:</strong> You can limit how we use your data.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You can receive your data in a structured, commonly used format.
            </li>
            <li>
              <strong>Right to Object:</strong> You can object to the processing of your data.
            </li>
            <li>
              <strong>Right not to be subject to Automated Decision-Making:</strong> You can object to decisions based solely on automated processing.
            </li>
          </ul>
        </section>

        {/* Exercising Your Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Exercising Your Rights</h2>
          <p>To exercise your GDPR rights, please contact us at:</p>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <p>Email: dpo@storytime.africa</p>
            <p>Address: [Your Business Address]</p>
          </div>
        </section>

        {/* Data Transfers */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. International Data Transfers</h2>
          <p>
            If we transfer your data outside the European Economic Area (EEA), we ensure that appropriate safeguards are in place to protect your data, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standard Contractual Clauses (SCCs)</li>
            <li>Binding Corporate Rules (BCRs)</li>
            <li>Adequacy decisions from the European Commission</li>
          </ul>
        </section>

        {/* Data Security Measures */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security Measures</h2>
          <p>We implement appropriate technical and organizational measures to protect your data, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure data backups</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
          <p>We retain your data only for as long as necessary to fulfill the purposes for which it was collected, including legal and regulatory requirements.</p>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <p>For GDPR-related inquiries, please contact our Data Protection Officer:</p>
            <p>Email: dpo@storytime.africa</p>
            <p>Address: [Your Business Address]</p>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="mb-4">
            This GDPR Compliance page is effective as of {new Date().toLocaleDateString()} and will be reviewed and updated periodically.
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
export default GDPRPage;
