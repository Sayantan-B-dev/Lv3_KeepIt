import User from '../models/user.js';

// Get a user's public profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    // Only select public fields
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all users' public profiles
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('_id username profileImage');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
