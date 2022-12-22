import { MouseEventHandler } from 'react';
import { Button } from 'react-daisyui';
import LazyLoad from 'react-lazy-load';
import Image from '../Image';

type NoDataProps = {
  title?: string | null | undefined;
  message?: string | null | undefined;
  buttonMessage?: string | null | undefined;
  buttonHandleClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};

const NoData = ({
  title,
  message,
  buttonMessage,
  buttonHandleClick,
}: NoDataProps) => {
  return (
    <div className='flex flex-col gap-5 text-center items-center'>
      <LazyLoad threshold={0.5}>
        <img
          src={require('./../../../assets/images/no-data.gif')}
          alt='no-data'
          className='object-contain max-w-xs -my-12'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = require('./../../../assets/images/no-image.webp');
          }}
        />
      </LazyLoad>
      <div className='flex flex-col gap-3 text-center items-center max-w-xs'>
        <span className='font-bold text-xl'>{title}</span>
        <span className='font-light'>{message}</span>
        {buttonMessage ? (
          <Button
            color='primary'
            className='normal-case'
            onClick={buttonHandleClick}
          >
            {buttonMessage}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default NoData;
