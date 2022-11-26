/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const FormTitle = tw.h1`
mb-12
text-center
text-6xl
text-base-100
font-bold
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
