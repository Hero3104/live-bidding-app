import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentAuction, setBids, setLoading, addBid } from '../store/slices/auctionSlice';
import { auctionAPI } from '../services/authService';
import socketService from '../services/socketService';
import BidItem from '../components/BidItem';
import Loading from '../components/Loading';
import { formatDistanceToNow } from 'date-fns';
import { FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentAuction, bids, loading } = useAppSelector((state) => state.auction);
  const { activeUsers } = useAppSelector((state) => state.socket);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [bidAmount, setBidAmount] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAuction();
      socketService.joinAuction(id);

      socketService.onBidPlaced((data) => {
        dispatch(addBid(data));
        if (data.username) {
          toast.success(`${data.username} placed a bid: $${data.bidAmount}`);
        }
      });

      socketService.getAuctionUpdate(id);

      return () => {
        socketService.leaveAuction(id);
      };
    }
  }, [id, dispatch]);

  const fetchAuction = async () => {
    if (!id) return;
    dispatch(setLoading(true));
    try {
      const response = await auctionAPI.getById(id);
      dispatch(setCurrentAuction(response.data));
      const bidsResponse = await auctionAPI.getBids(id);
      dispatch(setBids(bidsResponse.data));
    } catch (error) {
      toast.error('Failed to fetch auction details');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePlaceBid = () => {
    if (!bidAmount || !currentAuction) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to place a bid');
      return;
    }

    setPlacing(true);
    socketService.placeBid(currentAuction.id, parseFloat(bidAmount));
    setBidAmount('');
    setPlacing(false);
  };

  if (loading || !currentAuction) {
    return <Loading message="Loading auction details..." />;
  }

  const minBid = currentAuction.current_highest_bid
    ? currentAuction.current_highest_bid + 1
    : currentAuction.starting_price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Auction Details */}
        <div className="lg:col-span-2">
          {currentAuction.image_url && (
            <img
              src={currentAuction.image_url}
              alt={currentAuction.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-4xl font-bold mb-2">{currentAuction.title}</h1>
          <p className="text-gray-600 mb-6">{currentAuction.description}</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Starting Price</p>
                <p className="text-2xl font-bold">${currentAuction.starting_price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Current Highest Bid</p>
                <p className="text-2xl font-bold text-primary">
                  ${(currentAuction.current_highest_bid || currentAuction.starting_price).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Bids</p>
                <p className="text-2xl font-bold">{currentAuction.total_bids}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  <FiUsers /> {activeUsers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Bidding & Bids */}
        <div>
          {/* Bidding Form */}
          {isAuthenticated && currentAuction.status === 'active' && (
            <div className="card mb-8 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Place Your Bid</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Minimum Bid Amount</p>
                  <p className="text-2xl font-bold text-primary">${minBid.toFixed(2)}</p>
                </div>
                <input
                  type="number"
                  min={minBid}
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: $${minBid.toFixed(2)}`}
                  className="input"
                />
                <button
                  onClick={handlePlaceBid}
                  disabled={placing || !bidAmount}
                  className="btn btn-primary w-full"
                >
                  {placing ? 'Placing...' : 'Place Bid'}
                </button>
              </div>
            </div>
          )}

          {/* Recent Bids */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Recent Bids</h3>
            <div className="space-y-2">
              {bids.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-4">No bids yet</p>
              ) : (
                bids.slice(0, 10).map((bid) => <BidItem key={bid.id} bid={bid} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
