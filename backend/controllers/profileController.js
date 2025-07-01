import User from '../models/user.js';
import Note from '../models/note.js';
import Category from '../models/category.js';
import { cloudinary } from '../utils/cloudinary.js';

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

function extractPublicId(url) {
  try {
    const urlParts = url.split('/upload/');
    if (urlParts.length < 2) return null;

    let publicIdWithVersion = urlParts[1]; 
    const parts = publicIdWithVersion.split('/');
    
    if (parts[0].startsWith('v')) parts.shift();

    let publicId = parts.join('/');
    publicId = publicId.split('.')[0];

    return publicId;
  } catch {
    return null;
  }
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    

    if (
      req.body.profileImage &&
      user.profileImage &&
      user.profileImage.filename &&
      req.body.profileImage.filename !== user.profileImage.filename
    ) {
      const publicId = extractPublicId(user.profileImage.filename);
      
      if (publicId) {
        console.log("Deleting Cloudinary image with publicId:", publicId);
        const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
        console.log(result); 
      } else {
        console.log("Failed to extract publicId from:", user.profileImage.filename);
      }
    }
    

    user.bio = req.body.bio;
    user.website = req.body.website;
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }
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

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.profileImage && req.user.profileImage.filename) {
      await cloudinary.uploader.destroy(req.user.profileImage.filename);
    }

    await Note.deleteMany({ user: userId });
    await Category.deleteMany({ user: userId });
    await req.user.deleteOne();

    res.json({ message: 'Profile, image, and all associated notes and categories deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}