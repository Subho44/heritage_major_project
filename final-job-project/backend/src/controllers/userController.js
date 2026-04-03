import User from '../models/User.js';
import Resume from '../models/Resume.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select('-password -otpCode');

    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otpCode');

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, skills, bio, companyName } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.location = location ?? user.location;
    user.bio = bio ?? user.bio;
    user.companyName = companyName ?? user.companyName;

    if (skills) {
      if (Array.isArray(skills)) {
        user.skills = skills;
      } else if (typeof skills === 'string') {
        user.skills = skills.split(',').map((item) => item.trim()).filter(Boolean);
      }
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password -otpCode');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const uploadUserResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload resume PDF' });
    }

    const resume = await Resume.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        fileName: req.file.filename,
        fileUrl: `/uploads/resumes/${req.file.filename}`,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resume,
    });
  } catch (error) {
    console.error('Upload resume error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error('Get resume error:', error.message);
    res.status(500).json({ message: error.message });
  }
};