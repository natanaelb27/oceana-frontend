import { GetRajaOngkirShippingCostResponse } from '../../types/response';
import { GetRajaOngkirShippingCostRequest } from '../../types/request';
import { baseApi } from '../store';

export const rajaOngkirApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRajaOngkirShippingCost: builder.mutation<
      GetRajaOngkirShippingCostResponse,
      GetRajaOngkirShippingCostRequest
    >({
      query: (request) => ({
        url: '/raja-ongkir/shipping-cost',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useGetRajaOngkirShippingCostMutation } = rajaOngkirApi;
