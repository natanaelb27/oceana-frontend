import { Avatar, Tooltip } from 'react-daisyui';
import { HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { toCompact } from '../../utils/convert';
import { ShopInformation } from '../../types/component';
import { Image } from '../common';

type ShopBannerProps = {
  shopInformation?: ShopInformation;
  isLoading?: boolean;
};

const ShopBanner = ({ shopInformation, isLoading }: ShopBannerProps) => {
  if (!shopInformation || isLoading) {
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
      {shopInformation.photo ? (
        <div className='avatar'>
          <div className='w-14 rounded-full'>
            <Image src={shopInformation.photo} />
          </div>
        </div>
      ) : (
        <Avatar
          size='sm'
          shape='circle'
          letters={shopInformation.name.charAt(0)}
        />
      )}
      <div>
        <Link to='/' className='font-bold mb-2.5 line-clamp-1 link link-hover'>
          {shopInformation.name}
        </Link>
        <div className='flex items-center text-sm w-full'>
          <Tooltip message='Rating' className='mr-1' color='warning'>
            <HiStar className='text-warning text-lg' />
          </Tooltip>
          <p className='line-clamp-1'>
            {shopInformation.rating_star.toFixed(1)} |{' '}
            {toCompact(shopInformation.product_count)} products | Joined since{' '}
            {moment().format('MMMM YYYY')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopBanner;
