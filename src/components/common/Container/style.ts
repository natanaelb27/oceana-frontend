/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const AuthContainer = tw.div<any>`
  h-screen
  flex
  justify-center
  items-center
  bg-base-content
  overflow-auto
`;

export const GlassContainer = tw.div<any>`
  max-w-[480px]
  max-h-[640px]
  p-10
  rounded-3xl
  bg-gradient-to-br
  from-transparent
  via-white/20
  to-transparent
  border-2
  border-slate-400
  shadow-2xl

  md:w-[640px]
`;
