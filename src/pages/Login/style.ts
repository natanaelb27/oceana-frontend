/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const LoginContainer = tw.div<any>`
  h-screen
  flex
  justify-center
  items-center
  bg-base-content
`;

export const FormContainer = tw.div<any>`
  max-w-[600px]
  max-h-[480px]
  p-10
  rounded-3xl
  bg-gradient-to-br
  from-transparent
  via-white/20
  to-transparent
  border-4
  border-slate-400
  shadow-2xl

  md:w-[600px]
`;

export const FormTitle = tw.h1`
  mb-12
  text-center
  text-6xl
  font-bold
  text-base-100
`;

export const FormErrorText = tw.p`
  ml-3
  text-lg
  text-error
`;

export const InputGroup = tw.div<any>`
  flex
  flex-col
  mb-4
`;
