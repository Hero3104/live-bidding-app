import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import auctionService from '../services/auctionService';
import { auctionValidation, validateRequest } from '../utils/validators';

export const getAllAuctions = asyncHandler(async (req: Request, res: Response) => {
  const { status, limit = 50, offset = 0 } = req.query;
  const { auctions, total } = await auctionService.getAllAuctions(
    status as string | undefined,
    parseInt(limit as string, 10),
    parseInt(offset as string, 10)
  );

  res.status(200).json({
    success: true,
    data: auctions,
    pagination: {
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      total,
    },
  });
});

export const getAuctionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const auction = await auctionService.getAuctionById(id);

  res.status(200).json({
    success: true,
    data: auction,
  });
});

export const createAuction = [
  ...auctionValidation,
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { title, description, starting_price, start_time, end_time, category, image_url } = req.body;
    const auction = await auctionService.createAuction(
      title,
      description,
      starting_price,
      new Date(start_time),
      new Date(end_time),
      req.user.id,
      category,
      image_url
    );

    res.status(201).json({
      success: true,
      message: 'Auction created successfully',
      data: auction,
    });
  }),
];

export const updateAuctionStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const auction = await auctionService.updateAuctionStatus(id, status);

  res.status(200).json({
    success: true,
    message: 'Auction status updated',
    data: auction,
  });
});

export const getAuctionBids = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const bids = await auctionService.getBidsForAuction(id);

  res.status(200).json({
    success: true,
    data: bids,
  });
});

export const getWatchedAuctions = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const auctions = await auctionService.getWatchedAuctions(req.user.id);

  res.status(200).json({
    success: true,
    data: auctions,
  });
});
