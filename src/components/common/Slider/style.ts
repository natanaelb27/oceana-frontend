/* eslint-disable @typescript-eslint/no-explicit-any */
import { Carousel } from 'react-daisyui';
import tw from 'tailwind-styled-components';

export const StyledCarousel = tw(Carousel)<any>`
  carousel-center
  w-full
  pt-2.5
  gap-4
  rounded-box
  
  md:gap-10
  md:px-8
`;

export const SliderNavBtn = tw.button<any>`
  absolute
  btn
  btn-xs
  btn-circle
  bg-base-300
  text-base-content
  hover:bg-base-200
  drop-shadow-lg
  border-none
  md:top-[40%]
  md:btn-md
`;
