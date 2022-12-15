import moment from 'moment';
import { useEffect, useState } from 'react';
import { Badge, Countdown } from 'react-daisyui';
import { HiOutlineClock } from 'react-icons/hi';
import { computeDatetime, getDateDiffNow } from '../../../utils/date';

type DateCountdownProps = {
  date: Date | null;
};

const DateCountdown = ({ date = null }: DateCountdownProps) => {
  const [value, setValue] = useState<number>(
    date ? date.getTime() - new Date().getTime() : 0
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(date ? date.getTime() - new Date().getTime() : 0);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  let delta = Math.abs(value) / 1000;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  const seconds = delta % 60;

  if (date) {
    return moment().isBefore(date) ? (
      <Badge color='warning' className='flex gap-1 bg-opacity-50'>
        <HiOutlineClock />
        {computeDatetime(getDateDiffNow(date?.toString() || '')).days > 0 ? (
          <div className='font-bold'>
            <Countdown
              value={
                computeDatetime(getDateDiffNow(date?.toString() || '')).days
              }
            ></Countdown>{' '}
            days
          </div>
        ) : (
          <div className='grid items-center font-bold grid-flow-col text-center auto-cols-max mt-0.5'>
            <Countdown value={hours} className='font-mono' />
            <span className='font-mono'>:</span>
            <Countdown value={minutes} className='font-mono' />
            <span className='font-mono'>:</span>
            <Countdown
              value={parseInt(seconds.toFixed(0))}
              className='font-mono'
            />
          </div>
        )}
      </Badge>
    ) : (
      <Badge color='warning' className='flex gap-1 bg-opacity-50'>
        <HiOutlineClock />
        <div className='grid items-center font-bold grid-flow-col text-center auto-cols-max mt-0.5'>
          <span className='font-mono'>00:00:00</span>
        </div>
      </Badge>
    );
  } else {
    return null;
  }
};

export default DateCountdown;
