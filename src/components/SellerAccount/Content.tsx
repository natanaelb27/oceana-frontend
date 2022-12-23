import { Card } from 'react-daisyui';
import { Merchant } from '../../types/component';
import {
  SellerAccountContent,
  SellerAccountPromotionFormContent,
  SellerAccountVoucherFormContent,
} from '../../types/content';
import AddressContent from './AddressContent';
import OrderContent from './OrderContent';
import ProfileContent from './ProfileContent';
import PromotionContent from './PromotionContent';
import PromotionDetailContent from './PromotionDetailContent';
import PromotionFormContent from './PromotionFormContent';
import ShipmentContent from './ShipmentContent';
import VoucherContent from './VoucherContent';
import VoucherDetailContent from './VoucherDetailContent';
import VoucherFormContent from './VoucherFormContent';

type ContentProps = {
  profile: Merchant;
  content: SellerAccountContent;
};

const Content = ({ profile, content }: ContentProps) => {
  const renderContent = () => {
    if (content === SellerAccountContent.Profile) {
      return <ProfileContent profile={profile} />;
    }

    if (content === SellerAccountContent.Address) {
      return <AddressContent />;
    }

    if (content === SellerAccountContent.Product) {
      // return <AddressContent />;
    }

    if (content === SellerAccountContent.Voucher) {
      return <VoucherContent profile={profile} />;
    }

    if (content === SellerAccountContent.VoucherDetail) {
      return <VoucherDetailContent profile={profile} />;
    }

    if (content === SellerAccountContent.VoucherAdd) {
      return (
        <VoucherFormContent
          profile={profile}
          content={SellerAccountVoucherFormContent.Add}
        />
      );
    }

    if (content === SellerAccountContent.VoucherEdit) {
      return (
        <VoucherFormContent
          profile={profile}
          content={SellerAccountVoucherFormContent.Edit}
        />
      );
    }

    if (content === SellerAccountContent.Promotion) {
      return <PromotionContent />;
    }

    if (content === SellerAccountContent.PromotionDetail) {
      return <PromotionDetailContent profile={profile} />;
    }

    if (content === SellerAccountContent.PromotionAdd) {
      return (
        <PromotionFormContent
          profile={profile}
          content={SellerAccountPromotionFormContent.Add}
        />
      );
    }

    if (content === SellerAccountContent.PromotionEdit) {
      return (
        <PromotionFormContent
          profile={profile}
          content={SellerAccountPromotionFormContent.Edit}
        />
      );
    }

    if (content === SellerAccountContent.Order) {
      return <OrderContent />;
    }

    if (content === SellerAccountContent.ShipmentSetting) {
      return <ShipmentContent />;
    }

    return null;
  };
  return <Card className='shadow'>{renderContent()}</Card>;
};

export default Content;
