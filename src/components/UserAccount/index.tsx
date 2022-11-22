import { Profile } from '../../types/component';
import Content from './Content';
import Sidebar from './Sidebar';

type UserAccountProps = {
  profile: Profile;
};

const UserAccount = ({ profile }: UserAccountProps) => {
  return (
    <div className='container mx-auto'>
      <div className='px-4 py-10'>
        <div className='grid grid-cols-12 gap-4 md:gap-10'>
          <div className='col-span-12 md:col-span-3'>
            <Sidebar profile={profile} />
          </div>
          <div className='col-span-12 md:col-span-9'>
            <Content profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
