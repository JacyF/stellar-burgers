import {
  TIngredientsState,
  getBurgerIngredients,
  ingredientsReducer
} from '@slices';
import { TIngredient } from '@utils-types';

describe('Тестирование редьюсера слайса ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    loading: true,
    error: null
  };

  it('проверка статуса "pending"', async () => {
    const requestAction = { type: getBurgerIngredients.pending.type };
    const state = ingredientsReducer(initialState, requestAction);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('проверка статуса "fulfilled"', async () => {
    const ingredients: Array<TIngredient> = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }
    ];
    const successAction = {
      type: getBurgerIngredients.fulfilled.type,
      payload: ingredients
    };
    const state = ingredientsReducer(initialState, successAction);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: null,
      ingredients: ingredients
    });
  });

  it('проверка статуса "rejected"', async () => {
    const error = { message: 'Ошибка загрузки ингредиентов' };
    const failedAction = {
      type: getBurgerIngredients.rejected.type,
      error: error
    };
    const state = ingredientsReducer(initialState, failedAction);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: error.message
    });
  });
});
