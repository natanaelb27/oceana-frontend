import { useEffect, useState } from 'react';
import { Countdown } from 'react-daisyui';

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

  return (
    <div className='grid items-center font-bold grid-flow-col text-center auto-cols-max mt-0.5'>
      <Countdown value={hours} className='font-mono' />
      <span className='font-mono'>:</span>
      <Countdown value={minutes} className='font-mono' />
      <span className='font-mono'>:</span>
      <Countdown value={parseInt(seconds.toFixed(0))} className='font-mono' />
    </div>
  );
};

export default DateCountdown;
