import { configureStore } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import baseQueryInterceptor from './baseQuery';

import { authApi } from './services/authService';
import authReducer from './slices/authSlice';
import sellerSidebarReducer from './slices/sellerSidebarSlice';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
  tagTypes: ['Category', 'MyShop', 'Product', 'Profile'],
});

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    sellerSidebar: sellerSidebarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([authApi.middleware, baseApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
