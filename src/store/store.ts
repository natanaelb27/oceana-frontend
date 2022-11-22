import { configureStore } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import baseQueryInterceptor from './baseQuery';
import { authApi } from './services/authService';
import { categoryApi } from './services/categoryService';
import { profileApi } from './services/profileService';
import authReducer from './slices/authSlice';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
  tagTypes: [],
});

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      authApi.middleware,
      baseApi.middleware,
      categoryApi.middleware,
      profileApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
