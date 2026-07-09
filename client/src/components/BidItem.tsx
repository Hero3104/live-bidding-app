import React, { FC } from 'react';
import { format } from 'date-fns';
import { Bid } from '../types';

interface BidItemProps {
  bid: Bid;
  username?: string;
}

const BidItem: FC<BidItemProps> = ({ bid, username }) => {
  return (
    <div className="flex justify-between items-center py-3 border-b last:border-b-0">
      <div>
        <p className="text-sm font-semibold">{username || `User ${bid.user_id.slice(0, 8)}`}</p>
        <p className="text-xs text-gray-500">{format(new Date(bid.created_at), 'MMM dd, yyyy HH:mm')}</p>
      </div>
      <div className="text-lg font-bold text-primary">${bid.bid_amount.toFixed(2)}</div>
    </div>
  );
};

export default BidItem;
