import express from 'express';
import { getUserCv, saveUserCv } from '../controllers/cvController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getUserCv)
    .post(protect, saveUserCv);

export default router;

