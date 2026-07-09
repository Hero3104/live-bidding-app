import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import bidService from '../services/bidService';
import { bidValidation, validateRequest } from '../utils/validators';

export const placeBid = [
  ...bidValidation,
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { auction_id, bid_amount } = req.body;
    const bid = await bidService.placeBid(auction_id, req.user.id, bid_amount);

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: bid,
    });
  }),
];

export const getUserBids = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const { limit = 50, offset = 0 } = req.query;
  const { bids, total } = await bidService.getUserBids(
    req.user.id,
    parseInt(limit as string, 10),
    parseInt(offset as string, 10)
  );

  res.status(200).json({
    success: true,
    data: bids,
    pagination: {
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      total,
    },
  });
});
