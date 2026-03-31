import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],

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
      city: {
        type: String,
        default: '',
      },
      state: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: '',
      },
      address: {
        type: String,
        default: '',
      },
    },

    salary: {
      type: String,
      default: '',
    },
    experienceLevel: {
      type: String,
      default: '',
    },
    employmentType: {
      type: String,
      default: '',
    },
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

const Job = mongoose.model('Job', jobSchema);

export default Job;