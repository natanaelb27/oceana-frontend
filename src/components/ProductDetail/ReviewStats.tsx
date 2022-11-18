import { HiStar } from 'react-icons/hi';
import { toCompact } from '../../utils/convert';

type ReviewStatsProps = {
  isLoading?: boolean;
};

const ReviewStats = ({ isLoading }: ReviewStatsProps) => {
  if (isLoading) {
    return (
      <div className='animate-pulse mb-4'>
        <div className='flex items-center justify-center mb-4'>
          <div className='h-16 bg-base-200 rounded-full w-2/5'></div>
        </div>
        <div className='h-4 bg-base-200 rounded-full w-3/5 mx-auto mb-2.5'></div>
        <div className='h-4 bg-base-200 rounded-full w-2/5 mx-auto mb-2.5'></div>
        <div className='flex flex-col gap-y-3'>
          <div className='flex items-center'>
            <div className='h-4 bg-base-200 w-8 mr-2 rounded-full'></div>
            <progress
              className='progress progress-secondary'
              value={0}
              max={1}
            ></progress>
            <div className='h-4 bg-base-200 w-16 ml-2 rounded-full'></div>
          </div>
          <div className='flex items-center'>
            <div className='h-4 bg-base-200 w-8 mr-2 rounded-full'></div>
            <progress
              className='progress progress-secondary'
              value={0}
              max={1}
            ></progress>
            <div className='h-4 bg-base-200 w-16 ml-2 rounded-full'></div>
          </div>
          <div className='flex items-center'>
            <div className='h-4 bg-base-200 w-8 mr-2 rounded-full'></div>
            <progress
              className='progress progress-secondary'
              value={0}
              max={1}
            ></progress>
            <div className='h-4 bg-base-200 w-16 ml-2 rounded-full'></div>
          </div>
          <div className='flex items-center'>
            <div className='h-4 bg-base-200 w-8 mr-2 rounded-full'></div>
            <progress
              className='progress progress-secondary'
              value={0}
              max={1}
            ></progress>
            <div className='h-4 bg-base-200 w-16 ml-2 rounded-full'></div>
          </div>
          <div className='flex items-center'>
            <div className='h-4 bg-base-200 w-8 mr-2 rounded-full'></div>
            <progress
              className='progress progress-secondary'
              value={0}
              max={1}
            ></progress>
            <div className='h-4 bg-base-200 w-16 ml-2 rounded-full'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mb-4'>
      <div className='flex items-center justify-center mb-4'>
        <HiStar className='text-4xl text-warning' />
        <div className='flex items-end'>
          <h2 className='text-6xl'>4.4</h2>
          <p>/5.0</p>
        </div>
      </div>
      <p className='font-bold text-sm text-center mb-2'>
        82% buyers were satisfied
      </p>
      <p className='text-sm text-center mb-4'>17 ratings | 15 reviews</p>
      <div className='flex flex-col gap-y-1'>
        <div className='flex items-center'>
          <div className='flex items-center mr-2'>
            <HiStar className='text-warning' />
            <span className='font-bold'>5</span>
          </div>
          <progress
            className='progress progress-secondary'
            value={75}
            max={100}
          ></progress>
          <div className='ml-2 w-16 text-left'>
            <span>{toCompact(13)}</span>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='flex items-center mr-2'>
            <HiStar className='text-warning' />
            <span className='font-bold'>4</span>
          </div>
          <progress
            className='progress progress-secondary'
            value={5}
            max={100}
          ></progress>
          <div className='ml-2 w-16 text-left'>
            <span>{toCompact(1)}</span>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='flex items-center mr-2'>
            <HiStar className='text-warning' />
            <span className='font-bold'>3</span>
          </div>
          <progress
            className='progress progress-secondary'
            value={5}
            max={100}
          ></progress>
          <div className='ml-2 w-16 text-left'>
            <span>{toCompact(1)}</span>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='flex items-center mr-2'>
            <HiStar className='text-warning' />
            <span className='font-bold'>2</span>
          </div>
          <progress
            className='progress progress-secondary'
            value={5}
            max={100}
          ></progress>
          <div className='ml-2 w-16 text-left'>
            <span>{toCompact(1)}</span>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='flex items-center mr-2'>
            <HiStar className='text-warning' />
            <span className='font-bold'>1</span>
          </div>
          <progress
            className='progress progress-secondary'
            value={5}
            max={100}
          ></progress>
          <div className='ml-2 w-16 text-left'>
            <span>{toCompact(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
