import { GetSubDistrictsResponse } from '../../types/response';
import { baseApi } from '../store';

export const subDistrictApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubDistricts: builder.query<GetSubDistrictsResponse, string>({
      query: (query) => ({
        url: `/sub-districts?${query}`,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
  }),
});

export const { useGetSubDistrictsQuery, useLazyGetSubDistrictsQuery } =
  subDistrictApi;
