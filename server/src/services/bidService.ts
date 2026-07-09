import pool from '../config/database';
import redisClient from '../config/redis';
import { Bid, Auction } from '../types';
import { ValidationError, NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

export class BidService {
  async placeBid(auctionId: string, userId: string, bidAmount: number): Promise<Bid> {
    // Get auction
    const auctionResult = await pool.query('SELECT * FROM auctions WHERE id = $1', [auctionId]);
    if (auctionResult.rows.length === 0) {
      throw new NotFoundError('Auction not found');
    }

    const auction = auctionResult.rows[0] as Auction;

    // Validate bid
    if (auction.status !== 'active') {
      throw new ValidationError('Auction is not active');
    }

    const minimumBid = auction.current_highest_bid ? auction.current_highest_bid + 1 : auction.starting_price;
    if (bidAmount < minimumBid) {
      throw new ValidationError(`Bid must be at least ${minimumBid}`);
    }

    // Check auction time
    const now = new Date();
    if (now < auction.start_time || now > auction.end_time) {
      throw new ValidationError('Auction is not active');
    }

    // Create bid
    const bidId = uuidv4();
    const result = await pool.query(
      `INSERT INTO bids (id, auction_id, user_id, bid_amount)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [bidId, auctionId, userId, bidAmount]
    );

    const bid = result.rows[0] as Bid;

    // Update auction highest bid
    await pool.query(
      `UPDATE auctions SET current_highest_bid = $1, current_highest_bidder_id = $2, total_bids = total_bids + 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [bidAmount, userId, auctionId]
    );

    // Invalidate cache
    await redisClient.del(`auction:${auctionId}`);

    return bid;
  }

  async getUserBids(userId: string, limit: number = 50, offset: number = 0): Promise<{ bids: Bid[]; total: number }> {
    const result = await pool.query(
      `SELECT * FROM bids WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) as total FROM bids WHERE user_id = $1', [userId]);

    return {
      bids: result.rows as Bid[],
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async getHighestBidder(auctionId: string): Promise<string | null> {
    const result = await pool.query(
      `SELECT user_id FROM bids WHERE auction_id = $1 ORDER BY bid_amount DESC LIMIT 1`,
      [auctionId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].user_id;
  }
}

export default new BidService();
