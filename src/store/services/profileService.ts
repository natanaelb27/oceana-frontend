import { UpdateProfileRequest } from '../../types/request';
import {
  GetProfileResponse,
  UpdateProfileResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<GetProfileResponse, void>({
      query: (request) => ({
        url: '/profile',
        method: 'GET',
        body: request,
      }),
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (request) => ({
        url: '/profile',
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfileImage: builder.mutation<UpdateProfileResponse, FormData>({
      query: (request) => ({
        url: '/profile',
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfileImageMutation,
} = profileApi;
