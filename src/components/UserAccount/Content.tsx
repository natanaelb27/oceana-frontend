import { Card } from 'react-daisyui';
import { Profile } from '../../types/component';

import ProfileContent from './ProfileContent';

type ContentProps = {
  profile: Profile;
};

const Content = ({ profile }: ContentProps) => {
  return (
    <Card className='shadow'>
      <div className='p-4 md:p-10'>
        <ProfileContent profile={profile} />
      </div>
    </Card>
  );
};

export default Content;
