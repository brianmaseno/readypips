import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
export const emailTemplates = {
  emailVerification: (firstName: string, verificationUrl: string) => ({
    subject: 'Verify Your Email - Ready Pips',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { height: 50px; margin-bottom: 20px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
          .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-light.png" alt="Ready Pips" class="logo">
            <h1>Welcome to Ready Pips!</h1>
          </div>
          
          <p>Hello ${firstName},</p>
          
          <p>Thank you for registering with Ready Pips! To complete your registration and access your account, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <div class="warning">
            <strong>Important:</strong> This verification link will expire in 24 hours.
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #16a34a;">${verificationUrl}</p>
          
          <div class="footer">
            <p>Best regards,<br>The Ready Pips Team</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (firstName: string, resetUrl: string) => ({
    subject: 'Reset Your Password - Ready Pips',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { height: 50px; margin-bottom: 20px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
          .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-light.png" alt="Ready Pips" class="logo">
            <h1>Reset Your Password</h1>
          </div>
          
          <p>Hello ${firstName},</p>
          
          <p>We received a request to reset your password for your Ready Pips account. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          
          <div class="warning">
            <strong>Security Notice:</strong> This link will expire in 1 hour for your security.
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #16a34a;">${resetUrl}</p>
          
          <div class="footer">
            <p>Best regards,<br>The Ready Pips Team</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function
export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Ready Pips <noreply@readypips.com>',
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
