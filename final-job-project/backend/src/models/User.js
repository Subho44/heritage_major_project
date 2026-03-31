import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'recruiter', 'jobseeker'],
      default: 'jobseeker',
    },
    phone: String,
    location: String,
    skills: [String],
    bio: String,
    companyName: String,
    isVerified: { type: Boolean, default: false },
    otpCode: String,
    otpExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
