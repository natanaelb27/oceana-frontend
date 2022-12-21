import { ChangeEvent, MouseEventHandler, useState } from 'react';
import { Input, Rating, Textarea } from 'react-daisyui';
import {
  HiInformationCircle,
  HiOutlineCamera,
  HiOutlineInformationCircle,
  HiOutlineVideoCamera,
} from 'react-icons/hi';
import { MEDIA_TYPE } from '../../../constants';
import { OrderDetail } from '../../../types/component';
import { notifyErrorToast } from '../../../utils/toast';
import UploadFileCard from '../../common/UploadFileCard';

type ContentProps = {
  order_detail_length: number;
  order_detail_data: OrderDetail;
};

const ReviewForm = ({
  order_detail_length,
  order_detail_data,
}: ContentProps) => {
  const [ratingInput, setRatingInput] = useState<number>(0);

  return (
    <div className='flex gap-3'>
      <img
        src={order_detail_data.product_image || ''}
        alt={order_detail_data.product_name || ''}
        className='h-12 w-12 md:h-20 md:w-20 rounded-md'
      />
      <div className='flex flex-col gap-2 w-full'>
        <div>
          <span className='line-clamp-2 md:line-clamp-1'>
            {order_detail_data.product_name}
          </span>
          <span className='text-xs font-light'>
            {order_detail_data.product_variations}
          </span>
        </div>
        <span className='text-sm font-light'>
          How is the overall quality of this product?
        </span>
        <Rating value={ratingInput} size='md' onChange={setRatingInput}>
          {[1, 2, 3, 4, 5].map((rating, i) => {
            return (
              <Rating.Item
                key={i}
                name='rating-1'
                value={rating}
                className='mask mask-star-2 bg-orange-400'
              />
            );
          })}
        </Rating>
        <div className='mt-2 flex justify-between gap-5'>
          <div className='flex flex-col w-[75%] gap-2'>
            <div className='flex flex-col gap-1'>
              <span className='font-light text-sm'>
                Leave a review for this product
              </span>
              <Textarea
                className='text-xs resize-none h-24'
                placeholder='Write your description about this product...'
              ></Textarea>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-light text-sm'>
                Share photos of the products you receive
              </span>
              <UploadFileCard
                upload_limit={5}
                file_type={MEDIA_TYPE.IMAGE}
              ></UploadFileCard>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-light text-sm'>
                Share videos of the products you receive
              </span>
              <UploadFileCard
                upload_limit={1}
                file_type={MEDIA_TYPE.VIDEO}
              ></UploadFileCard>
            </div>
          </div>
          <div className='w-[25%] hidden md:block'>
            <div className='border-2 p-2 flex flex-col gap-2'>
              <div className='flex gap-2 items-center'>
                <HiInformationCircle className='text-warning' />
                <span className='font-bold text-sm text-'>
                  Writing Review Tips
                </span>
              </div>
              <ul className='text-xs'>
                <li className='flex flex-col'>
                  <span className='font-bold'>
                    Conformity with the description
                  </span>
                  <span>Ex: The size and color match the photo</span>
                </li>
              </ul>
              <ul className='text-xs'>
                <li className='flex flex-col'>
                  <span className='font-bold'>Product Functionality</span>
                  <span>Ex: The product is working fine</span>
                </li>
              </ul>
              <ul className='text-xs'>
                <li className='flex flex-col'>
                  <span className='font-bold'>
                    Willing to recommend this product to a friend
                  </span>
                  <span>Ex: Good quality, fast delivery, recommended</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
