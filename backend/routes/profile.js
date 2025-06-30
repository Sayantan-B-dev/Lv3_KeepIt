import express from 'express';
import { getUserProfile, getAllUsers, myProfile, updateProfile, followUser, unfollowUser } from '../controllers/profileController.js';
import {isLoggedIn} from '../middlewares/isAuthenticated.js'
import { aiModeration } from '../middlewares/aiModeration.js'

const router = express.Router();

// Get all users' public profiles
router.get('/users', getAllUsers);

// Get a specific user's public profile by ID
router.get('/MyProfile', isLoggedIn, myProfile)

router.get('/:userId', getUserProfile);

router.put('/MyProfile', isLoggedIn, aiModeration, updateProfile);

// Follow a user
router.post('/:userId/follow', isLoggedIn, followUser); 

// Unfollow a user
router.post('/:userId/unfollow', isLoggedIn, unfollowUser);

export default router;
