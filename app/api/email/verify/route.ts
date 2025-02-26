"use server";
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Test SMTP connection during initialization
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Add this for development
  },
  debug: true // Enable debug logs
});

// Verify SMTP connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

export async function POST(request: NextRequest) {
  try {
    const { email, verificationCode } = await request.json();

    // Log environment variables (remove in production)
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM
    });

    const msg = {
      from: {
        name: 'Storytime',
        address: process.env.SMTP_FROM || 'noreply@storytime.africa'
      },
      to: email,
      subject: 'Verify your Storytime account',
      text: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome to Storytime!</h1>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p style="font-size: 16px;">Your verification code is:</p>
            <h2 style="color: #4338ca; font-size: 32px; text-align: center; letter-spacing: 5px; margin: 20px 0;">
              ${verificationCode}
            </h2>
            <p style="color: #666; font-size: 14px;">This code will expire in 30 minutes.</p>
          </div>
        </div>
      `
    };

    if (process.env.NODE_ENV === 'production') {
      try {
        const info = await transporter.sendMail(msg);
        console.log('Email sent:', info.response);
        return NextResponse.json({ 
          success: true,
          messageId: info.messageId 
        });
      } catch (emailError: any) {
        console.error('SMTP Error:', emailError);
        return NextResponse.json({ 
          success: false, 
          error: emailError.message,
          code: emailError.code 
        }, { status: 500 });
      }
    } else {
      // Development mode
      console.log('Development mode - Email details:', {
        to: email,
        code: verificationCode,
        subject: msg.subject
      });
      return NextResponse.json({ 
        success: true,
        dev: true
      });
    }
  } catch (error: any) {
    console.error('Verification Route Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
