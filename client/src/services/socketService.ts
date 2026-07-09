import io, { Socket } from 'socket.io-client';
import { Bid } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.token = token;
      const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
      console.log('Connecting to socket:', socketUrl);
      
      this.socket = io(socketUrl, {
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

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
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
    if (this.socket?.connected) {
      console.log('Joining auction:', auctionId);
      this.socket.emit('join-auction', auctionId);
    } else {
      console.warn('Socket not connected, cannot join auction');
    }
  }

  leaveAuction(auctionId: string): void {
    if (this.socket?.connected) {
      console.log('Leaving auction:', auctionId);
      this.socket.emit('leave-auction', auctionId);
    }
  }

  placeBid(auctionId: string, bidAmount: number): void {
    if (this.socket?.connected) {
      console.log('Placing bid:', { auctionId, bidAmount });
      this.socket.emit('place-bid', { auctionId, bidAmount });
    } else {
      console.warn('Socket not connected, cannot place bid');
    }
  }

  watchAuction(auctionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('watch-auction', auctionId);
    }
  }

  getAuctionUpdate(auctionId: string): void {
    if (this.socket?.connected) {
      console.log('Requesting auction update:', auctionId);
      this.socket.emit('get-auction-update', auctionId);
    }
  }

  onBidPlaced(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('bid-placed', callback);
      if (!this.listeners.has('bid-placed')) {
        this.listeners.set('bid-placed', []);
      }
      this.listeners.get('bid-placed')!.push(callback);
    }
  }

  onBidSuccess(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('bid-success', callback);
      if (!this.listeners.has('bid-success')) {
        this.listeners.set('bid-success', []);
      }
      this.listeners.get('bid-success')!.push(callback);
    }
  }

  onBidError(callback: (error: any) => void): void {
    if (this.socket) {
      this.socket.on('bid-error', callback);
      if (!this.listeners.has('bid-error')) {
        this.listeners.set('bid-error', []);
      }
      this.listeners.get('bid-error')!.push(callback);
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
      this.socket.on('auction-update', (data) => {
        console.log('Auction update received:', data);
        callback(data);
      });
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
