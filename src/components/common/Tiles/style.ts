/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const TilesContainer = tw.div<any>`
  fixed
  top-0
  left-0
  h-screen
  w-screen

  grid
  grid-cols-tiles
  grid-rows-tiles

  bg-gradient-to-r
  from-primary
  via-secondary
  to-primary
  overflow-hidden
  bg-[size:200%]
  animate-background-pan
  
`;

export const StyledTile = tw.div<any>`
  relative
  cursor-pointer

  before:bg-gray-800
  before:content-[""]
  before:absolute
  before:inset-px
  before:hover:bg-base-content/80
`;
