import { GetShipmentResponse } from '../../types/response';
import { baseApi } from '../store';

export const shipmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShipment: builder.query<GetShipmentResponse, void>({
      query: () => ({
        url: '/my-shop/logistics',
        method: 'GET',
      }),
      providesTags: ['Shipment'],
    }),
  }),
});

export const { useGetShipmentQuery } = shipmentApi;
