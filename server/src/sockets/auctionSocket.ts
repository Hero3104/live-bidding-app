import { Server, Socket } from 'socket.io';
import { verifyToken, TokenPayload } from '../utils/jwt';
import bidService from '../services/bidService';
import auctionService from '../services/auctionService';
import logger from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  user?: TokenPayload;
}

const userSockets: Map<string, AuthenticatedSocket[]> = new Map();
const auctionRooms: Map<string, Set<string>> = new Map();

export const setupSocketHandlers = (io: Server) => {
  // Middleware for authentication
  io.use((socket: any, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication failed'));
    }

    try {
      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user?.id;
    logger.info(`User connected: ${userId}`, { socketId: socket.id });

    // Track user sockets
    if (userId) {
      if (!userSockets.has(userId)) {
        userSockets.set(userId, []);
      }
      userSockets.get(userId)!.push(socket);
    }

    // Join auction room
    socket.on('join-auction', (auctionId: string) => {
      const roomName = `auction:${auctionId}`;
      socket.join(roomName);
      logger.info(`User joined auction: ${auctionId}`, { userId, socketId: socket.id });

      if (!auctionRooms.has(auctionId)) {
        auctionRooms.set(auctionId, new Set());
      }
      auctionRooms.get(auctionId)!.add(userId!);

      // Notify others
      socket.to(roomName).emit('user-joined', {
        userId,
        timestamp: new Date(),
        activeUsers: auctionRooms.get(auctionId)?.size || 0,
      });
    });

    // Place bid
    socket.on('place-bid', async (data: { auctionId: string; bidAmount: number }) => {
      try {
        const { auctionId, bidAmount } = data;
        const bid = await bidService.placeBid(auctionId, userId!, bidAmount);
        const roomName = `auction:${auctionId}`;

        logger.info(`Bid placed: ${bidAmount} on auction ${auctionId}`, { userId });

        // Notify all users in the auction room
        io.to(roomName).emit('bid-placed', {
          bidId: bid.id,
          auctionId: bid.auction_id,
          userId: bid.user_id,
          bidAmount: bid.bid_amount,
          timestamp: bid.created_at,
          username: socket.user?.username,
        });

        // Send success to the bidder
        socket.emit('bid-success', {
          bidId: bid.id,
          message: 'Bid placed successfully',
        });
      } catch (error: any) {
        logger.error(`Bid placement error: ${error.message}`, { userId });
        socket.emit('bid-error', {
          message: error.message || 'Failed to place bid',
        });
      }
    });

    // Leave auction
    socket.on('leave-auction', (auctionId: string) => {
      const roomName = `auction:${auctionId}`;
      socket.leave(roomName);
      logger.info(`User left auction: ${auctionId}`, { userId, socketId: socket.id });

      if (auctionRooms.has(auctionId)) {
        auctionRooms.get(auctionId)!.delete(userId!);
      }

      // Notify others
      socket.to(roomName).emit('user-left', {
        userId,
        timestamp: new Date(),
        activeUsers: auctionRooms.get(auctionId)?.size || 0,
      });
    });

    // Watch auction
    socket.on('watch-auction', async (auctionId: string) => {
      try {
        // You can add watch functionality here
        logger.info(`User watching auction: ${auctionId}`, { userId });
        socket.emit('watch-success', {
          auctionId,
          message: 'Now watching auction',
        });
      } catch (error) {
        logger.error(`Watch auction error`, error);
        socket.emit('watch-error', {
          message: 'Failed to watch auction',
        });
      }
    });

    // Get auction updates
    socket.on('get-auction-update', async (auctionId: string) => {
      try {
        const auction = await auctionService.getAuctionById(auctionId);
        const bids = await auctionService.getBidsForAuction(auctionId);

        socket.emit('auction-update', {
          auction,
          bids: bids.slice(0, 10), // Send top 10 bids
          activeUsers: auctionRooms.get(auctionId)?.size || 0,
        });
      } catch (error) {
        logger.error(`Auction update error`, error);
        socket.emit('auction-update-error', {
          message: 'Failed to fetch auction updates',
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId}`, { socketId: socket.id });

      // Remove from user sockets
      if (userId) {
        const sockets = userSockets.get(userId);
        if (sockets) {
          const index = sockets.indexOf(socket);
          if (index > -1) {
            sockets.splice(index, 1);
          }
          if (sockets.length === 0) {
            userSockets.delete(userId);
          }
        }
      }

      // Notify all auction rooms this user was in
      auctionRooms.forEach((users, auctionId) => {
        if (users.has(userId!)) {
          users.delete(userId!);
          io.to(`auction:${auctionId}`).emit('user-left', {
            userId,
            timestamp: new Date(),
            activeUsers: users.size,
          });
        }
      });
    });
  });
};

// Broadcast auction status update to all users in that auction
export const broadcastAuctionUpdate = (io: Server, auctionId: string, update: any) => {
  io.to(`auction:${auctionId}`).emit('auction-updated', {
    auctionId,
    ...update,
    timestamp: new Date(),
  });
};

// Get active users count for an auction
export const getActiveUsersCount = (auctionId: string): number => {
  return auctionRooms.get(auctionId)?.size || 0;
};
