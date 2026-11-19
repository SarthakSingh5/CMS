import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  deployToVercel,
  getVercelStatus,
  saveVercelToken,
} from '../controllers/vercelController.js';

const router = express.Router();

const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch {
      // Continue without user
    }
  }
  next();
};

router.use(optionalProtect);

router.post('/deploy', deployToVercel);
router.get('/status', getVercelStatus);
router.post('/token', saveVercelToken);

export default router;
