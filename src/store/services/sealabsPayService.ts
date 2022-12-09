import { SealabsPayPaymentRequest } from '../../types/request';
import { SealabsPayRedirectResponse } from '../../types/response';
import { baseApi } from '../store';

export const sealabsPayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sealabsPayPayment: builder.mutation<
      SealabsPayRedirectResponse,
      SealabsPayPaymentRequest
    >({
      query: (request) => ({
        url: '/sealabs-pay/pay',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useSealabsPayPaymentMutation } = sealabsPayApi;
