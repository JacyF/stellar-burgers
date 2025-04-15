import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedsState = {
  error: string | null | undefined;
  feeds: {
    orders: TOrder[] | [];
    total: number;
    totalToday: number;
  };
  orderByNumber: TOrder[] | [];
};

const initialState: TFeedsState = {
  error: null,
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  orderByNumber: []
};

export const getAllFeeds = createAsyncThunk('feeds/getAllFeeds', async () =>
  getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'feeds/getOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    getAllOrdersSelector: (state) => state.feeds.orders,
    getFeedsSelector: (state) => state.feeds,
    getOrderSelector: (state) => state.orderByNumber[0]
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeeds.pending, (state) => {
        state.error = null;
      })
      .addCase(getAllFeeds.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllFeeds.fulfilled, (state, action) => {
        state.error = null;
        state.feeds = { ...action.payload };
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.error = null;
        state.orderByNumber = action.payload.orders;
      });
  }
});

export const feedsReducer = feedsSlice.reducer;

export const { getAllOrdersSelector, getFeedsSelector, getOrderSelector } =
  feedsSlice.selectors;
