import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVideoReadyEmail(to: string, videoUrl: string) {
  const emailTemplate = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>Your Video is Ready! 🎉</h2>
      <p>Great news! Your video has been generated and is ready to view.</p>
      <div style="margin: 20px 0;">
        <a href="${videoUrl}" 
           style="background-color: #0070f3; color: white; padding: 12px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          View Your Video
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        If the button doesn't work, you can copy and paste this link into your browser:<br>
        ${videoUrl}
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Your Storytime Video is Ready!',
      html: emailTemplate,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
