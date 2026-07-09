import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAuctions, setLoading, setError } from '../store/slices/auctionSlice';
import { auctionAPI } from '../services/authService';
import AuctionCard from '../components/AuctionCard';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { FiFilter } from 'react-icons/fi';

const AuctionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { auctions, loading, error } = useAppSelector((state) => state.auction);
  const [status, setStatus] = useState<string>('active');
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 12;

  useEffect(() => {
    fetchAuctions();
  }, [status, currentPage]);

  const fetchAuctions = async () => {
    dispatch(setLoading(true));
    try {
      const response = await auctionAPI.getAll(status || undefined, limit, currentPage * limit);
      dispatch(setAuctions(response));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch auctions'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Live Auctions</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <FiFilter className="w-5 h-5 text-gray-600" />
          <div className="flex gap-2">
            {['active', 'pending', 'ended'].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s === 'all' ? '' : s);
                  setCurrentPage(0);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  status === (s === 'all' ? '' : s)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <Error message={error} onRetry={fetchAuctions} />}

      {loading ? (
        <Loading message="Fetching auctions..." />
      ) : auctions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No auctions found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
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

export default AuctionsPage;
