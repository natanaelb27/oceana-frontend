/* eslint-disable @typescript-eslint/no-explicit-any */
import { Carousel } from 'react-daisyui';
import tw from 'tailwind-styled-components';

export const StyledCarousel = tw(Carousel)<any>`
  carousel-center
  w-full
  p-4
  space-x-10
  bg-base-300
  rounded-box
  
  md:space-x-24
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
