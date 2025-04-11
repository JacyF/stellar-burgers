import { getIngredientsApi } from '@api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export type TConstructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: Array<TConstructorIngredient> | [];
};

export type TConstructorItemsState = {
  loading: boolean;
  error: string | null | undefined;
  constructorItems: TConstructorItems;
};

export const initialState: TConstructorItemsState = {
  loading: true,
  error: null,
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const constructorItemsSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    addConstructorItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.constructorItems.bun = {
            ...state.constructorItems.bun,
            ...ingredient
          };
        } else {
          state.constructorItems.ingredients = [
            ...state.constructorItems.ingredients,
            ingredient
          ];
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },
    removeConstructorItem: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    moveUpConstructorItem: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredient = action.payload;
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === ingredient.id
      );
      state.constructorItems.ingredients.splice(index, 1);
      state.constructorItems.ingredients.splice(index - 1, 0, ingredient);
    },
    moveDownConstructorItem: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredient = action.payload;
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === ingredient.id
      );
      state.constructorItems.ingredients.splice(index, 1);
      state.constructorItems.ingredients.splice(index + 1, 0, ingredient);
    },
    resetConstructorItems: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  },
  selectors: {
    getLoadingSelector: (state) => state.loading,
    getConstructorItemsSelector: (state) => state.constructorItems
  }
});

export const constructorItemsReducer = constructorItemsSlice.reducer;

export const { getLoadingSelector, getConstructorItemsSelector } =
  constructorItemsSlice.selectors;

export const {
  addConstructorItem,
  removeConstructorItem,
  moveUpConstructorItem,
  moveDownConstructorItem,
  resetConstructorItems
} = constructorItemsSlice.actions;
