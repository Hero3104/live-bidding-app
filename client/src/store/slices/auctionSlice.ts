import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuctionState, Auction, Bid } from '../../types';

const initialState: AuctionState = {
  auctions: [],
  currentAuction: null,
  bids: [],
  loading: false,
  error: null,
  pagination: {
    limit: 50,
    offset: 0,
    total: 0,
  },
};

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAuctions: (state, action: PayloadAction<{ auctions: Auction[]; total: number }>) => {
      state.auctions = action.payload.auctions;
      state.pagination.total = action.payload.total;
    },
    setCurrentAuction: (state, action: PayloadAction<Auction | null>) => {
      state.currentAuction = action.payload;
    },
    setBids: (state, action: PayloadAction<Bid[]>) => {
      state.bids = action.payload;
    },
    addBid: (state, action: PayloadAction<Bid>) => {
      state.bids = [action.payload, ...state.bids];
      if (state.currentAuction && state.currentAuction.id === action.payload.auction_id) {
        state.currentAuction.current_highest_bid = action.payload.bid_amount;
      }
    },
    setPagination: (state, action: PayloadAction<{ limit: number; offset: number }>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

export const { setLoading, setError, setAuctions, setCurrentAuction, setBids, addBid, setPagination } = auctionSlice.actions;
export default auctionSlice.reducer;
