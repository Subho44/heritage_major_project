import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role,
      isVerified: false,
    });

    res.status(201).json({
      message: 'Registration successful. Please login with OTP.',
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginWithPassword = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail, role: cleanRole });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.otpCode = otp;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otp);

    res.json({
      message: 'OTP sent successfully. Please verify OTP.',
      email: user.email,
      role: user.role,
      devOtp: !process.env.EMAIL_USER || !process.env.EMAIL_PASS ? otp : undefined,
    });
  } catch (error) {
    console.error('Login OTP error:', error.message);
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, role, otp } = req.body;

    if (!email || !role || !otp) {
      return res.status(400).json({ message: 'Email, role and OTP are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({ email: cleanEmail, role: cleanRole });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.otpCode || !user.otpExpire) {
      return res.status(400).json({ message: 'No OTP found. Please request OTP again.' });
    }

    if (user.otpExpire.getTime() < Date.now()) {
      user.otpCode = undefined;
      user.otpExpire = undefined;
      await user.save();
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    if (String(user.otpCode).trim() !== cleanOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).json({ message: error.message || 'OTP verification failed' });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail, role: cleanRole });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otpCode = otp;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otp);

    res.json({
      message: 'New OTP sent successfully',
      devOtp: !process.env.EMAIL_USER || !process.env.EMAIL_PASS ? otp : undefined,
    });
  } catch (error) {
    console.error('Resend OTP error:', error.message);
    res.status(500).json({ message: error.message || 'Resend OTP failed' });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};