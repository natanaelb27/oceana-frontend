import { ChangeEvent, useState } from 'react';
import { Button, Rating, Textarea } from 'react-daisyui';
import { HiInformationCircle, HiPencil } from 'react-icons/hi';
import { MEDIA_TYPE } from '../../../constants';
import { useCreateProductReviewMutation } from '../../../store/services/reviewService';
import { OrderDetail } from '../../../types/component';
import { CreateProductReviewResponse } from '../../../types/response';
import { toCreateProductReviewRequest } from '../../../utils/mapperDTO/productReview';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import UploadFileCard from '../../common/UploadFileCard';

type ContentProps = {
  order_detail_data: OrderDetail;
};

const ReviewForm = ({ order_detail_data }: ContentProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const [ratingInput, setRatingInput] = useState<number>(5);

  const [reviewInput, setReviewInput] = useState<string>('');

  const handleReviewTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReviewInput(e.target.value);
  };

  const [createProductReview, { isLoading: createProductReviewIsLoading }] =
    useCreateProductReviewMutation();

  const handleSubmitReviewClick = () => {
    createProductReview([
      toCreateProductReviewRequest(ratingInput, reviewInput, images, videos),
      order_detail_data?.order_detail_id,
    ])
      .unwrap()
      .then(() => {
        notifySuccessToast('Review has been created!');
      })
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as CreateProductReviewResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  const [showReviewTips, setShowReviewTips] = useState<boolean>(false);

  const handleReviewTipsMouseOver = () => {
    setShowReviewTips(true);
  };

  const handleReviewTipsMouseOut = () => {
    setShowReviewTips(false);
  };

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
              <div className='flex items-center gap-1'>
                <span className='font-light text-sm'>
                  Leave a review for this product
                </span>
                <div
                  className='w-[25%] hidden md:block'
                  onMouseOver={handleReviewTipsMouseOver}
                  onMouseOut={handleReviewTipsMouseOut}
                >
                  <HiInformationCircle className='text-ghost' />
                  <div
                    className={`border-2 p-2 flex flex-col gap-2 absolute bg-base-100 transition-opacity ease-in-out duration-300  ${
                      showReviewTips ? 'flex opacity-100' : 'hidden opacity-0'
                    }`}
                  >
                    <div className='flex gap-2 items-center'>
                      <HiInformationCircle className='text-ghost' />
                      <span className='font-bold text-sm text-'>
                        Writing Review Tips
                      </span>
                    </div>
                    <ul className='text-xs flex flex-col gap-2'>
                      <li className='flex flex-col'>
                        <span className='font-bold'>
                          Conformity with the description
                        </span>
                        <span>Ex: The size and color match the photo</span>
                      </li>
                      <li className='flex flex-col'>
                        <span className='font-bold'>Product Functionality</span>
                        <span>Ex: The product is working fine</span>
                      </li>
                      <li className='flex flex-col'>
                        <span className='font-bold'>
                          Willing to recommend this product to a friend
                        </span>
                        <span>
                          Ex: Good quality, fast delivery, recommended
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <Textarea
                className='text-xs resize-none h-24'
                onChange={handleReviewTextChange}
                placeholder='Write your description about this product...'
              ></Textarea>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-light text-sm'>
                Share photos of the products you receive
              </span>
              <UploadFileCard
                files={images}
                setFiles={setImages}
                uploadLimit={5}
                fileType={MEDIA_TYPE.IMAGE}
              ></UploadFileCard>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-light text-sm'>
                Share videos of the products you receive
              </span>
              <UploadFileCard
                files={videos}
                setFiles={setVideos}
                uploadLimit={1}
                fileType={MEDIA_TYPE.VIDEO}
              ></UploadFileCard>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            className='btn-primary normal-case'
            startIcon={<HiPencil />}
            onClick={handleSubmitReviewClick}
            loading={createProductReviewIsLoading}
          >
            Send Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
