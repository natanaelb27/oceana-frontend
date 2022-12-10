import { SealabsPayPaymentRequest } from '../../types/request';
import { SealabsPayRedirectResponse } from '../../types/response';
import { baseApi } from '../store';

export const sealabsPayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sealabsPayTopup: builder.mutation<
      SealabsPayRedirectResponse,
      SealabsPayPaymentRequest
    >({
      query: (request) => ({
        url: '/sealabs-pay/topup',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useSealabsPayTopupMutation } = sealabsPayApi;
