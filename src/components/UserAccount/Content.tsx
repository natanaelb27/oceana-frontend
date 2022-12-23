import { Card } from 'react-daisyui';
import { Profile } from '../../types/component';
import { UserAccountContent } from '../../types/content';
import AddressContent from './AddressContent';
import PurchaseContent from './PurchaseContent';
import ProfileContent from './ProfileContent';
import PendingPaymentContent from './PendingPaymentContent';
import SealabsPayContent from './SealabsPayContent';
import WalletContent from './WalletContent';
import RefundContent from './RefundContent';
import RefundCreate from './RefundCreate';
import ReviewContent from './ReviewContent';
import ReviewDetailContent from './ReviewDetailContent';

type ContentProps = {
  profile: Profile | null | undefined;
  content: UserAccountContent;
};

const Content = ({ profile, content }: ContentProps) => {
  const renderContent = () => {
    if (content === UserAccountContent.Profile) {
      return <ProfileContent profile={profile} />;
    }

    if (content === UserAccountContent.Address) {
      return <AddressContent />;
    }

    if (content === UserAccountContent.Wallet) {
      return <WalletContent />;
    }

    if (content === UserAccountContent.SealabsPay) {
      return <SealabsPayContent />;
    }

    if (content === UserAccountContent.Purchase) {
      return <PurchaseContent />;
    }

    if (content === UserAccountContent.Refunds) {
      return <RefundContent />;
    }

    if (content === UserAccountContent.RefundCreate) {
      return <RefundCreate />;
    }
    
    if (content === UserAccountContent.Review) {
      return <ReviewContent />;
    }

    if (content === UserAccountContent.ReviewDetail) {
      return <ReviewDetailContent />;
    }

    if (content === UserAccountContent.Refund) {
      return null;
    }
    
    if (content === UserAccountContent.PendingPayment) {
      return <PendingPaymentContent />;
    }

  };
  return <Card className='shadow'>{renderContent()}</Card>;
};

export default Content;
