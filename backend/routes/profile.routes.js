import express from 'express';
import {
  getUserProfile,
  getAllUsers,
  myProfile,
  updateProfile,
  followUser,
  unfollowUser,
  deleteUser,
  requestDeleteOTP,
  getFollowers,
  getFollowing
} from '../controllers/profile.controller.js';
import { isLoggedIn } from '../middlewares/isAuthenticated.middleware.js'
import upload from '../utils/multer.util.js';

const router = express.Router();

// Get all users' public profiles
router.get('/users', getAllUsers);

// Get a specific user's public profile by ID
router.get('/MyProfile', isLoggedIn, myProfile)

// Get followers/following (Public but can be restricted if needed)
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

router.get('/:userId', getUserProfile);

router.put(
  '/MyProfile',
  isLoggedIn,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  updateProfile
);

// Follow/Unfollow (Requires Login)
router.post('/:userId/follow', isLoggedIn, followUser);
router.post('/:userId/unfollow', isLoggedIn, unfollowUser);
router.delete('/MyProfile', isLoggedIn, deleteUser);
router.post('/request-delete-otp', isLoggedIn, requestDeleteOTP);



export default router;
