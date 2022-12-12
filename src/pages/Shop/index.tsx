import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ShopDetailCard from '../../components/ShopDetail/ShopDetailCard';
import ShopProducts from '../../components/ShopDetail/ShopProducts';
import ShopVouchers from '../../components/ShopDetail/ShopVouchers';
import { useGetAllMerchantProductsQuery, useGetMerchantByIDQuery } from '../../store/services/merchantService';
import { useGetAllMerchantVouchersQuery } from '../../store/services/merchantVoucherService';
import { MerchantProductQuery, MerchantVoucherQuery } from '../../types/query';
import { toMerchantProductQuery, toMerchantVoucherQuery, toProductQuery } from '../../utils/mapperDTO';

const ShopDetail = () => {
  const { shopID } = useParams();

  const [merchantVoucherQuery] = useState<MerchantVoucherQuery>({
    search: '',
    sort: '',
    sortBy: '',
    filterVoucherStatus: 'all',
    merchantID: Number(shopID),
    searchVoucherCode: '',
    limit: 0,
    page: 1,
  });

  const [merchantProductQuery] = useState<MerchantProductQuery>({
    search: '',
    sort: 'desc',
    sortBy: 'most-buy',
    limit: 20,
    page: 1,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    merchantCities: [],
    courierServices: [],
  });

  const { data: getMerchantData } = useGetMerchantByIDQuery(String(shopID));
  const { data: getMerchantVoucherData} = useGetAllMerchantVouchersQuery(toMerchantVoucherQuery(merchantVoucherQuery));
  const { data: getAllMerchantProducts } = useGetAllMerchantProductsQuery({ id: String(shopID), query: toMerchantProductQuery(merchantProductQuery)});


  return (
    <div className='mb-3'>
      <div className='flex justify-center items-center'>
        <ShopDetailCard merchant={getMerchantData?.data}/>
      </div>
      <div className='flex justify-center items-center'>
        <ShopVouchers vouchers={getMerchantVoucherData?.data?.merchant_voucher}/>
      </div>
      <div className='flex justify-center items-start'>
        <ShopProducts products={getAllMerchantProducts?.data}/>
      </div>
    </div>
  );
};

export default ShopDetail;
