import express from 'express';
import * as bidController from '../controllers/bidController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, bidController.placeBid);
router.get('/user/history', authenticateToken, bidController.getUserBids);

export default router;
