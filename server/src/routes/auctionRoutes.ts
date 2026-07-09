import express from 'express';
import * as auctionController from '../controllers/auctionController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

router.get('/', auctionController.getAllAuctions);
router.get('/watched', authenticateToken, auctionController.getWatchedAuctions);
router.get('/:id', auctionController.getAuctionById);
router.get('/:id/bids', auctionController.getAuctionBids);

router.post('/', authenticateToken, requireRole(['admin']), auctionController.createAuction);
router.put('/:id/status', authenticateToken, requireRole(['admin']), auctionController.updateAuctionStatus);

export default router;
