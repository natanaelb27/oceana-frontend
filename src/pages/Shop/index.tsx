import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ShopDetailCard from '../../components/ShopDetail/ShopDetailCard';
import ShopVouchers from '../../components/ShopDetail/ShopVouchers';
import { useGetMerchantByIDQuery } from '../../store/services/merchantService';
import { useGetAllMerchantVouchersQuery } from '../../store/services/merchantVoucherService';
import { MerchantVoucherQuery } from '../../types/query';
import { toMerchantVoucherQuery } from '../../utils/mapperDTO';

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

  const { data: getMerchantData } = useGetMerchantByIDQuery(String(shopID));
  const { data: getMerchantVoucherData} = useGetAllMerchantVouchersQuery(toMerchantVoucherQuery(merchantVoucherQuery));

  return (
    <>
      <div className='flex justify-center items-center'>
        <ShopDetailCard merchant={getMerchantData?.data}/>
      </div>
      <div className='flex justify-center items-center'>
        <ShopVouchers vouchers={getMerchantVoucherData?.data?.merchant_voucher}/>
      </div>
    </>
  );
};

export default ShopDetail;
