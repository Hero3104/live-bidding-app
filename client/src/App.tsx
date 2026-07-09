import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import AuthInit from './components/AuthInit';

const App: React.FC = () => {
  return (
    <AuthInit>
      <div className="min-h-screen bg-light">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<div className="p-8 text-center">Welcome to Live Bidding App</div>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </AuthInit>
  );
};

export default App;
