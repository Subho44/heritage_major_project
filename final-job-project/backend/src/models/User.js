import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'recruiter', 'jobseeker'],
      default: 'jobseeker',
    },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    skills: { type: [String], default: [] },
    bio: { type: String, default: '' },
    companyName: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String, default: '' },
    otpExpire: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;