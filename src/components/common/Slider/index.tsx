import { ReactNode } from 'react';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { SCROLL_SLIDER } from '../../../constants';
import { SliderNavBtn, StyledCarousel } from './style';

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
  return (
    <div className='relative'>
      <StyledCarousel id={`slider-${id}`}>{children}</StyledCarousel>
      <div className='hidden md:inline'>
        <SliderNavBtn className='-left-6' onClick={handleClickPrev}>
          <MdNavigateBefore className='text-xs md:text-3xl' />
        </SliderNavBtn>
        <SliderNavBtn className='-right-6' onClick={handleClickNext}>
          <MdNavigateNext className='text-xs md:text-3xl' />
        </SliderNavBtn>
      </div>
    </div>
  );
};

export default Slider;
