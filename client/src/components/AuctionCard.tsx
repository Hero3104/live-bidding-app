import React, { FC } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Auction } from '../types';

interface AuctionCardProps {
  auction: Auction;
}

const AuctionCard: FC<AuctionCardProps> = ({ auction }) => {
  const timeLeft = new Date(auction.end_time).getTime() - new Date().getTime();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <Link to={`/auction/${auction.id}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        {auction.image_url && (
          <img
            src={auction.image_url}
            alt={auction.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <h3 className="text-lg font-bold mb-2 truncate">{auction.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{auction.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Starting Price:</span>
            <span className="font-semibold">${auction.starting_price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Bid:</span>
            <span className="font-semibold text-primary">
              ${auction.current_highest_bid?.toFixed(2) || auction.starting_price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Bids:</span>
            <span className="font-semibold">{auction.total_bids}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            auction.status === 'active'
              ? 'bg-green-100 text-green-800'
              : auction.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {auction.status.toUpperCase()}
          </span>
          {auction.status === 'active' && (
            <span className="text-xs text-red-600 font-semibold">
              {hoursLeft}h {minutesLeft}m left
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
