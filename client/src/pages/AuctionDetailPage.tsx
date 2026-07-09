import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentAuction, setBids, setLoading, addBid } from '../store/slices/auctionSlice';
import { setActiveUsers } from '../store/slices/socketSlice';
import { auctionAPI, bidAPI } from '../services/authService';
import socketService from '../services/socketService';
import BidItem from '../components/BidItem';
import Loading from '../components/Loading';
import { formatDistanceToNow } from 'date-fns';
import { FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentAuction, bids, loading } = useAppSelector((state) => state.auction);
  const { activeUsers } = useAppSelector((state) => state.socket);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [bidAmount, setBidAmount] = useState('');
  const [placing, setPlacing] = useState(false);
  const socketConnected = useRef(false);

  useEffect(() => {
    if (id) {
      fetchAuction();
    }
  }, [id]);

  useEffect(() => {
    if (id && socketService.isConnected()) {
      setupSocketListeners();
    }
  }, [id]);

  const fetchAuction = async () => {
    if (!id) return;
    dispatch(setLoading(true));
    try {
      const response = await auctionAPI.getById(id);
      dispatch(setCurrentAuction(response.data));
      const bidsResponse = await auctionAPI.getBids(id);
      dispatch(setBids(bidsResponse.data));

      // Join auction after data is loaded
      setTimeout(() => {
        socketService.joinAuction(id);
        socketService.getAuctionUpdate(id);
      }, 500);
    } catch (error: any) {
      console.error('Failed to fetch auction:', error);
      toast.error('Failed to fetch auction details');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const setupSocketListeners = () => {
    if (socketConnected.current) return;
    socketConnected.current = true;

    socketService.onBidPlaced((data: any) => {
      console.log('Bid placed event received:', data);
      dispatch(addBid(data));
      if (data.username) {
        toast.success(`${data.username} placed a bid: $${data.bidAmount.toFixed(2)}`);
      }
    });

    socketService.onBidSuccess((data: any) => {
      console.log('Your bid was successful:', data);
      toast.success('Your bid was placed successfully!');
    });

    socketService.onBidError((error: any) => {
      console.error('Bid error:', error);
      toast.error(error.message || 'Failed to place bid');
      setPlacing(false);
    });

    socketService.onUserJoined((data: any) => {
      console.log('User joined:', data);
      dispatch(setActiveUsers(data.activeUsers || 0));
    });

    socketService.onUserLeft((data: any) => {
      console.log('User left:', data);
      dispatch(setActiveUsers(data.activeUsers || 0));
    });

    socketService.onAuctionUpdate((data: any) => {
      console.log('Auction update:', data);
      if (data.auction) {
        dispatch(setCurrentAuction(data.auction));
        if (data.activeUsers !== undefined) {
          dispatch(setActiveUsers(data.activeUsers));
        }
      }
    });
  };

  const handlePlaceBid = async () => {
    if (!bidAmount || !currentAuction) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to place a bid');
      navigate('/login');
      return;
    }

    const amount = parseFloat(bidAmount);
    const minBid = currentAuction.current_highest_bid
      ? currentAuction.current_highest_bid + 1
      : currentAuction.starting_price;

    if (amount < minBid) {
      toast.error(`Minimum bid amount is $${minBid.toFixed(2)}`);
      return;
    }

    setPlacing(true);
    console.log('Attempting to place bid:', { auctionId: currentAuction.id, bidAmount: amount });

    try {
      // Emit bid via socket
      socketService.placeBid(currentAuction.id, amount);
      
      // Also try REST API as backup
      try {
        await bidAPI.place(currentAuction.id, amount);
        console.log('Bid placed via REST API');
      } catch (apiError) {
        console.log('REST API bid failed, relying on WebSocket');
      }

      setBidAmount('');
      // Don't reset placing state immediately - let the socket response do it
      setTimeout(() => setPlacing(false), 1000);
    } catch (error: any) {
      console.error('Error placing bid:', error);
      toast.error(error.message || 'Failed to place bid');
      setPlacing(false);
    }
  };

  if (loading || !currentAuction) {
    return <Loading message="Loading auction details..." />;
  }

  const minBid = currentAuction.current_highest_bid
    ? currentAuction.current_highest_bid + 1
    : currentAuction.starting_price;

  const timeLeft = new Date(currentAuction.end_time).getTime() - new Date().getTime();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Starting Price</p>
                <p className="text-2xl font-bold">${currentAuction.starting_price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Current Bid</p>
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900">
              <strong>Auction Status:</strong> {currentAuction.status.toUpperCase()}
              {currentAuction.status === 'active' && (
                <span className="ml-4 text-red-600 font-bold">
                  Time left: {hoursLeft}h {minutesLeft}m {secondsLeft}s
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Column - Bidding & Bids */}
        <div>
          {/* Bidding Form */}
          {isAuthenticated && currentAuction.status === 'active' ? (
            <div className="card mb-8 sticky top-8 border-2 border-green-500 bg-green-50">
              <h3 className="text-lg font-bold mb-4 text-green-900">Place Your Bid</h3>
              <div className="space-y-4">
                <div className="bg-white rounded p-3">
                  <p className="text-sm text-gray-600 mb-1">Minimum Bid Amount</p>
                  <p className="text-2xl font-bold text-primary">${minBid.toFixed(2)}</p>
                </div>
                <div>
                  <input
                    type="number"
                    min={minBid}
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min: $${minBid.toFixed(2)}`}
                    className="input border-2 border-green-500"
                  />
                </div>
                <button
                  onClick={handlePlaceBid}
                  disabled={placing || !bidAmount}
                  className="btn btn-primary w-full font-bold text-lg py-3"
                >
                  {placing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Placing Bid...
                    </span>
                  ) : (
                    '🔴 PLACE BID LIVE'
                  )}
                </button>
                <p className="text-xs text-gray-600 text-center">
                  {socketService.isConnected() ? (
                    <span className="text-green-600">✅ Live connection active</span>
                  ) : (
                    <span className="text-red-600">❌ Reconnecting...</span>
                  )}
                </p>
              </div>
            </div>
          ) : currentAuction.status !== 'active' ? (
            <div className="card mb-8 bg-gray-100 border-2 border-gray-400">
              <p className="text-center text-gray-700 font-bold">
                This auction is {currentAuction.status}
              </p>
            </div>
          ) : (
            <div className="card mb-8 bg-yellow-50 border-2 border-yellow-400">
              <p className="text-center text-yellow-900">
                <a href="/login" className="text-blue-600 hover:underline font-bold">
                  Login to place bids
                </a>
              </p>
            </div>
          )}

          {/* Recent Bids */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Recent Bids ({bids.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {bids.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-4">No bids yet</p>
              ) : (
                bids.slice(0, 15).map((bid) => <BidItem key={bid.id} bid={bid} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
