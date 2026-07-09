import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { FiArrowRight, FiUsers, FiTrendingUp, FiClock } from 'react-icons/fi';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Live Bidding Platform</h1>
          <p className="text-xl mb-8 opacity-90">
            Real-time auction platform for 300+ concurrent bidders with instant updates and secure transactions
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/auctions" className="btn bg-white text-primary hover:bg-gray-100">
                View Auctions <FiArrowRight className="inline ml-2" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100">
                  Get Started <FiArrowRight className="inline ml-2" />
                </Link>
                <Link to="/login" className="btn border-2 border-white text-white hover:bg-white/20">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card text-center">
            <FiClock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-Time Updates</h3>
            <p className="text-gray-600">Instant bid notifications and auction status updates via WebSocket</p>
          </div>
          <div className="card text-center">
            <FiUsers className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">300+ Concurrent Users</h3>
            <p className="text-gray-600">Scalable infrastructure built to handle massive concurrent connections</p>
          </div>
          <div className="card text-center">
            <FiTrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Competitive Bidding</h3>
            <p className="text-gray-600">Track live bids from other users and stay ahead of the competition</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 text-primary mx-auto mb-4 text-2xl">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">JWT authentication and encrypted data transfers for complete safety</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white card">
              <div className="text-3xl font-bold text-primary mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up and verify your email to start bidding on live auctions</p>
            </div>
            <div className="bg-white card">
              <div className="text-3xl font-bold text-primary mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Browse Auctions</h3>
              <p className="text-gray-600">Explore active auctions with real-time bid updates and bidder information</p>
            </div>
            <div className="bg-white card">
              <div className="text-3xl font-bold text-primary mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Place Bids</h3>
              <p className="text-gray-600">Bid instantly with live notifications and see results immediately</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Bidding?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of users in real-time auctions</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100">
              Create Account Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
