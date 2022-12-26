import { UpdateShipmentRequest } from '../../types/request/shipment';
import {
  GetShipmentResponse,
  UpdateShipmentResponse,
} from '../../types/response';
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
    updateShipment: builder.mutation<
      UpdateShipmentResponse,
      { request: UpdateShipmentRequest }
    >({
      query: ({ request }) => ({
        url: '/my-shop/logistics',
        method: 'PATCH',
        body: request,
      }),
      invalidatesTags: ['Shipment'],
    }),
    getShipmentSelected: builder.query<GetShipmentResponse, void>({
      query: () => ({
        url: '/my-shop/logistics/selected',
        method: 'GET',
      }),
      providesTags: ['Shipment'],
    }),
  }),
});

export const {
  useGetShipmentQuery,
  useLazyGetShipmentQuery,
  useUpdateShipmentMutation,
  useGetShipmentSelectedQuery,
  useLazyGetShipmentSelectedQuery,
} = shipmentApi;
