export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
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
  start_time: Date;
  end_time: Date;
  total_bids: number;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Bid {
  id: string;
  auction_id: string;
  user_id: string;
  bid_amount: number;
  created_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  related_auction_id?: string;
  is_read: boolean;
  created_at: Date;
}
