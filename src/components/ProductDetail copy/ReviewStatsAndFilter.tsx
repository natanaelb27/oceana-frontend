import React from 'react';
import { ProductReviewDetails } from '../../types/component';
import ReviewFilter from './ReviewFilter';
import ReviewStats from './ReviewStats';

type ReviewStatsAndFilterProps = {
  handleChangeFilterReviewWithMedia?: () => void;
  handleChangeFilterReviewRating?: (e: React.SyntheticEvent) => void;
  handleChangeFilterReviewComments?: () => void;
  isLoading?: boolean;
  productReviewDetails?: ProductReviewDetails;
};

const ReviewStatsAndFilter = ({
  isLoading,
  handleChangeFilterReviewWithMedia,
  handleChangeFilterReviewRating,
  handleChangeFilterReviewComments,
  productReviewDetails
}: ReviewStatsAndFilterProps) => {
  if (isLoading) {
    return (
      <div>
        <div className='h-6 bg-base-200 w-3/5 mx-auto rounded-full mb-4'></div>
        <ReviewStats isLoading />
        <ReviewFilter isLoading />
      </div>
    );
  }

  return (
    <div className='md:p-4'>
      <h5 className='font-medium uppercase text-xl mb-4 text-center'>
        Buyer&apos;s Reviews
      </h5>
      <ReviewStats productReviewDetails={productReviewDetails} />
      <ReviewFilter
        handleChangeFilterReviewWithMedia={handleChangeFilterReviewWithMedia}
        handleChangeFilterReviewRating={handleChangeFilterReviewRating}
        handleChangeFilterReviewComments={handleChangeFilterReviewComments}
      />
    </div>
  );
};

export default ReviewStatsAndFilter;
