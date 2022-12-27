import { SellerAccount } from '../../../components';
import { useGetMyShopProfileQuery } from '../../../store/services/myShopService';
import { SellerAccountContent } from '../../../types/content';

const ShopAddPromotion = () => {
  const { data } = useGetMyShopProfileQuery();

  if (!data?.data) {
    return null;
  }

  return (
    <SellerAccount
      profile={data.data}
      content={SellerAccountContent.PromotionAdd}
    />
  );
};

export default ShopAddPromotion;
