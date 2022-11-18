import ReviewFilter from './ReviewFilter';
import ReviewStats from './ReviewStats';

type ReviewStatsAndFilterProps = {
  isLoading?: boolean;
};

const ReviewStatsAndFilter = ({ isLoading }: ReviewStatsAndFilterProps) => {
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
      <ReviewFilter />
    </div>
  );
};

export default ReviewStatsAndFilter;
