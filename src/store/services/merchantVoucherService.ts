import { GetAllMerchantVouchersResponse } from '../../types/response';
import { baseApi } from '../store';

export const merchantVoucherApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllMerchantVouchers: builder.query<GetAllMerchantVouchersResponse, string>({
            query: (query) => ({
                url: `/shop/vouchers?${query}`,
                method: 'GET',
            }),
            providesTags: ['Merchant'],
        }),
    }),
});

export const { useGetAllMerchantVouchersQuery } = merchantVoucherApi;