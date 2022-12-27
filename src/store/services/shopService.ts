import {
  GetShopInformationResponse,
  GetMerchantVoucherDetailsResponse,
  GetMerchantVoucherResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShopInformation: builder.query<
      GetShopInformationResponse,
      string | undefined
    >({
      query: (id) => ({
        url: `/shop/information/${id}`,
        method: 'GET',
      }),
      providesTags: ['Shop'],
    }),
    getAllMerchantVoucher: builder.query<GetMerchantVoucherResponse, string>({
      query: (query) => ({
        url: `/shop/vouchers?${query}`,
        method: 'GET',
      }),
      providesTags: ['MerchantVoucher'],
    }),
    getMerchantVoucherDetails: builder.query<
      GetMerchantVoucherDetailsResponse,
      string
    >({
      query: (id) => ({
        url: `/shop/vouchers/${id}`,
        method: 'GET',
      }),
      providesTags: ['MerchantVoucher'],
    }),
    getAllMerchantVoucherByBuyer: builder.query<
      GetMerchantVoucherResponse,
      string
    >({
      query: (query) => ({
        url: `/shop/vouchers/buyer?${query}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetShopInformationQuery,
  useGetAllMerchantVoucherQuery,
  useLazyGetAllMerchantVoucherQuery,
  useGetMerchantVoucherDetailsQuery,
  useLazyGetMerchantVoucherDetailsQuery,
  useGetAllMerchantVoucherByBuyerQuery,
  useLazyGetAllMerchantVoucherByBuyerQuery,
} = shopApi;
