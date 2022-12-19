import { ReactNode } from 'react';

type SliderProps = {
  children: ReactNode;
};

const Slider = ({ children }: SliderProps) => {
  if (!children || (children as Array<ReactNode>).length === 0)
    return (
      <div className='carousel rounded-box gap-4 animate-pulse'>
        {Array.from({ length: 30 }, (_, index) => index + 1).map((i) => {
          return (
            <div className='carousel-item' key={i}>
              <div className='w-28 flex flex-col items-center text-center gap-2 border-none p-4'>
                <div className='h-20 w-full bg-base-200 rounded-box'></div>
                <div className='h-4 w-full bg-base-200 rounded-full'></div>
              </div>
            </div>
          );
        })}
      </div>
    );

  return <div className='carousel rounded-box gap-4'>{children}</div>;
};

export default Slider;
