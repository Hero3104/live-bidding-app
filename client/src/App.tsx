import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import Header from './components/Header';
import AuthInit from './components/AuthInit';
import socketService from './services/socketService';
import { setConnected } from './store/slices/socketSlice';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuctionsPage from './pages/AuctionsPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import MyBidsPage from './pages/MyBidsPage';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token).catch((error) => {
        console.error('Failed to connect socket:', error);
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  return (
    <AuthInit>
      <div className="min-h-screen bg-light">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/auctions" element={<AuctionsPage />} />
            <Route path="/auction/:id" element={<AuctionDetailPage />} />
            <Route path="/my-bids" element={isAuthenticated ? <MyBidsPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </AuthInit>
  );
};

export default App;
