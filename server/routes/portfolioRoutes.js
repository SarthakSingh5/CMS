import express from 'express';
import {
    getPortfolios,
    getPortfolioById,
    savePortfolio,
    deletePortfolio,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All portfolio operations require authentication
router.route('/')
    .get(protect, getPortfolios)
    .post(protect, savePortfolio);

router.route('/:id')
    .get(protect, getPortfolioById)
    .delete(protect, deletePortfolio);

export default router;

