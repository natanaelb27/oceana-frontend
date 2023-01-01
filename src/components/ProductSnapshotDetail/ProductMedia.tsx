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
  videos: string[];
};

const ProductMedia = ({ images, videos }: ProductMediaProps) => {
  return (
    <div className='sticky top-24'>
      <div className='mb-2'>
        <Zoom>
          <Image
            src={`${images[0]}`}
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
      {videos.length > 0 && (
        <div className='flex gap-2 mb-4'>
          {videos.slice(1).map((video, index) => (
            <video
              key={index}
              src={video}
              className='h-12 w-12 md:h-20 md:w-40 rounded-md'
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductMedia;
