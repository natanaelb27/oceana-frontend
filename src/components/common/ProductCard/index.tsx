import { Badge, Card, Tooltip } from 'react-daisyui';
import { HiLocationMarker, HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import { toCompact, toRupiah } from '../../../utils/convert';

type ProductCardProps = {
  isLoading?: boolean;
};

const ProductCard = ({ isLoading }: ProductCardProps) => {
  if (isLoading) {
    return (
      <Card role='status' className='md:h-[26rem] shadow animate-pulse'>
        <div className='flex justify-center items-center h-56 bg-base-200 rounded'>
          <svg
            className='w-12 h-12 text-base-content'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
            fill='currentColor'
            viewBox='0 0 640 512'
          >
            <path d='M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z'></path>
          </svg>
        </div>
        <div className='pt-4 pb-4 px-4'>
          <div className='h-4 bg-base-200 rounded-full w-4/5 mb-4'></div>
          <div className='h-4 bg-base-200 rounded-full w-3/5 mb-4'></div>
          <div className='h-2.5 bg-base-200 rounded-full mb-2.5'></div>
          <div className='h-2.5 bg-base-200 rounded-full mb-2.5'></div>
          <div className='h-2.5 bg-base-200 rounded-full'></div>
        </div>
      </Card>
    );
  }

  return (
    <Link to='/'>
      <Card className='md:h-[26rem] shadow transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none'>
        <figure>
          <img
            src='https://api.lorem.space/image/shoes?w=480&h=480'
            className='object-cover h-64 w-full'
          />
        </figure>
        <div className='pt-2.5 pb-4 px-4'>
          <p className='line-clamp-2 mb-2'>
            Advan Tab VX 8GB / 128GB 10.4 inch Tiger T618 Advan Tab VX 8GB /
            128GB 10.4 inch Tiger T618
          </p>
          <p className='font-bold mb-2.5 truncate text-ellipsis'>
            {toRupiah(1169000)}
          </p>
          <div className='flex-items-center mb-2.5 text-sm'>
            <Tooltip message='Murah Lebay' color='success'>
              <Badge color='success' size='sm' className='truncate'>
                10%
              </Badge>
            </Tooltip>
            <span className='truncate text-ellipsis ml-2 line-through'>
              {toRupiah(1169000)}
            </span>
          </div>
          <div className='flex items-center mb-1 text-sm'>
            <Tooltip message='Location' className='mr-2' color='info'>
              <HiLocationMarker className='text-info' />
            </Tooltip>
            <p className='truncate text-ellipsis'>Jakarta</p>
          </div>
          <div className='flex items-center mb-1 text-sm'>
            <Tooltip message='Rating' className='mr-2' color='warning'>
              <HiStar className='text-warning' />
            </Tooltip>
            <p className='truncate text-ellipsis'>
              5.0 | {toCompact(1000)} sold
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
