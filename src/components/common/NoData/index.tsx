import { MouseEventHandler } from 'react';
import { Button } from 'react-daisyui';
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
      <Image
        src={require('./../../../assets/images/no-data.gif')}
        alt='no-data'
        className='object-contain max-w-xs -my-12'
      ></Image>
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
