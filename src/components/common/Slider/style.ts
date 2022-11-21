/* eslint-disable @typescript-eslint/no-explicit-any */
import { Carousel } from 'react-daisyui';
import tw from 'tailwind-styled-components';


export const StyledCarousel = tw(Carousel)<any>`
  carousel-center
  w-full
  p-4
  space-x-10
  border-sm
  bg-base-300
  rounded-box
  
  md:space-x-24
`;
