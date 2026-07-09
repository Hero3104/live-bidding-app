import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAuth } from '../store/slices/authSlice';

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Live Bidding
        </Link>
        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/auctions" className="hover:text-primary transition">
                Auctions
              </Link>
              <Link to="/my-bids" className="hover:text-primary transition">
                My Bids
              </Link>
              <div className="flex items-center gap-3">
                <FiUser className="w-5 h-5" />
                <span className="text-sm">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 btn btn-outline text-sm"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline text-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary text-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
