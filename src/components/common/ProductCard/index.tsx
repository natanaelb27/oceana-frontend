import { Badge, Card, Tooltip } from 'react-daisyui';
import { HiLocationMarker, HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { Product } from '../../../types/component';

import { toCompact, toRupiah } from '../../../utils/convert';
import { toUrl } from '../../../utils/toUrl';
import Image from '../Image';

type ProductCardProps = {
  product?: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  if (!product) {
    return (
      <Card role='status' className='w-full md:h-[26rem] shadow animate-pulse'>
        <div className='flex justify-center items-center h-56 bg-base-200 rounded'>
          <svg
            className='w-12 h-12 text-base-content'
            xmlns='http://www.w3.org/2000/svg'
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
    <Link
      to={`/products/${toUrl(product.name)}-i.${product.merchant_id}-${
        product.id
      }`}
    >
      <Card className='md:h-[24rem] shadow transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none'>
        <figure>
          <Image
            src={product.media_url}
            className='object-cover max-h-64 w-full'
          />
        </figure>
        <div className='pt-2.5 pb-4 px-4'>
          <p className='line-clamp-2 mb-2'>{product.name}</p>
          {product.price_minimum_after_discount !==
          product.price_maximum_after_discount ? (
            <p className='font-bold mb-2.5 truncate text-ellipsis'>
              {toRupiah(product.price_minimum_after_discount)}
              {' - '}
              {toRupiah(product.price_maximum_after_discount)}
            </p>
          ) : (
            <p className='font-bold mb-2.5 truncate text-ellipsis'>
              {toRupiah(product.price_minimum_after_discount)}
            </p>
          )}
          {product.product_merchant_promotion_id !== 0 ? (
            <div className='flex items-center mb-2.5 text-sm'>
              <Tooltip
                message={product.merchant_promotion_name}
                color='success'
              >
                <Badge color='success' size='sm' className='truncate'>
                  {product.discount_type === 'percentage'
                    ? `${product.discount}%`
                    : toRupiah(product.discount)}
                </Badge>
              </Tooltip>
              <p className='truncate text-ellipsis ml-2 line-through'>
                {product.price_minimum !== product.price_maximum ? (
                  <span className='truncate text-ellipsis line-through'>
                    {toRupiah(product.price_minimum)}
                    {' - '}
                    {toRupiah(product.price_maximum)}
                  </span>
                ) : (
                  toRupiah(product.price_minimum)
                )}
              </p>
            </div>
          ) : null}
          <div className='flex items-center mb-1 text-sm'>
            <Tooltip message='Location' className='mr-2' color='info'>
              <HiLocationMarker className='text-info' />
            </Tooltip>
            <p className='truncate text-ellipsis'>{product.merchant.city}</p>
          </div>
          {product.rating_star === 0 ? (
            <div className='flex items-center mb-1 text-sm'>
              <p className='truncate text-ellipsis'>
                {toCompact(product.total_purchase_count)} sold
              </p>
            </div>
          ) : (
            <div className='flex items-center mb-1 text-sm'>
              <Tooltip message='Rating' className='mr-2' color='warning'>
                <HiStar className='text-warning' />
              </Tooltip>
              <p className='truncate text-ellipsis'>
                {product.rating_star} |{' '}
                {toCompact(product.total_purchase_count)} sold
              </p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
