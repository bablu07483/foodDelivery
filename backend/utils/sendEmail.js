const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // This tells Node.js to ignore the "self-signed certificate" error
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: '"NutriFit Team" <noreply@nutrifit.com>',
      to: userEmail,
      subject: 'Welcome to NutriFit!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f4f4f4; padding: 20px; border-radius: 10px;">
          <h2 style="color: #28a745; text-align: center;">Welcome to NutriFit, ${userName}!</h2>
          <p>Thank you for joining NutriFit. Your journey towards a healthier lifestyle starts here!</p>
          <p>With your new account, you can track your nutrition, explore custom diet plans, and order meals tailored to your needs.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:4200/login" 
               style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
               Login to NutriFit
            </a>
          </div>
          <p style="font-size: 0.9em; color: #666; text-align: center;">If you have any questions, feel free to reply to this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 0.8em; color: #aaa; text-align: center;">© 2026 NutriFit. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('Email error:', error);
  }
};

// NEW: Function to send OTP for Login Verification
const sendOTPEmail = async (userEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: '"NutriFit Security" <noreply@nutrifit.com>',
      to: userEmail,
      subject: 'Your NutriFit Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f4f4f4; padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="color: #28a745;">Login Verification</h2>
          <p>Please use the following One-Time Password (OTP) to complete your login process. This code is valid for 10 minutes.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; display: inline-block;">
            <h1 style="color: #333; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p style="font-size: 0.9em; color: #666;">If you did not request this code, please ignore this email or secure your account.</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 0.8em; color: #aaa;">© 2026 NutriFit Security Team.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${userEmail}`);
  } catch (error) {
    console.error('OTP Email error:', error);
  }
};

// Updated exports to include both functions
module.exports = { 
  sendWelcomeEmail, 
  sendOTPEmail 
};