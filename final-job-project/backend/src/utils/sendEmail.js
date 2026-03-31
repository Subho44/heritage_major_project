import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email, otp) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailFrom = process.env.EMAIL_FROM || emailUser;

    // If email config not set, show OTP in terminal for testing
    if (!emailUser || !emailPass) {
      console.log('EMAIL_USER or EMAIL_PASS not found in .env');
      console.log(`OTP for ${email}: ${otp}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: emailFrom,
      to: email,
      subject: 'Your Login OTP - AI Smart Job Portal',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>AI Smart Job Portal</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error('Email send error:', error.message);
    throw new Error(error.message || 'Failed to send OTP email');
  }
};