import express from 'express';
import {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAdminStats,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require auth + admin role
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
