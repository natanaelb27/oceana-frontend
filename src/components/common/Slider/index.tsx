import { ReactNode } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { SCROLL_SLIDER } from '../../../constants';
import { StyledCarousel } from './style';

type SliderProps = {
  children: ReactNode;
  id: string;
};

const Slider = ({ children, id }: SliderProps) => {
  const handleClickPrev = () => {
    document.getElementById(`slider-${id}`)!.scrollLeft -= SCROLL_SLIDER;
  };
  const handleClickNext = () => {
    document.getElementById(`slider-${id}`)!.scrollLeft += SCROLL_SLIDER;
  };
  return (
    <div className='relative'>
      <StyledCarousel id={`slider-${id}`}>{children}</StyledCarousel>
      <div className='hidden md:inline'>
        <button
          className='absolute -left-6 btn btn-xs btn-circle bg-base-300 text-black drop-shadow-lg border-none md:top-[40%] md:btn-md'
          onClick={handleClickPrev}
        >
          <GrPrevious className='text-xs md:text-lg' />
        </button>
        <button
          className='absolute -right-6 btn btn-xs btn-circle bg-base-300 text-black drop-shadow-lg border-none md:top-[40%] md:btn-md'
          onClick={handleClickNext}
        >
          <GrNext className='text-xs md:text-lg' />
        </button>
      </div>
    </div>
  );
};

export default Slider;
