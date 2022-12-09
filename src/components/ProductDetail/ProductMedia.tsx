import Zoom from 'react-medium-image-zoom';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { IoCopyOutline } from 'react-icons/io5';
import { Button } from 'react-daisyui';
import { toCompact } from '../../utils/convert';
import { notifyInfoToast } from '../../utils/toast';
import { useEffect } from 'react';

type ProductMediaProps = {
  images: string[];
  selectedVariantImage: string;
  handleClickFavoriteProduct: () => void;
  favoriteProductValue: boolean;
};

const ProductMedia = ({
  images,
  selectedVariantImage,
  handleClickFavoriteProduct,
  favoriteProductValue,
}: ProductMediaProps) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href);

    notifyInfoToast('Copied to clipboard');
  };

  return (
    <div>
      <div className='mb-2'>
        <Zoom>
          <img
            src={`${
              selectedVariantImage === '' ? images[0] : selectedVariantImage
            }`}
            className='w-full rounded-lg'
          />
        </Zoom>
      </div>
      {images.length > 1 && (
        <div className='grid grid-cols-5 gap-2 mb-4'>
          {images.slice(1).map((image, index) => (
            <Zoom key={index}>
              <img src={image} className='w-full rounded-lg' />
            </Zoom>
          ))}
        </div>
      )}
      <div className='flex justify-center items-center mb-2.5'>
        <span className='mr-2'>Share:</span>
        <FacebookShareButton url={window.location.href} className='mr-1'>
          <FacebookIcon className='rounded-full h-6 w-6' />
        </FacebookShareButton>
        <TwitterShareButton url={window.location.href} className='mr-1'>
          <TwitterIcon className='rounded-full h-6 w-6' />
        </TwitterShareButton>
        <WhatsappShareButton url={window.location.href} className='mr-1'>
          <WhatsappIcon className='rounded-full h-6 w-6' />
        </WhatsappShareButton>
        <Button
          shape='circle'
          size='xs'
          color='accent'
          onClick={handleCopyClick}
        >
          <IoCopyOutline className='text-sm' />
        </Button>
        <span className='mx-2'>|</span>
        <Button
          shape='circle'
          size='sm'
          color='ghost'
          onClick={handleClickFavoriteProduct}
        >
          {favoriteProductValue === true ? (
            <HiHeart className='text-2xl text-secondary' />
          ) : (
            <HiOutlineHeart className='text-2xl' />
          )}
        </Button>
        <span className='ml-1'>Favorite ({toCompact(10000)})</span>
      </div>
    </div>
  );
};

export default ProductMedia;
