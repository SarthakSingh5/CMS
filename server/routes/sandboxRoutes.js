import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  create,
  deployTemplate,
  listFiles,
  readFile,
  writeFile,
  mkdir,
  deleteFile,
  extractData,
  kill,
} from '../controllers/sandboxController.js';

const router = express.Router();

// Optional authentication middleware: populates req.user if token present,
// but allows unauthenticated access for instant previews and beacon unload calls
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

// Lifecycle
router.post('/create', create);
router.post('/deploy-template', deployTemplate);
router.post('/extract-data', extractData);
router.post('/kill', kill);

// Filesystem API
router.get('/files', listFiles);
router.get('/files/read', readFile);
router.post('/files/write', writeFile);
router.post('/files/mkdir', mkdir);
router.post('/files/delete', deleteFile);

export default router;

