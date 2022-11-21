/* eslint-disable @typescript-eslint/no-explicit-any */
import { Carousel } from 'react-daisyui';
import tw from 'tailwind-styled-components';

export const HomeCardContainer = tw.div<any>`
  w-screen
  h-40
  my-5
  p-5
  border
  border-sm
  rounded-2xl
  shadow-md
  
  lg:w-[1080px]
  lg:h-72
  lg:max-h-80
`;

export const HomeCardTitle = tw.h2`
  mb-2
  text-xl
  font-bold
  lg:text-3xl
`;

export const HomeStyledCarousel = tw(Carousel)<any>`
  carousel-center
  w-full
  p-4
  space-x-10
  border-sm
  bg-base-300
  rounded-box
  
  md:space-x-24
`;
