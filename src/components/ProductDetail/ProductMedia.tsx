import Zoom from 'react-medium-image-zoom';
import { HiHeart } from 'react-icons/hi';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import 'react-medium-image-zoom/dist/styles.css';
import { Button } from 'react-daisyui';
import { toCompact } from '../../utils/convert';

const ProductMedia = () => {
  return (
    <div>
      <div className='mb-2'>
        <Zoom>
          <img
            src='https://picsum.photos/300/300'
            className='w-full rounded-lg'
          />
        </Zoom>
      </div>
      <div className='grid grid-cols-5 gap-2 mb-4'>
        <Zoom>
          <img
            src='https://picsum.photos/300/300'
            className='w-full rounded-lg'
          />
        </Zoom>
        <Zoom>
          <img
            src='https://picsum.photos/300/300'
            className='w-full rounded-lg'
          />
        </Zoom>
        <Zoom>
          <img
            src='https://picsum.photos/300/300'
            className='w-full rounded-lg'
          />
        </Zoom>
        <Zoom>
          <img
            src='https://picsum.photos/300/300'
            className='w-full rounded-lg'
          />
        </Zoom>
        <Zoom>
          <img
            src='https://picsum.photos/300/300'
            className='w-full rounded-lg'
          />
        </Zoom>
      </div>
      <div className='flex justify-center items-center mb-2.5'>
        <span className='mr-2'>Share:</span>
        <FacebookShareButton url={window.location.href} className='mr-1'>
          <FacebookIcon className='rounded-full h-8 w-8' />
        </FacebookShareButton>
        <TwitterShareButton url={window.location.href} className='mr-1'>
          <TwitterIcon className='rounded-full h-8 w-8' />
        </TwitterShareButton>
        <WhatsappShareButton url={window.location.href}>
          <WhatsappIcon className='rounded-full h-8 w-8' />
        </WhatsappShareButton>
        <span className='mx-2'>|</span>
        <Button shape='circle' size='sm' color='ghost'>
          <HiHeart className='text-2xl text-secondary' />
        </Button>
        <span className='ml-1'>Favorite ({toCompact(10000)})</span>
      </div>
    </div>
  );
};

export default ProductMedia;
