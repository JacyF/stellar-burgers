import { getIngredientsApi } from '@api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export type TConstructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: Array<TConstructorIngredient> | [];
};

type TBurgersState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | null | undefined;
  constructorItems: TConstructorItems;
};

const initialState: TBurgersState = {
  ingredients: [],
  loading: true,
  error: null,
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const getBurgerIngredients = createAsyncThunk(
  'burgers/getAllIngredients',
  async () => getIngredientsApi()
);

const burgersSlice = createSlice({
  name: 'burgers',
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
    getBurgersState: (state) => state,
    getIngredientsSelector: (state) => state.ingredients,
    getLoadingSelector: (state) => state.loading,
    getConstructorItemsSelector: (state) => state.constructorItems
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBurgerIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBurgerIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getBurgerIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export const burgersReducer = burgersSlice.reducer;

export const {
  getBurgersState,
  getIngredientsSelector,
  getLoadingSelector,
  getConstructorItemsSelector
} = burgersSlice.selectors;

export const {
  addConstructorItem,
  removeConstructorItem,
  moveUpConstructorItem,
  moveDownConstructorItem,
  resetConstructorItems
} = burgersSlice.actions;
