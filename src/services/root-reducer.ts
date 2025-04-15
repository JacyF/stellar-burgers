import {
  constructorItemsReducer,
  feedsReducer,
  ingredientsReducer,
  ordersReducer,
  userReducer
} from '@slices';

export const rootReducer = {
  ingredients: ingredientsReducer,
  constructorItems: constructorItemsReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
  user: userReducer
};
