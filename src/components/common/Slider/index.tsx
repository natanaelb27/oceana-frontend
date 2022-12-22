import { ReactNode } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { SCROLL_SLIDER } from '../../../constants';
import { SliderNavBtn } from './style';

type SliderProps = {
  children: ReactNode;
  id: string;
};

const Slider = ({ children, id }: SliderProps) => {
  const handleClickPrev = () => {
    const slider = document.getElementById(`slider-${id}`);
    if (slider) slider.scrollLeft -= SCROLL_SLIDER;
  };
  const handleClickNext = () => {
    const slider = document.getElementById(`slider-${id}`);
    if (slider) slider.scrollLeft += SCROLL_SLIDER;
  };

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

  return (
    <div>
      <div
        id={`slider-${id}`}
        className='carousel rounded-box gap-4 md:mx-8 py-1'
      >
        {children}
      </div>
      <div className='hidden md:block'>
        <SliderNavBtn className='left-2' onClick={handleClickPrev}>
          <MdNavigateBefore className='text-xs md:text-3xl' />
        </SliderNavBtn>
        <SliderNavBtn className='right-2' onClick={handleClickNext}>
          <MdNavigateNext className='text-xs md:text-3xl' />
        </SliderNavBtn>
      </div>
    </div>
  );
};

export default Slider;
