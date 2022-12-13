import moment from 'moment';
import { useState } from 'react';
import { Avatar, Rating, Select } from 'react-daisyui';
import Zoom from 'react-medium-image-zoom';
import { Metadata, Review } from '../../types/component';

import { ReviewsSort } from '../../types/sort';
import { titleCase } from '../../utils/titleCase';
import { Pager, NoData } from '../common';

type ReviewsProps = {
  reviewData?: Review[] | null;
  reviewMetadata?: Metadata | null;
  handlePageChange: (n: number) => void;
};

const Reviews = ({
  reviewData,
  reviewMetadata,
  handlePageChange,
}: ReviewsProps) => {
  const [sort, setSort] = useState<ReviewsSort>(ReviewsSort.Latest);

  const handleSortChange = (sort: ReviewsSort) => {
    setSort(Number(sort));
  };

  if (!reviewData || !reviewMetadata) {
    return <NoData title={'No Reviews Yet...'} />;
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-sm truncate'>Showing 5 out 5 reviews</span>
        <div className='flex items-center'>
          <span className='text-sm font-bold mr-2.5'>Sort</span>
          <Select
            value={sort}
            onChange={handleSortChange}
            size='sm'
            className='font-normal'
          >
            <Select.Option value={ReviewsSort.Latest}>Latest</Select.Option>
            <Select.Option value={ReviewsSort.HighestRating}>
              Highest Rating
            </Select.Option>
            <Select.Option value={ReviewsSort.LowestRating}>
              Lowest Rating
            </Select.Option>
          </Select>
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
            <p className='prose-sm mb-4'>{review.review}</p>
            {review.product_review_media && (
              <div className='flex gap-2'>
                {review.product_review_media.map((media, i) => (
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
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
