import {
  TLoginData,
  TRegisterData,
  forgotPasswordApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (updateUserData: Partial<TRegisterData>) =>
    updateUserApi(updateUserData)
);

export const getUser = createAsyncThunk('user/getUser', async () =>
  getUserApi()
);

export const getUserOrders = createAsyncThunk('user/getUserOrders', async () =>
  getOrdersApi()
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  (_, { dispatch }) => {
    logoutApi().then(() => {
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userLogout());
    });
  }
);

type TUserState = {
  isAuthChecked: boolean;
  userData: TUser | null;
  userOrders: TOrder[] | [];
  error: boolean | null;
  isLoading: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  userData: null,
  userOrders: [],
  error: null,
  isLoading: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetErrorMessage: (state) => {
      state.error = null;
    },
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.userData = null;
    }
  },
  selectors: {
    isErrorSelector: (state) => state.error,
    authCheckedSelector: (state) => state.isAuthChecked,
    getUserDataSelector: (state) => state.userData,
    getUserOrdersSelector: (state) => state.userOrders,
    isLoadingSelector: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = { ...action.payload };
        state.isAuthChecked = true;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = { ...action.payload };
        state.isAuthChecked = true;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userData = { ...action.payload.user };
        state.isAuthChecked = true;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userData = { ...action.payload.user };
        state.error = null;
        state.isLoading = false;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload.orders;
        state.error = null;
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(forgotPassword.fulfilled, resetPassword.fulfilled),
        (state) => {
          state.error = null;
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          loginUser.pending,
          registerUser.pending,
          getUser.pending,
          updateUser.pending,
          getUserOrders.pending,
          forgotPassword.pending,
          resetPassword.pending
        ),
        (state) => {
          state.error = null;
          state.isLoading = true;
        }
      )
      .addMatcher(
        isAnyOf(loginUser.rejected, registerUser.rejected, getUser.rejected),
        (state) => {
          state.error = true;
          state.isAuthChecked = false;
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          updateUser.rejected,
          getUserOrders.rejected,
          forgotPassword.rejected,
          resetPassword.rejected
        ),
        (state) => {
          state.error = true;
          state.isLoading = false;
        }
      );
  }
});

export const userReducer = userSlice.reducer;

export const {
  isErrorSelector,
  authCheckedSelector,
  getUserDataSelector,
  getUserOrdersSelector,
  isLoadingSelector
} = userSlice.selectors;

export const { resetErrorMessage, authChecked, userLogout } = userSlice.actions;
