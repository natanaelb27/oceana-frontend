import {
  PaymentSealabsPayRequest,
  RegisterSealabsPayRequest,
} from '../../types/request';
import {
  DeleteSealabsPayResponse,
  GetAllSealabsPayResponse,
  RegisterSealabsPayResponse,
  RedirectSealabsPayResponse,
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
      RegisterSealabsPayRequest
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
      RedirectSealabsPayResponse,
      PaymentSealabsPayRequest
    >({
      query: (request) => ({
        url: '/sealabs-pay/register-otp',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    sealabsPayTopupOTP: builder.mutation<
      RedirectSealabsPayResponse,
      PaymentSealabsPayRequest
    >({
      query: (request) => ({
        url: '/sealabs-pay/topup-otp',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Profile'],
    }),
    sealabsPayPaymentOTP: builder.mutation<
      RedirectSealabsPayResponse,
      PaymentSealabsPayRequest
    >({
      query: (request) => ({
        url: '/sealabs-pay/payment-otp',
        method: 'POST',
        body: request,
      }),
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
  useSealabsPayPaymentOTPMutation,
} = sealabsPayApi;
