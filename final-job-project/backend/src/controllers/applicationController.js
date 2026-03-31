import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';

export const applyToJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const application = await Application.create({
      job: job._id,
      recruiter: job.postedBy,
      jobSeeker: req.user._id,
      coverLetter,
    });

    await Notification.create({
      user: job.postedBy,
      title: 'New Application Received',
      message: `${req.user.name} applied for ${job.title}`,
    });

    res.status(201).json({ message: 'Application submitted', application });
  } catch (error) {
    const message = error.code === 11000 ? 'You already applied for this job' : error.message;
    res.status(400).json({ message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobSeeker: req.user._id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsForRecruiter = async (req, res) => {
  try {
    const applications = await Application.find({ recruiter: req.user._id })
      .populate('job', 'title company')
      .populate('jobSeeker', 'name email skills location')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job', 'title');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = req.body.status;
    await application.save();

    await Notification.create({
      user: application.jobSeeker,
      title: 'Application Status Updated',
      message: `Your application for ${application.job.title} is now ${application.status}`,
    });

    res.json({ message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
