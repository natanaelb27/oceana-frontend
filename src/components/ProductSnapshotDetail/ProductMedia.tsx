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
import FsLightbox from 'fslightbox-react';
import { useEffect, useState } from 'react';

type ProductMediaProps = {
  images: string[];
  videos: string[];
};

const ProductMedia = ({ images, videos }: ProductMediaProps) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [medias, setMedias] = useState<string[]>([]);
  const [indexMediaOpen, setIndexMediaOpen] = useState(0);

  const resetIndexMediaOpen = () => {
    setIndexMediaOpen(0);
  };

  useEffect(() => {
    const newMedias = [...images, ...videos];
    setMedias(newMedias);
  }, [images, videos]);

  useEffect(() => {
    if (indexMediaOpen !== 0) {
      setGalleryOpen(!galleryOpen);
    }
  }, [indexMediaOpen]);

  return (
    <>
      <div className='sticky top-24'>
        <div className='mb-2'>
          <Image
            src={images[0]}
            className='w-full rounded-lg'
            alt='Product Media'
            onClick={() => {
              setIndexMediaOpen(1);
            }}
          />
        </div>
        {images.length > 1 && (
          <div className='grid grid-cols-5 gap-2 mb-4'>
            {images.slice(1).map((image, index) => (
              <Image
                key={'product-image-' + index}
                src={image}
                className='w-full rounded-lg'
                alt={`Product Media ${index}`}
                onClick={() => setIndexMediaOpen(index + 2)}
              />
            ))}
            {videos.map((video, index) => (
              <Image
                key={'product-video-' + index}
                src={video.replace('.mp4', '.jpg')}
                className='w-full rounded-lg'
                alt={`Product Media ${index}`}
                onClick={() => setIndexMediaOpen(images.length + (index + 1))}
              />
            ))}
          </div>
        )}
      </div>
      <FsLightbox
        toggler={galleryOpen}
        sources={medias}
        slide={indexMediaOpen}
        onClose={resetIndexMediaOpen}
      />
    </>
  );
};

export default ProductMedia;
