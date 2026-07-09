export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  category?: string;
  starting_price: number;
  current_highest_bid?: number;
  current_highest_bidder_id?: string;
  status: 'pending' | 'active' | 'ended' | 'cancelled';
  created_by: string;
  start_time: string;
  end_time: string;
  total_bids: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  user_id: string;
  bid_amount: number;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuctionState {
  auctions: Auction[];
  currentAuction: Auction | null;
  bids: Bid[];
  loading: boolean;
  error: string | null;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface SocketState {
  connected: boolean;
  activeUsers: number;
  latestBid: Bid | null;
  error: string | null;
}
