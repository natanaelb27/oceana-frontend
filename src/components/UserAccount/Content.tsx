import { Card } from 'react-daisyui';
import { Profile } from '../../types/component';
import { UserAccountContent } from '../../types/content';
import AddressContent from './AddressContent';

import ProfileContent from './ProfileContent';

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
      return null;
    }

    if (content === UserAccountContent.Refunds) {
      return null;
    }

    return null;
  };
  return <Card className='shadow'>{renderContent()}</Card>;
};

export default Content;
