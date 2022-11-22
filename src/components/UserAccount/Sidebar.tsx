import { Avatar, Card, Divider, Menu } from 'react-daisyui';
import { CgProfile } from 'react-icons/cg';
import { IoWalletOutline } from 'react-icons/io5';
import { GoHome, GoHistory } from 'react-icons/go';
import { HiOutlineReceiptRefund } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';

import { Profile } from '../../types/component';

type SidebarProps = {
  profile: Profile;
};

const Sidebar = ({ profile }: SidebarProps) => {
  return (
    <Card className='shadow'>
      <div className='p-4'>
        <div className='flex items-center gap-4'>
          <Avatar src={profile.photo} size='sm' shape='circle' />
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
