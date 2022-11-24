import { Avatar, Card, Divider, Menu } from 'react-daisyui';
import { CgProfile } from 'react-icons/cg';
import { IoWalletOutline } from 'react-icons/io5';
import { GoHome, GoHistory } from 'react-icons/go';
import { HiOutlineReceiptRefund } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';

import { Profile } from '../../types/component';

type SidebarProps = {
  profile: Profile | null | undefined;
};

const Sidebar = ({ profile }: SidebarProps) => {
  if (!profile) {
    return (
      <Card className='shadow animate-pulse'>
        <div className='p-4'>
          <div className='flex items-center gap-4'>
            <div className='h-16 w-16 bg-base-200 rounded-full'></div>
            <div className='flex-1'>
              <div className='h-6 bg-base-200 rounded-full w-2/5 mb-2.5'></div>
              <div className='h-4 bg-base-200 rounded-full'></div>
            </div>
          </div>
          <Divider />
          <div className='h-4 bg-base-200 rounded-full w-3/5 mb-4'></div>
          <div className='h-4 bg-base-200 rounded-full w-3/5 mb-4'></div>
          <div className='h-4 bg-base-200 rounded-full w-4/5 mb-4'></div>
          <div className='h-4 bg-base-200 rounded-full w-4/5 mb-4'></div>
          <div className='h-4 bg-base-200 rounded-full w-5/5'></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className='shadow'>
      <div className='p-4'>
        <div className='flex items-center gap-4'>
          {profile.photo ? (
            <Avatar src={profile.photo} size='sm' shape='circle' />
          ) : (
            <Avatar
              size='sm'
              shape='circle'
              letters={profile.full_name.charAt(0)}
            />
          )}
          <div className='flex flex-col'>
            <span className='text-sm font-medium mb-1'>
              {profile.full_name}
            </span>
            <span className='text-sm'>@{profile.username}</span>
          </div>
        </div>
        <Divider />
        <Menu>
          <Menu.Item>
            <NavLink to='/user/account/profile'>
              <CgProfile />
              Profile
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/user/account/address'>
              <GoHome />
              Address
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/user/account/wallet'>
              <IoWalletOutline />
              Wallet
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/user/purchase'>
              <GoHistory />
              Purchase
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/user/refund'>
              <HiOutlineReceiptRefund />
              Refunds
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>
    </Card>
  );
};

export default Sidebar;
