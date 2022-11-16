import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (request) => ({
        url: '/login',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
