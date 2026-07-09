import pool from '../config/database';
import redisClient from '../config/redis';
import { Auction, Bid } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

export class AuctionService {
  async getAllAuctions(status?: string, limit: number = 50, offset: number = 0): Promise<{ auctions: Auction[]; total: number }> {
    let query = 'SELECT * FROM auctions';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM auctions';
    if (status) {
      countQuery += ' WHERE status = $1';
    }
    const countResult = await pool.query(countQuery, status ? [status] : []);

    return {
      auctions: result.rows as Auction[],
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async getAuctionById(auctionId: string): Promise<Auction> {
    // Try to get from cache first
    const cached = await redisClient.get(`auction:${auctionId}`);
    if (cached) {
      return JSON.parse(cached) as Auction;
    }

    const result = await pool.query('SELECT * FROM auctions WHERE id = $1', [auctionId]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Auction not found');
    }

    const auction = result.rows[0] as Auction;
    // Cache for 5 minutes
    await redisClient.setEx(`auction:${auctionId}`, 300, JSON.stringify(auction));

    return auction;
  }

  async createAuction(
    title: string,
    description: string,
    startingPrice: number,
    startTime: Date,
    endTime: Date,
    createdBy: string,
    category?: string,
    imageUrl?: string
  ): Promise<Auction> {
    if (startTime >= endTime) {
      throw new ValidationError('Start time must be before end time');
    }

    if (startingPrice <= 0) {
      throw new ValidationError('Starting price must be greater than 0');
    }

    const auctionId = uuidv4();
    const result = await pool.query(
      `INSERT INTO auctions (id, title, description, category, starting_price, status, created_by, start_time, end_time, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [auctionId, title, description, category || null, startingPrice, 'pending', createdBy, startTime, endTime, imageUrl || null]
    );

    return result.rows[0] as Auction;
  }

  async updateAuctionStatus(auctionId: string, status: string): Promise<Auction> {
    const result = await pool.query(
      'UPDATE auctions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, auctionId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Auction not found');
    }

    // Invalidate cache
    await redisClient.del(`auction:${auctionId}`);

    return result.rows[0] as Auction;
  }

  async getBidsForAuction(auctionId: string): Promise<Bid[]> {
    const result = await pool.query(
      `SELECT id, auction_id, user_id, bid_amount, created_at FROM bids
       WHERE auction_id = $1
       ORDER BY bid_amount DESC, created_at DESC`,
      [auctionId]
    );

    return result.rows as Bid[];
  }

  async getWatchedAuctions(userId: string): Promise<Auction[]> {
    const result = await pool.query(
      `SELECT a.* FROM auctions a
       JOIN auction_watchers aw ON a.id = aw.auction_id
       WHERE aw.user_id = $1
       ORDER BY a.created_at DESC`,
      [userId]
    );

    return result.rows as Auction[];
  }
}

export default new AuctionService();
