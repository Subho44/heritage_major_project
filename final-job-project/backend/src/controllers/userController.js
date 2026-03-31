import User from '../models/User.js';
import Resume from '../models/Resume.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, skills, bio, companyName } = req.body;
    const user = await User.findById(req.user._id);

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.location = location ?? user.location;
    user.bio = bio ?? user.bio;
    user.companyName = companyName ?? user.companyName;
    user.skills = skills ? skills.split(',').map((item) => item.trim()) : user.skills;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (error) {
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

    res.json({ message: 'Resume uploaded', resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
