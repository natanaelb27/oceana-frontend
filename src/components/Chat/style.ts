/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const ChatContainer = tw.div<any>`
    z-90
    fixed 
    bottom-0 
    right-8

    flex
    flex-col
    justify-end
    items-end
`;

export const ChatButton = tw.button<any>`
    absolute

    bg-secondary

    transition-transform
    duration-500

    shadow-base-content
    hover:shadow-base-content
    shadow-sm
    hover:shadow-md

    w-20
    py-2
    px-14

    rounded-b-none
    rounded-t-lg

    flex
    items-center
    justify-center

    text-neutral-content
    font-bold
`;

export const ChatBoxContainer = tw.div<any>`
    sticky

    h-[80vh]
    w-[80vw]
    md:h-[60vh]
    md:w-[50vw]
    
    shadow

    border-[0.5px]
    border-base-content/20

    rounded-t-lg

    bg-base-100
`;
