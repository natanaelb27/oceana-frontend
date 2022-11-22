/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const HomeCardContainer = tw.div<any>`
  relative
  w-screen
  h-40
  p-5
  border
  border-sm
  border-base-300
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

  md:mb-4
  md:text-3xl
`;
