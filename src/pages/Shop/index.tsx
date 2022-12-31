import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShopDetailCard from '../../components/ShopDetail/ShopDetailCard';
import ShopProducts from '../../components/ShopDetail/ShopProducts';
import ShopVouchers from '../../components/ShopDetail/ShopVouchers';
import {
  LIMIT_HOME_ALL_PRODUCTS,
  LIMIT_SELLER_VOUCHER_LIST,
  VOUCHER_AVAILABILITY,
  VOUCHER_STATUS,
} from '../../constants';
import {
  useGetAllMerchantProductsQuery,
  useGetMerchantByIDQuery,
  useLazyGetMerchantByIDQuery,
} from '../../store/services/merchantService';
import { useGetAllMerchantVouchersQuery } from '../../store/services/merchantVoucherService';
import {
  useGetAllMerchantVoucherByBuyerQuery,
  useLazyGetAllMerchantVoucherByBuyerQuery,
  useLazyGetAllMerchantVoucherQuery,
} from '../../store/services/shopService';
import { MerchantProductQuery, MerchantVoucherQuery } from '../../types/query';
import {
  toMerchantProductQuery,
  toMerchantVoucherQuery,
  toProductQuery,
} from '../../utils/mapperDTO';
import { selectRole } from '../../store/slices/authSlice';
import { useAppSelector } from '../../store/store';
import { validateUserRole } from '../../utils/auth';
import { MerchantGetInformationByIDResponse } from '../../types/response';
import { notifyErrorToast } from '../../utils/toast';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

const ShopDetail = () => {
  const navigate = useNavigate();
  const { shopID } = useParams();
  const roleCode = useAppSelector(selectRole);
  const role = validateUserRole(roleCode);

  const [merchantVoucherQuery] = useState<MerchantVoucherQuery>({
    sort: '',
    sortBy: '',
    filterVoucherStatus: VOUCHER_STATUS.ALL,
    merchantID: Number(shopID),
    searchVoucherCode: '',
    limit: LIMIT_SELLER_VOUCHER_LIST,
    page: 1,
  });

  const [merchantVoucherByBuyerQuery] = useState<MerchantVoucherQuery>({
    sort: '',
    sortBy: '',
    filterVoucherStatus: VOUCHER_STATUS.ALL,
    filterVoucherAvailability: VOUCHER_AVAILABILITY.AVAILABLE,
    merchantID: Number(shopID),
    searchVoucherCode: '',
    limit: LIMIT_SELLER_VOUCHER_LIST,
    page: 1,
  });

  const [getMerchant, { data: getMerchantData }] =
    useLazyGetMerchantByIDQuery();

  const [getMerchantVoucher, { data: getMerchantVoucherData }] =
    useLazyGetAllMerchantVoucherQuery();

  const [getMerchantVoucherByBuyer, { data: getMerchantVoucherByBuyerData }] =
    useLazyGetAllMerchantVoucherByBuyerQuery();

  useEffect(() => {
    getMerchant(String(shopID))
      .unwrap()
      .catch((err) => {
        if (err && 'data' in err) {
          navigate('/');
        }
      });
    if (role) {
      getMerchantVoucherByBuyer(
        toMerchantVoucherQuery(merchantVoucherByBuyerQuery)
      );
    } else {
      getMerchantVoucher(toMerchantVoucherQuery(merchantVoucherQuery));
    }
  }, [shopID]);

  return (
    <div className='mb-3'>
      <div className='flex justify-center items-center'>
        <ShopDetailCard merchant={getMerchantData?.data} />
      </div>
      <div className='flex justify-center items-center'>
        <ShopVouchers
          vouchers={
            role
              ? getMerchantVoucherByBuyerData?.data?.merchant_voucher
              : getMerchantVoucherData?.data?.merchant_voucher
          }
        />
      </div>
      <div className='flex justify-center items-start'>
        <ShopProducts merchantID={shopID} />
      </div>
    </div>
  );
};

export default ShopDetail;
