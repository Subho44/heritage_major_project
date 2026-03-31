import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: String,
    fileUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
