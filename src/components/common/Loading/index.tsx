import { useEffect, useState } from 'react';

type LoadingProps = {
  isLoading?: boolean;
  delay?: number;
};

const Loading = ({ isLoading, delay = 0 }: LoadingProps) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`${
        isLoading ? 'visible' : 'invisible'
      } fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-base-100 flex flex-col items-center justify-center transition-2 duration-1000`}
    >
      <h1 className='text-center text-primary text-4xl mb-2.5 animate-bounce font-semibold'>
        Loading...
      </h1>
      <p className='w-1/3 text-center text-base-content'>
        This may take a few seconds, please don&apos;t close this page.
      </p>
    </div>
  );
};

export default Loading;
