import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    jobSeeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: String,
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'applied',
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
