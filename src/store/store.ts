import { configureStore } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { TAG_TYPES } from '../constants/tags';
import baseQueryInterceptor from './baseQuery';

import storageSession from 'redux-persist/lib/storage/session';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import { authApi } from './services/authService';
import authReducer from './slices/authSlice';
import checkoutReducer from './slices/checkoutSlice';
import registerGoogleReducer from './slices/registerGoogleSlice';
import sealabsPayReducer from './slices/sealabsPaySlice';
import sellerSidebarReducer from './slices/sellerSidebarSlice';
import chatReducer from './slices/chatSlice';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
  tagTypes: TAG_TYPES,
});

const reducers = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  checkout: checkoutReducer,
  registerGoogle: registerGoogleReducer,
  sealabsPay: sealabsPayReducer,
  sellerSidebar: sellerSidebarReducer,
  chat: chatReducer,
});

const persistConfig = {
  key: 'root',
  storage: storageSession,
  blacklist: [
    'authApi',
    'baseApi',
    'auth',
    'registerGoogle',
    'sealabsPay',
    'sellerSidebar',
  ],
  whitelist: ['checkout'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([authApi.middleware, baseApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
