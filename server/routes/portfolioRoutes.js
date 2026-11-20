import express from 'express';
import {
    getPortfolios,
    getPortfolioById,
    savePortfolio,
    deletePortfolio,
    getPublicPortfolio,
    remixPortfolio,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public showcase endpoint (no authentication required)
router.get('/public/:identifier', getPublicPortfolio);

// Remix/fork a public portfolio into current user's workspace
router.post('/remix/:id', protect, remixPortfolio);

// All other portfolio operations require authentication
router.route('/')
    .get(protect, getPortfolios)
    .post(protect, savePortfolio);

router.route('/:id')
    .get(protect, getPortfolioById)
    .delete(protect, deletePortfolio);

export default router;

