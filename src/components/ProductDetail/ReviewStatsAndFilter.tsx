import React from 'react';
import ReviewFilter from './ReviewFilter';
import ReviewStats from './ReviewStats';

type ReviewStatsAndFilterProps = {
  handleChangeFilterReviewWithMedia?: () => void;
  handleChangeFilterReviewRating?: (e: React.SyntheticEvent) => void;
  handleChangeFilterReviewComments?: () => void;
  isLoading?: boolean;
};

const ReviewStatsAndFilter = ({
  isLoading,
  handleChangeFilterReviewWithMedia,
  handleChangeFilterReviewRating,
  handleChangeFilterReviewComments,
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
    <div>
      <h5 className='font-medium uppercase text-xl mb-4 text-center'>
        Buyer&apos;s Reviews
      </h5>
      <ReviewStats />
      <ReviewFilter
        handleChangeFilterReviewWithMedia={handleChangeFilterReviewWithMedia}
        handleChangeFilterReviewRating={handleChangeFilterReviewRating}
        handleChangeFilterReviewComments={handleChangeFilterReviewComments}
      />
    </div>
  );
};

export default ReviewStatsAndFilter;
