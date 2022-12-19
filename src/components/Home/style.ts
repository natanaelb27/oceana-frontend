/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from 'react-daisyui';
import tw from 'tailwind-styled-components';

export const HomeCardContainer = tw.div<any>`
  relative
  max-w-[360px]
  max-h-max
  p-5
  pt-3
  border
  border-sm
  border-base-300
  rounded-2xl
  shadow-md
 
  md:max-w-[720px]
  md:p-10
  md:pt-5
  
  lg:max-w-[960px]
  xl:max-w-[1080px]
`;

export const HomeCardTitle = tw.h2`
  mb-2
  text-xl
  font-bold

  md:mb-4
  md:text-2xl
`;

export const StyledCategoryCard = tw(Card)<any>`
  w-[64px]
  flex
  flex-col 
  items-center 
  text-center 
  gap-2 
  border-none 
  
  md:gap-4 
  md:max-h-[26rem] 
  
  transition 
  transform 
  hover:-translate-y-1 
  motion-reduce:transition-none 
  motion-reduce:hover:transform-none
`;
