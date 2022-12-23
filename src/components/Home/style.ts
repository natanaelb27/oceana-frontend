/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from 'react-daisyui';
import tw from 'tailwind-styled-components';

export const HomeCardContainer = tw.div<any>`
  relative
  max-h-max
  p-5
  pt-3
  border
  border-sm
  border-base-300
  rounded-2xl
  shadow-md
 
  md:p-10
  md:pt-5
`;

export const HomeCardTitle = tw.h2`
  mb-2
  text-lg
  font-bold

  md:mb-4
  md:text-2xl
`;

export const StyledCategoryCard = tw(Card)<any>`
  w-28
  flex
  flex-col 
  items-center 
  text-center 
  gap-2
  border-none 
  p-4
  
  transition 
  transform 
  hover:-translate-y-1 
  hover:bg-base-200
  motion-reduce:transition-none 
  motion-reduce:hover:transform-none
`;
