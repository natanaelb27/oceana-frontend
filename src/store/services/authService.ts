import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  LoginRequest,
  LoginWithGoogleRequest,
  RegisterRequest,
  RegisterWithGoogleRequest,
} from '../../types/request';
import { LoginResponse, RegisterResponse } from '../../types/response';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (request) => ({
        url: '/auth/login',
        method: 'POST',
        body: request,
      }),
    }),
    loginWithGoogle: builder.mutation<LoginResponse, LoginWithGoogleRequest>({
      query: (request) => ({
        url: '/auth/login-google',
        method: 'POST',
        body: request,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (request) => ({
        url: '/auth/register',
        method: 'POST',
        body: request,
      }),
    }),
    registerWithGoogle: builder.mutation<
      RegisterResponse,
      RegisterWithGoogleRequest
    >({
      query: (request) => ({
        url: '/auth/register-google',
        method: 'POST',
        body: request,
      }),
    }),
    refreshAccessToken: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useRegisterMutation,
  useRegisterWithGoogleMutation,
  useRefreshAccessTokenMutation,
} = authApi;
