import { GetMerchantVoucherResponse } from '../../types/response';
import { baseApi } from '../store';

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMerchantVoucher: builder.query<GetMerchantVoucherResponse, string>({
      query: (query) => ({
        url: `/shop/vouchers?${query}`,
        method: 'GET',
      }),
      providesTags: ['MerchantVoucher'],
    }),
  }),
});

export const {
  useGetAllMerchantVoucherQuery,
  useLazyGetAllMerchantVoucherQuery,
} = shopApi;
