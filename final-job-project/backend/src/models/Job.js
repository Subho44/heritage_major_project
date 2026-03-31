import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [String],

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      city: String,
      state: String,
      country: String,
      address: String,
    },

    salary: String,
    experienceLevel: String,
    employmentType: String,
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      default: 'onsite',
    },

    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ location: '2dsphere' });

export default mongoose.model('Job', jobSchema);