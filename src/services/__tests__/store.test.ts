import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  constructorItemsReducer,
  feedsReducer,
  ingredientsReducer,
  ordersReducer,
  userReducer
} from '@slices';

it('Тестирование корневого редьюсера', () => {
  const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    constructorItems: constructorItemsReducer,
    feeds: feedsReducer,
    orders: ordersReducer,
    user: userReducer
  });

  const store = configureStore({
    reducer: rootReducer
  });

  expect(store.getState()).toEqual(
    rootReducer(undefined, { type: 'UNKNOWN_ACTION' })
  );
});
