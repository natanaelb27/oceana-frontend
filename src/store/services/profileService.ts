import {
  CheckPasswordVerificationCodeRequest,
  DeleteBatchFavoriteProducts,
  UpdateProfileEmailRequest,
  UpdateProfilePasswordRequest,
  UpdateProfileRequest,
  UpdateProfileUsernameRequest,
} from '../../types/request';
import {
  CheckPasswordVerificationCodeResponse,
  GetAllProductsResponse,
  GetAllRefundDetailsResponse,
  GetProfileResponse,
  RequestPasswordVerificationCodeResponse,
  UpdateOrderStatusResponse,
  UpdateProfilePasswordResponse,
  UpdateProfileResponse,
  GetProductSnapshotResponse,
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
    updateProfileEmail: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileEmailRequest
    >({
      query: (request) => ({
        url: '/profile/email',
        method: 'PATCH',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfileUsername: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileUsernameRequest
    >({
      query: (request) => ({
        url: '/profile/username',
        method: 'PATCH',
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
    updateProfilePassword: builder.mutation<
      UpdateProfilePasswordResponse,
      UpdateProfilePasswordRequest
    >({
      query: (request) => ({
        url: '/profile/password',
        method: 'PATCH',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    requestVerificationCode: builder.mutation<
      RequestPasswordVerificationCodeResponse,
      void
    >({
      query: () => ({
        url: '/profile/password/request-verification-code',
        method: 'POST',
      }),
      invalidatesTags: ['Profile'],
    }),
    checkVerificationCode: builder.mutation<
      CheckPasswordVerificationCodeResponse,
      CheckPasswordVerificationCodeRequest
    >({
      query: (request) => ({
        url: '/profile/password/check-verification-code',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/profile/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Profile'],
    }),
    updateCompleteOrder: builder.mutation<UpdateOrderStatusResponse, string>({
      query: (id) => ({
        url: `/profile/orders/${id}/complete-order`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Order'],
    }),
    getAllProfileRefunds: builder.query<GetAllRefundDetailsResponse, string>({
      query: (query) => ({
        url: `/profile/refunds?${query}`,
        method: 'GET',
      }),
      providesTags: ['Refund'],
    }),
    getAllUserFavoriteProducts: builder.query<GetAllProductsResponse, string>({
      query: (query) => ({
        url: `/profile/favorites?${query}`,
        method: 'GET',
      }),
      providesTags: ['Product', 'FavoriteProduct'],
    }),
    deleteBatchFavoriteProducts: builder.mutation<
      void,
      DeleteBatchFavoriteProducts
    >({
      query: (request) => ({
        url: '/profile/favorites/batch-delete',
        method: 'DELETE',
        body: request,
      }),
      invalidatesTags: ['Product', 'FavoriteProduct'],
    }),
    getProductSnapshot: builder.query<GetProductSnapshotResponse, string>({
      query: (id) => ({
        url: `/profile/product-snapshot/${id}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfileEmailMutation,
  useUpdateProfileUsernameMutation,
  useUpdateProfileImageMutation,
  useUpdateProfilePasswordMutation,
  useRequestVerificationCodeMutation,
  useCheckVerificationCodeMutation,
  useLogoutMutation,
  useUpdateCompleteOrderMutation,
  useGetAllProfileRefundsQuery,
  useLazyGetAllProfileRefundsQuery,
  useGetAllUserFavoriteProductsQuery,
  useLazyGetAllUserFavoriteProductsQuery,
  useDeleteBatchFavoriteProductsMutation,
  useGetProductSnapshotQuery,
  useLazyGetProductSnapshotQuery,
} = profileApi;
