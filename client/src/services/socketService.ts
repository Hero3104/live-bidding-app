import io, { Socket } from 'socket.io-client';
import { Bid } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.token = token;
      this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        reject(error);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAuction(auctionId: string): void {
    if (this.socket) {
      this.socket.emit('join-auction', auctionId);
    }
  }

  leaveAuction(auctionId: string): void {
    if (this.socket) {
      this.socket.emit('leave-auction', auctionId);
    }
  }

  placeBid(auctionId: string, bidAmount: number): void {
    if (this.socket) {
      this.socket.emit('place-bid', { auctionId, bidAmount });
    }
  }

  watchAuction(auctionId: string): void {
    if (this.socket) {
      this.socket.emit('watch-auction', auctionId);
    }
  }

  getAuctionUpdate(auctionId: string): void {
    if (this.socket) {
      this.socket.emit('get-auction-update', auctionId);
    }
  }

  onBidPlaced(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('bid-placed', callback);
    }
  }

  onBidError(callback: (error: any) => void): void {
    if (this.socket) {
      this.socket.on('bid-error', callback);
    }
  }

  onUserJoined(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  onAuctionUpdated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('auction-updated', callback);
    }
  }

  onAuctionUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('auction-update', callback);
    }
  }

  offBidPlaced(): void {
    if (this.socket) {
      this.socket.off('bid-placed');
    }
  }

  offBidError(): void {
    if (this.socket) {
      this.socket.off('bid-error');
    }
  }

  isConnected(): boolean {
    return this.socket ? this.socket.connected : false;
  }
}

export default new SocketService();
