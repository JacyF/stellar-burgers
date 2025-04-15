import {
  burgersReducer,
  feedsReducer,
  ordersReducer,
  userReducer
} from '@slices';

export const rootReducer = {
  burgers: burgersReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
  user: userReducer
};
