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
import { notifyErrorToast, notifyInfoToast } from '../../utils/toast';
import { Image } from '../common';

type ProductMediaProps = {
  images: string[];
  selectedVariantImage: string;
  handleClickFavoriteProduct: () => void;
  favoriteProductValue: boolean;
  productLikeCount: number;
};

const ProductMedia = ({
  images,
  selectedVariantImage,
  handleClickFavoriteProduct,
  favoriteProductValue,
  productLikeCount,
}: ProductMediaProps) => {
  function copyFailed() {
    notifyErrorToast('Uh oh copy failed, please copy link manually!');
  }

  function updateClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        notifyInfoToast('Copied to clipboard!');
      },
      () => {
        copyFailed();
      }
    );
  }
  const handleCopyClick = () => {
    const permissionName = 'clipboard-write' as PermissionName;
    navigator.permissions.query({ name: permissionName }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        updateClipboard(window.location.href);
      } else {
        copyFailed();
      }
    });
  };

  return (
    <div className='sticky top-24'>
      <div className='mb-2'>
        <Zoom>
          <Image
            src={`${
              selectedVariantImage === '' ? images[0] : selectedVariantImage
            }`}
            className='w-full rounded-lg'
            alt='Product Media'
          />
        </Zoom>
      </div>
      {images.length > 1 && (
        <div className='grid grid-cols-5 gap-2 mb-4'>
          {images.slice(1).map((image, index) => (
            <Zoom key={index}>
              <Image
                src={image}
                className='w-full rounded-lg'
                alt={`Product Media ${index}`}
              />
            </Zoom>
          ))}
        </div>
      )}
      <div className='flex justify-center items-center mb-2.5 flex-wrap'>
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
        <span className='ml-1'>Favorite ({toCompact(productLikeCount)})</span>
      </div>
    </div>
  );
};

export default ProductMedia;
