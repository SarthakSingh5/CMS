import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  uploadToGitHub,
  getGitHubStatus,
  saveGitHubToken,
} from '../controllers/githubController.js';

const router = express.Router();

// Optional authentication middleware
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

router.post('/upload', uploadToGitHub);
router.get('/status', getGitHubStatus);
router.post('/token', saveGitHubToken);

export default router;
