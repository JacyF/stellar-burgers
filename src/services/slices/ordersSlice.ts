import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { TConstructorItems } from './constructorItemsSlice';

type TOrdersState = {
  error: string | null | undefined;
  orderResponse: {
    order: TOrder | null;
  };
  orderRequest: boolean;
};

const initialState: TOrdersState = {
  error: null,
  orderResponse: {
    order: null
  },
  orderRequest: false
};

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (items: TConstructorItems) => {
    let orderData: string[] = [];
    if (items.bun && items.ingredients.length > 0) {
      orderData.push(items.bun._id);
      orderData.push(items.bun._id);
      items.ingredients.forEach((item) => orderData.push(item._id));
    }
    return orderBurgerApi(orderData!);
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderResponse: (state) => {
      state.orderResponse.order = null;
    }
  },
  selectors: {
    getOrderResponseSelector: (state) => state.orderResponse.order,
    getOrderRequestSelector: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.error = action.error.message;
        state.orderRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderResponse.order = action.payload.order;
      });
  }
});

export const ordersReducer = ordersSlice.reducer;

export const { getOrderResponseSelector, getOrderRequestSelector } =
  ordersSlice.selectors;

export const { resetOrderResponse } = ordersSlice.actions;
