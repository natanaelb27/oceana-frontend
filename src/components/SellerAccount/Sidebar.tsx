import { Avatar, Card, Divider, Menu } from 'react-daisyui';
import { CgProfile } from 'react-icons/cg';
import { GoHome } from 'react-icons/go';
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClipboardList,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineTruck,
} from 'react-icons/hi';
import {
  selectSidebar,
  setMarketingSidebar,
} from '../../store/slices/sellerSidebarSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

import { NavLink } from 'react-router-dom';

import { Merchant } from '../../types/component';

type SidebarProps = {
  profile: Merchant | null | undefined;
};

const Sidebar = ({ profile }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const sidebar = useAppSelector(selectSidebar);

  const handleMarketingSidebarClick = () => {
    dispatch(setMarketingSidebar({ marketingSidebar: !sidebar.marketing }));
  };

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
            <Avatar size='sm' shape='circle' letters={profile.name.charAt(0)} />
          )}
          <div className='flex flex-col'>
            <span className='text-sm font-medium mb-1'>{profile.name}</span>
          </div>
        </div>
        <Divider />
        <Menu>
          <Menu.Item>
            <NavLink to='/seller/shop/profile'>
              <CgProfile />
              Profile
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/seller/shop/address'>
              <GoHome />
              Address
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/seller/marketing/products/list'>
              <HiOutlineShoppingBag />
              Product
            </NavLink>
          </Menu.Item>
          <Menu.Item onClick={handleMarketingSidebarClick}>
            <a>
              <HiOutlineTag />
              Marketing
              {sidebar.marketing ? (
                <HiOutlineChevronUp className='absolute right-3' />
              ) : (
                <HiOutlineChevronDown className='absolute right-3' />
              )}
            </a>
          </Menu.Item>
          <div
            className={
              'ml-7 transition duration-300 ease-in-out ' +
              (!sidebar.marketing ? 'hidden' : '')
            }
          >
            <Menu.Item>
              <NavLink to='/seller/marketing/vouchers/list'>Voucher</NavLink>
            </Menu.Item>
            <Menu.Item>
              <NavLink to='/seller/marketing/promotions/list'>
                Promotion
              </NavLink>
            </Menu.Item>
          </div>
          <Menu.Item>
            <NavLink to='/seller/orders'>
              <HiOutlineClipboardList />
              Order
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/seller/settings/shipment'>
              <HiOutlineTruck />
              Shipment Setting
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>
    </Card>
  );
};

export default Sidebar;
