import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import auctionReducer from './slices/auctionSlice';
import socketReducer from './slices/socketSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    auction: auctionReducer,
    socket: socketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
