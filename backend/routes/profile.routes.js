import express from 'express';
import { getUserProfile, getAllUsers, myProfile, updateProfile, followUser, unfollowUser,deleteUser } from '../controllers/profile.controller.js';
import {isLoggedIn} from '../middlewares/isAuthenticated.middleware.js'
import upload from '../utils/multer.util.js';

const router = express.Router();

// Get all users' public profiles
router.get('/users', getAllUsers);

// Get a specific user's public profile by ID
router.get('/MyProfile', isLoggedIn, myProfile)

router.get('/:userId', getUserProfile);

router.put(
  '/MyProfile',
  isLoggedIn,
  upload.single('profileImage'),
  updateProfile
);

// Follow a user
router.post('/:userId/follow', isLoggedIn, followUser); 

// Unfollow a user
router.post('/:userId/unfollow', isLoggedIn, unfollowUser);
router.delete('/MyProfile', isLoggedIn,deleteUser);



export default router;
