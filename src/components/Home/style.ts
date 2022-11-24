/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const HomeCardContainer = tw.div<any>`
  relative
  w-screen
  max-h-max
  p-5
  pt-3
  border
  border-sm
  border-base-300
  rounded-2xl
  shadow-md
  
  md:w-[1080px]
  md:p-10
  md:pt-5
`;

export const HomeCardTitle = tw.h2`
  mb-2
  text-xl
  font-bold

  md:mb-4
  md:text-3xl
`;
