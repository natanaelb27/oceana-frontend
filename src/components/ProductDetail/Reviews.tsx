import moment from 'moment';
import { ChangeEvent } from 'react';
import { Avatar, Rating, Select } from 'react-daisyui';
import Zoom from 'react-medium-image-zoom';
import { Metadata, Review } from '../../types/component';

import { ReviewsSort } from '../../types/sort';
import { toUpdateEmailRequest } from '../../utils/mapperDTO';
import { titleCase } from '../../utils/titleCase';
import { Pager, NoData } from '../common';

type ReviewsProps = {
  reviewData?: Review[] | null;
  reviewMetadata?: Metadata | null;
  handleChangeReviewPage?: (n: number) => void;
  handleChangeReviewSort?: (e: ChangeEvent<HTMLSelectElement>) => void;
  isLoading?: boolean;
  sortValue?: ReviewsSort;
};

const Reviews = ({
  reviewData,
  reviewMetadata,
  handleChangeReviewPage,
  handleChangeReviewSort,
  isLoading,
  sortValue,
}: ReviewsProps) => {
  if (isLoading || !handleChangeReviewPage || !handleChangeReviewSort) {
    return (
      <div className='grid grid-cols-12 gap-4 mb-10'>
        <div className='h-16 w-16 bg-base-200 rounded-full col-span-12'></div>
        <div className='col-span-12'>
          <div className='h-6 bg-base-200 rounded-full w-2/5 mb-2.5'></div>
          <div className='h-4 bg-base-200 rounded-full mb-2.5'></div>
          <div className='h-4 bg-base-200 rounded-full mb-2.5'></div>
          <div className='h-4 bg-base-200 rounded-full mb-2.5'></div>
        </div>
      </div>
    );
  }

  if (!reviewData || !reviewMetadata || reviewData.length === 0) {
    return <NoData title={'No Reviews Yet...'} />;
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        {
          reviewMetadata.total_pages === 1 ? (
            <span className='text-sm truncate'>Showing {reviewMetadata.total_rows} out of {reviewMetadata.total_rows} reviews</span>
          ) : reviewMetadata.page === reviewMetadata.total_pages ? (
            <span className='text-sm truncate'>Showing {reviewMetadata.total_rows % 5} out of {reviewMetadata.total_rows} reviews</span>
          ) : (
            <span className='text-sm truncate'>Showing 5 out of {reviewMetadata.total_rows} reviews</span>
          )
        }
        <div className='flex items-center'>
          <span className='text-sm font-bold mr-2.5'>Sort</span>
          <select
            value={sortValue}
            onChange={handleChangeReviewSort}
            className='select select-sm font-normal'
          >
            <option value={ReviewsSort.Latest}>Latest</option>
            <option value={ReviewsSort.HighestRating}>Highest Rating</option>
            <option value={ReviewsSort.LowestRating}>Lowest Rating</option>
          </select>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-10 mt-8'>
        {reviewData.map((review, i) => (
          <div key={i}>
            <div className='flex items-center mb-4'>
              <Rating value={review.rating} size='sm'>
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
              </Rating>
              <span className='text-sm ml-2.5'>
                {moment(review.created_at, 'YYYYMMDD').fromNow()}
              </span>
            </div>
            <div className='flex items-center mb-4'>
              {review.photo ? (
                <Avatar src={review.photo} shape='circle' size='sm' />
              ) : (
                <Avatar
                  letters={review.full_name[0]}
                  shape='circle'
                  size='sm'
                />
              )}
              <span className='font-medium ml-2.5'>{review.full_name}</span>
            </div>
            {review.product_variations && (
              <span className='font-light text-sm mb-4'>
                Variant: {titleCase(review.product_variations)}
              </span>
            )}
            <p className='prose-sm mb-4 whitespace-pre-line'>{review.review}</p>
            {review.media.length > 0 && (
              <div className='flex gap-2'>
                {review.media.map((media, i) => (
                  <Zoom key={i}>
                    <img src={media} className='w-12 rounded' />
                  </Zoom>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className='mx-auto'>
          <Pager
            page={reviewMetadata.page}
            totalPage={reviewMetadata.total_pages}
            onPageChange={handleChangeReviewPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
