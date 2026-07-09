import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setBids, setLoading } from '../store/slices/auctionSlice';
import { bidAPI } from '../services/authService';
import BidItem from '../components/BidItem';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const MyBidsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bids, loading } = useAppSelector((state) => state.auction);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchUserBids();
  }, [currentPage]);

  const fetchUserBids = async () => {
    dispatch(setLoading(true));
    try {
      const response = await bidAPI.getUserBids(limit, currentPage * limit);
      dispatch(setBids(response.data));
    } catch (error) {
      toast.error('Failed to fetch your bids');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Bids</h1>

      {loading ? (
        <Loading message="Loading your bids..." />
      ) : bids.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">You haven't placed any bids yet</p>
        </div>
      ) : (
        <>
          <div className="card">
            {bids.map((bid) => (
              <BidItem key={bid.id} bid={bid} />
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="btn btn-outline disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4">
              Page {currentPage + 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyBidsPage;
