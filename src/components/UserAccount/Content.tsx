import { Card } from 'react-daisyui';
import { Profile } from '../../types/component';
import { UserAccountContent } from '../../types/content';
import AddressContent from './AddressContent';
import PurchaseContent from './PurchaseContent';
import ProfileContent from './ProfileContent';
import RefundContent from './RefundContent';

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
      return null;
    }

    if (content === UserAccountContent.Purchase) {
      return <PurchaseContent />;
    }

    if (content === UserAccountContent.Refunds) {
      return <RefundContent />;
    }

    return null;
  };
  return <Card className='shadow'>{renderContent()}</Card>;
};

export default Content;
