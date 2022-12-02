import { SellerAccount } from '../../../components';
import { useGetMyShopProfileQuery } from '../../../store/services/myShopService';
import { SellerAccountContent } from '../../../types/content';
import { GetMerchantResponse } from '../../../types/response';
import { notifyErrorToast } from '../../../utils/toast';

const ShopProfile = () => {
  const { data, error } = useGetMyShopProfileQuery();

  if (error && 'data' in error) {
    const response = error.data as GetMerchantResponse;

    notifyErrorToast(response.message);
  }

  return (
    <SellerAccount
      profile={data?.data}
      content={SellerAccountContent.Profile}
    />
  );
};

export default ShopProfile;
