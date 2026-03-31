import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createJob = async (req, res) => {
  try {
    const { title, company, location, jobType, experience, salary, skills, description } = req.body;
    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      experience,
      salary,
      description,
      skills: skills ? skills.split(',').map((item) => item.trim()) : [],
      postedBy: req.user._id,
    });

    const seekers = await User.find({ role: 'jobseeker' }).select('_id');
    if (seekers.length) {
      const notifications = seekers.map((user) => ({
        user: user._id,
        title: 'New Job Posted',
        message: `${job.title} at ${job.company}`,
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { search = '', location = '', jobType = '' } = req.query;
    const query = {
      status: 'open',
      title: { $regex: search, $options: 'i' },
      location: { $regex: location, $options: 'i' },
    };

    if (jobType) query.jobType = jobType;

    const jobs = await Job.find(query).populate('postedBy', 'name email role').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (String(job.postedBy) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    Object.assign(job, req.body);
    if (req.body.skills) job.skills = req.body.skills.split(',').map((item) => item.trim());

    await job.save();
    res.json({ message: 'Job updated', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (String(job.postedBy) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
