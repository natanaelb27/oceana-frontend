/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const FilterSidebarContainer = tw.div<any>`
  absolute
  top-0
  -left-full
  w-screen
  h-screen
  bg-base-200
  shadow-md
  z-40
  ease-in-out
  duration-300
  
  md:relative
  md:w-auto
  md:h-auto
  md:top-0
  md:left-0
  md:rounded-lg
  md:z-0
`;
