import { Card } from 'react-daisyui';
import { Merchant } from '../../types/component';
import { SellerAccountContent } from '../../types/content';
import AddressContent from './AddressContent';
import VoucherContent from './VoucherContent';

// import ProfileContent from './ProfileContent';

type ContentProps = {
  profile: Merchant;
  content: SellerAccountContent;
};

const Content = ({ profile, content }: ContentProps) => {
  const renderContent = () => {
    if (content === SellerAccountContent.Profile) {
      // return <ProfileContent profile={profile} />;
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

    if (content === SellerAccountContent.Promotion) {
      // return <AddressContent />;
    }

    if (content === SellerAccountContent.Order) {
      // return <AddressContent />;
    }

    return null;
  };
  return <Card className='shadow'>{renderContent()}</Card>;
};

export default Content;
