import User from '../models/user.js';

// Get a user's public profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    // Only select public fields
    const user = await User.findById(userId).populate('categories')
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
    const users = await User.find({})
      .select('_id username profileImage categories');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'categories',
        populate: {
          path: 'notes',
          select: '_id'
        }
      })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.bio = req.body.bio;
    user.website = req.body.website;
    user.profileImage = req.body.profileImage;
    await user.save();
    res.json({ message: 'Profile updated successfully', profile: user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Follow a user
export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;
    if (targetUserId === String(currentUserId)) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }
    // Prevent duplicate follows
    if (targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "Already following this user." });
    }
    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);
    await targetUser.save();
    await currentUser.save();
    res.json({ message: "Followed successfully.", followers: targetUser.followers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;
    if (targetUserId === String(currentUserId)) {
      return res.status(400).json({ message: "You cannot unfollow yourself." });
    }
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }
    // Only unfollow if currently following
    if (!targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "You are not following this user." });
    }
    targetUser.followers = targetUser.followers.filter(
      (id) => String(id) !== String(currentUserId)
    );
    currentUser.following = currentUser.following.filter(
      (id) => String(id) !== String(targetUserId)
    );
    await targetUser.save();
    await currentUser.save();
    res.json({ message: "Unfollowed successfully.", followers: targetUser.followers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

