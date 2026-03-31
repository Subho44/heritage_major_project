import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [users, jobs, applications, notifications] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Notification.countDocuments(),
    ]);

    const roleStats = await User.aggregate([
      { $group: { _id: '$role', total: { $sum: 1 } } },
    ]);

    res.json({ users, jobs, applications, notifications, roleStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -otpCode').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
