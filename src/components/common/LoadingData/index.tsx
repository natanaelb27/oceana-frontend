import LazyLoad from 'react-lazy-load';

type LoadingDataProps = {
  title?: string | null | undefined;
  message?: string | null | undefined;
};

const LoadingData = ({ title, message }: LoadingDataProps) => {
  return (
    <div className='flex flex-col gap-5 text-center items-center'>
      <LazyLoad threshold={0.5}>
        <img
          src={require('./../../../assets/images/loading.gif')}
          alt='no-data'
          className='object-contain max-w-xs -my-12'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = require('./../../../assets/images/no-image.webp');
          }}
        />
      </LazyLoad>
      <div className='flex flex-col gap-3 text-center items-center max-w-xs'>
        <span className='font-bold text-xl'>{title || 'Loading...'}</span>
        <span className='font-light'>
          {message || 'Waiting for your data to be loaded'}
        </span>
      </div>
    </div>
  );
};

export default LoadingData;
