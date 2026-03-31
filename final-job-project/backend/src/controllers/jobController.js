import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Create Job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      skillsRequired,
      salary,
      experienceLevel,
      employmentType,
      workMode,
      location,
    } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        message: 'Title, company and description are required',
      });
    }

    if (
      !location ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message: 'Valid location coordinates are required as [lng, lat]',
      });
    }

    const parsedSkills = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === 'string'
      ? skillsRequired.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      title,
      company,
      description,
      skillsRequired: parsedSkills,
      salary,
      experienceLevel,
      employmentType,
      workMode,
      location: {
        type: 'Point',
        coordinates: [
          Number(location.coordinates[0]),
          Number(location.coordinates[1]),
        ],
        city: location.city || '',
        state: location.state || '',
        country: location.country || '',
        address: location.address || '',
      },
      postedBy: req.user._id,
    });

    const seekers = await User.find({ role: 'jobseeker' }).select('_id');

    if (seekers.length > 0) {
      const notifications = seekers.map((user) => ({
        user: user._id,
        title: 'New Job Posted',
        message: `${job.title} at ${job.company}`,
      }));

      await Notification.insertMany(notifications);
    }

    return res.status(201).json({
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    console.error('createJob error:', error);
    return res.status(500).json({
      message: error.message || 'Server error while creating job',
    });
  }
};

// Get all open jobs
export const getJobs = async (req, res) => {
  try {
    const { search = '', city = '', employmentType = '', workMode = '' } = req.query;

    const query = { status: 'open' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skillsRequired: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (workMode) {
      query.workMode = workMode;
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error('getJobs error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Recruiter jobs
export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    console.error('getRecruiterJobs error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (String(job.postedBy) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const {
      title,
      company,
      description,
      skillsRequired,
      salary,
      experienceLevel,
      employmentType,
      workMode,
      location,
      status,
    } = req.body;

    if (title !== undefined) job.title = title;
    if (company !== undefined) job.company = company;
    if (description !== undefined) job.description = description;
    if (salary !== undefined) job.salary = salary;
    if (experienceLevel !== undefined) job.experienceLevel = experienceLevel;
    if (employmentType !== undefined) job.employmentType = employmentType;
    if (workMode !== undefined) job.workMode = workMode;
    if (status !== undefined) job.status = status;

    if (skillsRequired !== undefined) {
      job.skillsRequired = Array.isArray(skillsRequired)
        ? skillsRequired
        : typeof skillsRequired === 'string'
        ? skillsRequired.split(',').map((item) => item.trim()).filter(Boolean)
        : [];
    }

    if (location) {
      job.location = {
        type: 'Point',
        coordinates:
          Array.isArray(location.coordinates) && location.coordinates.length === 2
            ? [Number(location.coordinates[0]), Number(location.coordinates[1])]
            : job.location.coordinates,
        city: location.city ?? job.location.city,
        state: location.state ?? job.location.state,
        country: location.country ?? job.location.country,
        address: location.address ?? job.location.address,
      };
    }

    await job.save();

    return res.status(200).json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    console.error('updateJob error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (String(job.postedBy) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await job.deleteOne();

    return res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('deleteJob error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Nearby jobs
export const getNearbyJobs = async (req, res) => {
  try {
    const { lat, lng, distance = 20000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: 'Latitude and longitude are required',
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);
    const maxDistance = Number(distance);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({
        message: 'Invalid latitude or longitude',
      });
    }

    const jobs = await Job.find({
      status: 'open',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    }).populate('postedBy', 'name email role');

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('getNearbyJobs error:', error);
    return res.status(500).json({
      message: error.message || 'Server error while fetching nearby jobs',
    });
  }
};