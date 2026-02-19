import express from 'express';
import {
    getContents,
    createContent,
    updateContent,
    deleteContent,
} from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getContents).post(protect, createContent);
router.route('/:id').put(protect, updateContent).delete(protect, deleteContent);

export default router;
