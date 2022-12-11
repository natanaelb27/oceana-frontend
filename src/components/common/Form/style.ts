/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink } from 'react-router-dom';
import tw from 'tailwind-styled-components';

export const FormTitleContainer = tw.div<any>`
  w-full
  flex
  justify-center
  mb-8
`;

export const FormTitle = tw(NavLink)<any>`
  rounded-xl
  p-4
  text-center
  text-5xl
  text-primary-content
  font-bold

  md:text-6xl

  transition
  transform
  hover:-translate-y-1
  motion-reduce:transition-none
  motion-reduce:hover:transform-none
`;

export const FormErrorText = tw.p<any>`
  ml-3
  text-lg
  text-error
`;

export const InputGroup = tw.div<any>`
  flex
  flex-col
  mb-4
`;

export const FormCTA = tw.p<any>`
  mt-2
  text-primary-content
`;

export const StyledDivider = tw.span`
  my-4
  block
  text-xl
  text-center
  text-primary-content
`;
