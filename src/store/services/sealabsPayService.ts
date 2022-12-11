import {
  SealabsPayPaymentRequest,
  SealabsPayRegisterRequest,
} from '../../types/request';
import { SealabsPayRedirectResponse } from '../../types/response';
import { baseApi } from '../store';

export const sealabsPayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sealabsPayRegister: builder.mutation<void, SealabsPayRegisterRequest>({
      query: (request) => ({
        url: '/sealabs-pay/register',
        method: 'POST',
        body: request,
      }),
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
    }),
  }),
});

export const {
  useSealabsPayRegisterMutation,
  useSealabsPayRegisterOTPMutation,
  useSealabsPayTopupOTPMutation,
} = sealabsPayApi;
