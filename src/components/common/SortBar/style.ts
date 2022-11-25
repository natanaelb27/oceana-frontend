/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';
import { Button } from 'react-daisyui';

export const SortBarContainer = tw.div<any>`
  w-full
  p-4
  flex
  flex-col
  justify-between
  gap-2
  bg-base-200
  rounded-3xl

  md:flex-row
  md:items-center
`;

export const SortContainer = tw.div<any>`
  grid
  grid-cols-2
  gap-2

  md:flex
  md:flex-row
  md:items-center
`;

export const SortLabel = tw.label`
  mr-2 
  self-center
  text-lg 
  font-semibold
  truncate
`;

export const SortBtn = tw(Button)<any>`
  rounded-full
`;

export const SortBtnContainer = tw.div<any>`
  flex
  justify-end
  gap-2
`;

export const SortBtnText = tw.p`
  hidden
  md:inline
  md:ml-2
`;
