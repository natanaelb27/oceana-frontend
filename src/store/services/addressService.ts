import {
  CreateAddressRequest,
  UpdateAddressRequest,
} from '../../types/request';
import {
  CreateAddressResponse,
  DeleteAddressResponse,
  GetAddressesResponse,
  GetAddressResponse,
  UpdateAddressResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<GetAddressesResponse, void>({
      query: () => ({
        url: '/profile/addresses',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    getAddress: builder.query<GetAddressResponse, string>({
      query: (id) => ({
        url: `/profile/addresses/${id}`,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    createAddress: builder.mutation<
      CreateAddressResponse,
      CreateAddressRequest
    >({
      query: (request) => ({
        url: '/profile/addresses',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateAddress: builder.mutation<
      UpdateAddressResponse,
      { id: string; request: UpdateAddressRequest }
    >({
      query: ({ id, request }) => ({
        url: `/profile/addresses/${id}`,
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteAddress: builder.mutation<DeleteAddressResponse, string>({
      query: (id) => ({
        url: `/profile/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    setAddressDefault: builder.mutation<UpdateAddressResponse, string>({
      query: (id) => ({
        url: `/profile/addresses/${id}/default`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useLazyGetAddressesQuery,
  useGetAddressQuery,
  useLazyGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetAddressDefaultMutation,
} = addressApi;
