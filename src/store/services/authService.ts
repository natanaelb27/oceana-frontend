import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest } from '../../types/request';
import { LoginResponse } from '../../types/response';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (request) => ({
        url: '/auth/login',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
