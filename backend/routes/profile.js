import express from 'express';
import { getUserProfile, getAllUsers, myProfile, updateProfile } from '../controllers/profileController.js';
import {isLoggedIn} from '../middlewares/isAuthenticated.js'


const router = express.Router();

// Get all users' public profiles
router.get('/users', getAllUsers);

// Get a specific user's public profile by ID
router.get('/MyProfile', isLoggedIn, myProfile)

router.get('/:userId', getUserProfile);

router.put('/MyProfile', isLoggedIn, updateProfile);

export default router;
