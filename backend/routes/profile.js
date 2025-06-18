import express from 'express';
import { getUserProfile, getAllUsers } from '../controllers/profileController.js';


const router = express.Router();

// Get all users' public profiles
router.get('/users', getAllUsers);

// Get a specific user's public profile by ID
router.get('/:userId', getUserProfile);

export default router;
