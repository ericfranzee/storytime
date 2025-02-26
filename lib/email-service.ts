"use server";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, verificationCode: string) => {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error('NEXT_PUBLIC_APP_URL is not defined in the environment.');
    }

    const verificationUrl = `${appUrl}/api/email/verify`;

    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, verificationCode }),
    });

    const data = await response.json();
    
    if (!data.success) {
      console.error('Email API Error:', data.error);
      throw new Error(data.error || 'Failed to send verification email');
    }

    if (data.dev) {
      console.log('Development mode - verification code:', verificationCode);
    }

    return true;
  } catch (error) {
    console.error('Email Service Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send verification email');
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    // Generate new verification code
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = Date.now() + 1800000; // 30 minutes

    // Update verification document with new code
    await fetch('/api/email/verify/resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, verificationCode, expiresAt }),
    });

    return true;
  } catch (error) {
    console.error('Resend Verification Error:', error);
    throw error;
  }
};
