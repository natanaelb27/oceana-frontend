/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const TilesContainer = tw.div<any>`
  fixed
  top-0
  left-0
  h-screen
  w-screen
  -z-10

  grid
  grid-cols-tiles
  grid-rows-tiles
`;
