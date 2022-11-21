import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetProfileResponse } from '../../types/response';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<GetProfileResponse, void>({
      query: (request) => ({
        url: '/profile',
        method: 'GET',
        body: request,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useLazyGetProfileQuery } = profileApi;
