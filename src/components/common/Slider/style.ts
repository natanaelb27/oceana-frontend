/* eslint-disable @typescript-eslint/no-explicit-any */
import { Carousel } from 'react-daisyui';
import tw from 'tailwind-styled-components';

export const StyledCarousel = tw(Carousel)<any>`
  carousel-center
  w-full
  p-4
  px-6
  gap-10
  bg-base-200
  rounded-box
  
  md:gap-24
  md:px-12
`;

export const SliderNavBtn = tw.button<any>`
  absolute
  btn
  btn-xs
  btn-circle
  bg-base-300
  text-base-content
  drop-shadow-lg
  border-none
  md:top-[40%]
  md:btn-md
`;
