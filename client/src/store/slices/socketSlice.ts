import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocketState, Bid } from '../../types';

const initialState: SocketState = {
  connected: false,
  activeUsers: 0,
  latestBid: null,
  error: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.activeUsers = action.payload;
    },
    setLatestBid: (state, action: PayloadAction<Bid | null>) => {
      state.latestBid = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setConnected, setActiveUsers, setLatestBid, setError } = socketSlice.actions;
export default socketSlice.reducer;
