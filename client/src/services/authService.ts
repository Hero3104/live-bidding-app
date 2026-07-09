import api from './api';
import { User } from '../types';

export const authAPI = {
  register: async (email: string, username: string, password: string, firstName?: string, lastName?: string) => {
    const { data } = await api.post('/auth/register', {
      email,
      username,
      password,
      first_name: firstName,
      last_name: lastName,
    });
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (firstName?: string, lastName?: string) => {
    const { data } = await api.put('/users/profile', {
      first_name: firstName,
      last_name: lastName,
    });
    return data;
  },

  getUser: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },
};

export const auctionAPI = {
  getAll: async (status?: string, limit = 50, offset = 0) => {
    const { data } = await api.get('/auctions', {
      params: { status, limit, offset },
    });
    return data;
  },

  getById: async (auctionId: string) => {
    const { data } = await api.get(`/auctions/${auctionId}`);
    return data;
  },

  getBids: async (auctionId: string) => {
    const { data } = await api.get(`/auctions/${auctionId}/bids`);
    return data;
  },

  create: async (title: string, description: string, startingPrice: number, startTime: string, endTime: string, category?: string, imageUrl?: string) => {
    const { data } = await api.post('/auctions', {
      title,
      description,
      starting_price: startingPrice,
      start_time: startTime,
      end_time: endTime,
      category,
      image_url: imageUrl,
    });
    return data;
  },

  updateStatus: async (auctionId: string, status: string) => {
    const { data } = await api.put(`/auctions/${auctionId}/status`, { status });
    return data;
  },

  getWatched: async () => {
    const { data } = await api.get('/auctions/watched');
    return data;
  },
};

export const bidAPI = {
  place: async (auctionId: string, bidAmount: number) => {
    const { data } = await api.post('/bids', {
      auction_id: auctionId,
      bid_amount: bidAmount,
    });
    return data;
  },

  getUserBids: async (limit = 50, offset = 0) => {
    const { data } = await api.get('/bids/user/history', {
      params: { limit, offset },
    });
    return data;
  },
};
