import { Avatar, Tooltip } from 'react-daisyui';
import { HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { toCompact } from '../../utils/convert';

type ShopBannerProps = {
  isLoading?: boolean;
};

const ShopBanner = ({ isLoading }: ShopBannerProps) => {
  if (isLoading) {
    return (
      <div className='animate-pulse'>
        <div className='flex items-center gap-4'>
          <div className='h-16 w-16 bg-base-200 rounded-full'></div>
          <div className='flex-1'>
            <div className='h-6 bg-base-200 rounded-full w-2/5 mb-2.5'></div>
            <div className='h-4 bg-base-200 rounded-full'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-row gap-4 md:items-center'>
      <Avatar size='sm' shape='circle' src='https://picsum.photos/200'></Avatar>
      <div>
        <Link to='/' className='font-bold mb-2.5 line-clamp-1 link link-hover'>
          PINZY Official Store
        </Link>
        <div className='flex items-center text-sm w-full'>
          <Tooltip message='Rating' className='mr-1' color='warning'>
            <HiStar className='text-warning text-lg' />
          </Tooltip>
          <p className='line-clamp-1'>
            4.7 | {toCompact(500)} products | Joined since{' '}
            {moment().format('MMMM YYYY')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopBanner;
