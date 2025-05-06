import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, emailNotify } = await request.json();

    // Log environment variables (remove in production)
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM
    });

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // Ensure boolean value
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
    try {
      await transporter.verify();
      console.log("SMTP Server is ready to take our messages");
    } catch (error: unknown) { // Use unknown for better type safety
      console.error("SMTP Verification Error:", error);
      // Type check before accessing properties
      const errorMessage = error instanceof Error ? error.message : 'Unknown SMTP verification error';
      return NextResponse.json({ error: `SMTP configuration error: ${errorMessage}` }, { status: 500 });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM, // Send to your support email
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);

      if (emailNotify) {
        // Send confirmation email to the user
        const confirmationMailOptions = {
          from: process.env.SMTP_FROM,
          to: email,
          subject: 'Thank you for contacting us!',
          text: `Dear ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you as soon as possible.\n\nBest regards,\nThe Storytime Team`,
          html: `<p>Dear ${name},</p><p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p><p>Best regards,<br/>The Storytime Team</p>`,
        };
        await transporter.sendMail(confirmationMailOptions);
        console.log('Confirmation email sent to user:', email);
      }

      return NextResponse.json({ message: 'Message sent successfully' });
    } catch (error: unknown) { // Use unknown for better type safety
      console.error('SMTP Error:', error);
      // Type check before accessing properties
      const errorMessage = error instanceof Error ? error.message : 'Unknown SMTP error';
      // Check if it's a Node.js error object with a code property
      const errorCode = typeof error === 'object' && error !== null && 'code' in error ? (error as { code: string }).code : undefined;
      return NextResponse.json({
        error: errorMessage,
        code: errorCode
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
