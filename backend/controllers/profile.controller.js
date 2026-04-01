
//profileController.js
import User from '../models/user.model.js';
import Note from '../models/note.model.js';
import Category from '../models/category.model.js';
import { cloudinary } from '../utils/cloudinary.util.js';
import CategoryType from "../models/categoryType.model.js";
import sendEmail from '../utils/sendEmail.js';
import generateOTP from '../utils/generateOTP.js';

// Get a user's public profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?._id;

    const user = await User.findById(userId)
      .populate({
        path: "categories",
        populate: {
          path: "categoryType",
          select: "name",
        },
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add isFollowing flag if requester is logged in
    let isFollowing = false;
    if (currentUserId) {
      isFollowing = user.followers.some(id => String(id) === String(currentUserId));
    }

    // Calculate total notes and unique tags
    const notesResult = await Note.find({ user: userId }).select('tags isPrivate').lean();
    
    // For a public profile, only count public notes unless requester is the owner
    const isOwner = currentUserId && String(currentUserId) === String(userId);
    const visibleNotes = isOwner ? notesResult : notesResult.filter(n => !n.isPrivate);

    const totalNotes = visibleNotes.length;
    
    const uniqueTags = new Set();
    visibleNotes.forEach(note => {
      if (Array.isArray(note.tags)) {
        note.tags.forEach(tag => uniqueTags.add(tag.toLowerCase()));
      }
    });
    const totalTags = uniqueTags.size;

    res.json({ ...user, isFollowing, totalNotes, totalTags });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all users' public profiles
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const query = {};
    if (search && typeof search === 'string') {
      const regex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ username: regex }, { email: regex }];
    }

    const users = await User.find(query)
      .select('_id username profileImage categories createdAt')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageLimit)
      .limit(pageLimit)
      .lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "categories",
        populate: [
          { path: "notes", select: "_id" },
          { path: "categoryType", select: "name" }
        ],
      })
      .lean();

    const notesResult = await Note.find({ user: req.user._id }).select('tags').lean();
    const totalNotes = notesResult.length;
    
    const uniqueTags = new Set();
    notesResult.forEach(note => {
      if (Array.isArray(note.tags)) {
        note.tags.forEach(tag => uniqueTags.add(tag.toLowerCase()));
      }
    });
    const totalTags = uniqueTags.size;

    res.json({ ...user, totalNotes, totalTags });
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
      return res.status(404).json({ message: "User not found" });
    }

    // Update text fields
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.website !== undefined) user.website = req.body.website;

    // Handle image replacement
    if (req.file) {
      // delete old image
      if (user.profileImage?.filename) {
        const publicId = extractPublicId(user.profileImage.filename);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { invalidate: true });
        }
      }

      // save new image
      user.profileImage = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};


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
}


export const requestDeleteOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Simplified: Always generate a NEW one to ensure fresh typing experience, 
    // OR keep reuse but shorter. Let's keep reuse for 1 min to prevent spamming.
    const ONE_MINUTE = 60 * 1000;
    const isRecentlyGenerated = user.otp && user.otpExpires && (user.otpExpires - Date.now() > (10 * 60 * 1000 - ONE_MINUTE));

    let otp = user.otp;
    if (!isRecentlyGenerated || !otp) {
      otp = generateOTP();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
    }

    // Return OTP directly to frontend
    res.json({ otp });
  } catch (err) {
    console.error("requestDeleteOTP Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });


    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // cloudinary cleanup
    if (req.user.profileImage?.filename) {
      const publicId = extractPublicId(req.user.profileImage.filename);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
      }
    }

    // find categories
    const categories = await Category.find({ user: userId }, "_id");
    const categoryIds = categories.map(c => c._id);

    // delete notes
    await Note.deleteMany({ user: userId });

    // delete categories
    await Category.deleteMany({ _id: { $in: categoryIds } });

    // delete category types
    await CategoryType.deleteMany({ user: userId });

    // remove from followers/following
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );

    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    // delete user
    await User.deleteOne({ _id: userId });

    res.json({ message: "User and all related data deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: err.message });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("followers", "username profileImage bio isVerified")
      .select("followers");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get users followed by a user
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("following", "username profileImage bio isVerified")
      .select("following");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
