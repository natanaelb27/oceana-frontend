import {
  SealabsPayPaymentRequest,
  SealabsPayRegisterRequest,
} from '../../types/request';
import {
  DeleteSealabsPayResponse,
  GetAllSealabsPayResponse,
  RegisterSealabsPayResponse,
  SealabsPayRedirectResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const sealabsPayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSealabsPay: builder.query<GetAllSealabsPayResponse, void>({
      query: () => ({
        url: '/sealabs-pay',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    registerSealabsPay: builder.mutation<
      RegisterSealabsPayResponse,
      SealabsPayRegisterRequest
    >({
      query: (request) => ({
        url: '/sealabs-pay',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteSealabsPay: builder.mutation<DeleteSealabsPayResponse, string>({
      query: (id) => ({
        url: `/sealabs-pay/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    setDefaultSealabsPay: builder.mutation<void, string>({
      query: (id) => ({
        url: `/sealabs-pay/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Profile'],
    }),
    sealabsPayRegisterOTP: builder.mutation<
      SealabsPayRedirectResponse,
      SealabsPayPaymentRequest
    >({
      query: (request) => ({
        url: '/sealabs-pay/register-otp',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    sealabsPayTopupOTP: builder.mutation<
      SealabsPayRedirectResponse,
      SealabsPayPaymentRequest
    >({
      query: (request) => ({
        url: '/sealabs-pay/topup-otp',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetAllSealabsPayQuery,
  useRegisterSealabsPayMutation,
  useDeleteSealabsPayMutation,
  useSetDefaultSealabsPayMutation,
  useSealabsPayRegisterOTPMutation,
  useSealabsPayTopupOTPMutation,
} = sealabsPayApi;
