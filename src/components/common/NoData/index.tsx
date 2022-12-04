import { MouseEventHandler } from 'react';
import { Button } from 'react-daisyui';

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
      <img
        src={require('./../../../assets/images/no-data.png')}
        alt='no-data'
        className='object-contain h-48 w-96'
      ></img>
      <div className='flex flex-col gap-3 text-center items-center w-96'>
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
