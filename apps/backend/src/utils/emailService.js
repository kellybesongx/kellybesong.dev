// /**
//  * Email service using Nodemailer (as per implementation plan)
//  * Sends "New lead received" notifications
//  */

// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure transporter (using Resend or SMTP)
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// interface LeadNotification {
//   name: string;
//   email: string;
//   intent: string;
// }

// /**
//  * Send email notification for new lead
//  * Optional but recommended in implementation plan
//  */
// export const sendLeadNotification = async (lead: LeadNotification): Promise<void> => {
//   // Don't send in development unless explicitly configured
//   if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
//     console.log('[Email skipped] New lead received:', lead);
//     return;
//   }
  
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM || 'chatbot@yourportfolio.com',
//       to: process.env.EMAIL_TO || 'admin@yourportfolio.com',
//       subject: `🎉 New Lead: ${lead.intent} inquiry`,
//       html: `
//         <h2>New Lead Captured</h2>
//         <p><strong>Intent:</strong> ${lead.intent}</p>
//         <p><strong>Name:</strong> ${lead.name || 'Not provided'}</p>
//         <p><strong>Email:</strong> ${lead.email}</p>
//         <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
//       `,
//     });
    
//     console.log('Email notification sent for lead:', lead.email);
//   } catch (error) {
//     console.error('Failed to send email notification:', error);
//     // Don't throw - email failure shouldn't break the lead capture
//   }
// };

/**
 * Email service using Nodemailer (as per implementation plan)
 * Sends "New lead received" notifications
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure transporter (using SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send email notification for new lead
 * Optional but recommended in implementation plan
 */
const sendLeadNotification = async (lead) => {
  // Don't send in development unless explicitly configured
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
    console.log('[Email skipped] New lead received:', lead);
    return;
  }
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'chatbot@yourportfolio.com',
      to: process.env.EMAIL_TO || 'admin@yourportfolio.com',
      subject: `🎉 New Lead: ${lead.intent} inquiry`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #333; }
            .value { color: #666; margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎉 New Lead Captured!</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Intent:</div>
                <div class="value">${lead.intent}</div>
              </div>
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${lead.name || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${lead.email}</div>
              </div>
              <div class="field">
                <div class="label">Time:</div>
                <div class="value">${new Date().toLocaleString()}</div>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message from your portfolio chatbot.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    console.log('✅ Email notification sent for lead:', lead.email);
  } catch (error) {
    console.error('❌ Failed to send email notification:', error.message);
    // Don't throw - email failure shouldn't break the lead capture
  }
};

module.exports = { sendLeadNotification };